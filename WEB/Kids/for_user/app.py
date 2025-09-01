import os
import json
from pathlib import Path
from typing import Optional, Tuple

from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa


APP_PORT = int(os.environ.get("PORT", "8000"))
DATA_ROOT = Path(os.environ.get("DATA_ROOT", "/data")).resolve()
KEYS_DIR = DATA_ROOT / "keys"
UPLOADS_DIR = DATA_ROOT / "uploads"
USERS_DB = DATA_ROOT / "users.json"

SERVER_PRIV = KEYS_DIR / "server_private.pem"
SERVER_PUB = KEYS_DIR / "server_public.pem"

DEFAULT_FLAG = os.environ.get("FLAG", "SSD{ALT}")


def ensure_dirs():
    (DATA_ROOT).mkdir(parents=True, exist_ok=True)
    (KEYS_DIR).mkdir(parents=True, exist_ok=True)
    (UPLOADS_DIR).mkdir(parents=True, exist_ok=True)


def generate_server_keys_if_needed():
    if SERVER_PRIV.exists() and SERVER_PUB.exists():
        return
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    priv_pem = key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )
    pub_pem = key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )
    SERVER_PRIV.write_bytes(priv_pem)
    SERVER_PUB.write_bytes(pub_pem)


def load_users() -> dict:
    if not USERS_DB.exists():
        return {}
    try:
        return json.loads(USERS_DB.read_text("utf-8"))
    except Exception:
        return {}


def save_users(users: dict) -> None:
    USERS_DB.write_text(json.dumps(users, ensure_ascii=False, indent=2), "utf-8")


def issue_token(username: str) -> str:
    private_key = SERVER_PRIV.read_text("utf-8")
    headers = {"alg": "RS256", "kid": str(SERVER_PUB)}
    payload = {"sub": username}
    token = jwt.encode(payload, private_key, algorithm="RS256", headers=headers)
    return token


def decode_token_with_kid(token: str) -> Tuple[Optional[dict], Optional[str]]:
    try:
        header = jwt.get_unverified_header(token)
        kid_path = header.get("kid")
        if not isinstance(kid_path, str) or not kid_path:
            return None, None
        if kid_path.startswith("/"):
            key_path = Path(kid_path)
        else:
            key_path = (Path.cwd() / kid_path).resolve()
        pub_pem = key_path.read_text("utf-8")
        payload = jwt.decode(
            token,
            pub_pem,
            algorithms=["RS256"],
            options={"require": ["sub"], "verify_aud": False},
        )
        return payload, str(payload.get("sub"))
    except Exception:
        return None, None


def require_auth(fn):
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "missing_bearer"}), 401
        token = auth.split(" ", 1)[1]
        payload, username = decode_token_with_kid(token)
        if not payload or not username:
            return jsonify({"error": "invalid_token"}), 401
        request.jwt_payload = payload
        request.username = username
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


app = Flask(__name__)


@app.route("/session/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    if not username or not password:
        return jsonify({"error": "username_password_required"}), 400
    users = load_users()
    if username in users:
        return jsonify({"error": "username_taken"}), 409
    users[username] = {
        "password": generate_password_hash(password),
        "uploads_dir": str((UPLOADS_DIR / username).as_posix()),
    }
    (UPLOADS_DIR / username).mkdir(parents=True, exist_ok=True)
    save_users(users)
    return jsonify({"ok": True}), 201


@app.route("/session/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    users = load_users()
    rec = users.get(username)
    if not rec or not check_password_hash(rec.get("password", ""), password):
        return jsonify({"error": "invalid_credentials"}), 401
    token = issue_token(username)
    return jsonify({"token": token, "kid": str(SERVER_PUB)})


@app.route("/account/profile", methods=["GET"])
@require_auth
def profile():
    users = load_users()
    rec = users.get(request.username) or {}
    return jsonify({
        "username": request.username,
        "uploads_dir": rec.get("uploads_dir"),
    })


@app.route("/account/avatar", methods=["POST"])
@require_auth
def upload_avatar():
    if "avatar" not in request.files:
        return jsonify({"error": "avatar_file_required"}), 400
    f = request.files["avatar"]
    dest_dir = (UPLOADS_DIR / request.username)
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path = dest_dir / "avatar"
    f.stream.seek(0)
    dest_path.write_bytes(f.read())
    return jsonify({"path": str(dest_path) }), 201


@app.route("/admin", methods=["GET"])
@require_auth
def admin():
    if request.jwt_payload.get("sub") == "superadmin":
        return jsonify({"flag": DEFAULT_FLAG})
    return jsonify({"error": "forbidden"}), 403


@app.route("/healthz", methods=["GET"])
def healthz():
    return jsonify({"ok": True})


def _init_app():
    ensure_dirs()
    generate_server_keys_if_needed()


_init_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=APP_PORT)
