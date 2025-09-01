from inputimeout import inputimeout, TimeoutOccurred
from pwn import *
import random
import time

def prob():
    random.seed(time.time() * 7)
    for i in range(10):
        try:
            print(f"prob num {i + 1}")
            n = random.randrange(1, 200001)
            k = random.randrange(1, 201)
            payload = ""
            for i in range(k // 2):
                payload += f"{random.randrange(1, 1001)} "
            for i in range( k - (k // 2)):
                payload += f"{random.randrange(1, 10001)} "
            input_num = int(inputimeout(prompt=f"{n} {k}\n{payload}\n", timeout=1))
            p = process('./ex')
            p.sendline(f"{n} {k}\n{payload}\n".encode())
            answer_num = int(p.recvline()[:-1])
            p.close()
        except TimeoutOccurred:
            print("timeout")
            exit(1)
        except:
            print("no")
            exit(1)
            
        if input_num == answer_num:
            print("yes")
            print()
        else:
            print("no")
            exit(0)

    print("good")
    try:
        print(open('./flag', 'r').read())
    except:
        print("Can't print flag. Contact admin.")

if __name__ == "__main__":
    prob()
