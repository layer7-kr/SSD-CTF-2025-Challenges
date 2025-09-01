#!/usr/bin/env bash
set -euo pipefail

: "${WORDPRESS_DB_HOST:?must}"
: "${WORDPRESS_DB_USER:?must}"
: "${WORDPRESS_DB_PASSWORD:?must}"
: "${WORDPRESS_DB_NAME:?must}"
: "${SITE_URL:?must}"
FLAG_VALUE="${FLAG:-SSD{WP_Recon_Vulner_Cve_20175487}}"

echo "[*] Waiting for DB at $WORDPRESS_DB_HOST ..."
for i in $(seq 1 120); do
  if mysql -h"${WORDPRESS_DB_HOST%%:*}" -u"$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" -e "SELECT 1" >/dev/null 2>&1; then
    break
  fi
  echo "  ... retry $i"
  sleep 1
done

cd /var/www/html

# wp-config.php
if [ ! -f wp-config.php ]; then
  echo "[*] Creating wp-config.php"
  wp config create --allow-root \
    --dbname="$WORDPRESS_DB_NAME" \
    --dbuser="$WORDPRESS_DB_USER" \
    --dbpass="$WORDPRESS_DB_PASSWORD" \
    --dbhost="$WORDPRESS_DB_HOST" \
    --skip-check
fi

# Core 설치 + 계정/플래그 세팅
if ! wp core is-installed --allow-root; then
  echo "[*] Installing WordPress core"
  wp core install --allow-root \
    --url="$SITE_URL" \
    --title="CTF Blog" \
    --admin_user="hSpace" \
    --admin_password="Hspace33*" \
    --admin_email="admin@example.com" \
    --skip-email

  # 사용자 생성 (이미 있으면 skip)
  wp user get writer --allow-root >/dev/null 2>&1 || \
    wp user create writer writer@example.com --role=author --user_pass=writerpass --allow-root

  wp user get backup-bot --allow-root >/dev/null 2>&1 || \
    wp user create backup-bot backup@example.com --role=administrator --user_pass=supersecret --allow-root

  # 플래그 주입 (backup-bot의 profile description)
  wp user meta update backup-bot description "$FLAG_VALUE" --allow-root

  # 컬렉션(/users)에 보이도록 backup-bot으로 게시글 1개 발행
  BID="$(wp user get backup-bot --field=ID --allow-root)"
  wp post create --allow-root \
    --post_author="$BID" \
    --post_status=publish \
    --post_title="Backup Report #999" \
    --post_content="Nightly backup completed." >/dev/null
fi

# robots.txt / sitemap: 없을 때만 생성 (운영 중 수동 수정 유지)
if [ ! -f /var/www/html/robots.txt ]; then
  cat > /var/www/html/robots.txt <<'ROBOTS'
User-agent: *
Sitemap: /sitemap.xml
ROBOTS
fi

if [ ! -f /var/www/html/sitemap.xml ]; then
  cat > /var/www/html/sitemap.xml <<'SITEMAP'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>/?rest_route=/wp/v2/</loc></url>
  <url><loc>/wp-json/wp/v2/types</loc></url> 
  <url><loc>/wp-json/wp/v2/taxonomies</loc></url>
  <url><loc>/wp-json/wp/v2/pages</loc></url>
</urlset>
SITEMAP
fi


# 자동 업데이트 끔
if ! grep -q "AUTOMATIC_UPDATER_DISABLED" wp-config.php; then
  echo "define('AUTOMATIC_UPDATER_DISABLED', true);" >> wp-config.php
fi

echo "[*] Ready. Starting Apache..."
exec apache2-foreground
