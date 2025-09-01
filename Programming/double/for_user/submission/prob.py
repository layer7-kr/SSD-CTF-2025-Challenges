from inputimeout import inputimeout, TimeoutOccurred
from pwn import *
import random
import time

def prob():
    random.seed(time.time() * 7)
    for i in range(10):
        try:
            print(f"prob num {i + 1}")
            a = random.randrange(2, 101)
            b = random.randrange(1, 2 * a - 1) + (a - 1) * (a - 1)
            c = random.randrange(2, 2000000000)
            input_num = int(inputimeout(prompt=f"{a} {b} {c}\n", timeout=1))
            p = process('./ex')
            p.sendline(f"{a} {b} {c}".encode())
            answer_num = int(p.recvline()[:-1])
            p.close()
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
