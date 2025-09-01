# 2025 SSD CTF - find_bird
- - -
- Write-Up Author: Yeonba
- Flag: ssd{fin4lly_y0u_f1nd_b1rd!:ecc5d3ad167fa65}
- - -
## Challenge Description:
- - -
> The bird ran away, please find it!

## Write Up
- - -
해당 문제의 바이너리는 Read와 Write 두 개의 메뉴로 구성되어 있다.

Read : 최대 8바이트를 읽어와 출력

Write : 최대 0x38(56) 바이트를 쓰기 가능

보호기법중 하나인 canary는 스택 곳곳에 위치하게 되는데

Write 기능에서 음수 인덱스를 통한 OOB 읽기가 가능하여, 스택에 저장된 Canary 값을 leak 할 수 있다.

Read 기능에서 오버플로우를 유발할 수 있지만, ret 주소를 덮을 수 있는 범위가 0x10 바이트로 제한되어 있다.
따라서 바로 ROP 체인을 작성하여 실행하는 것이 불가능하다.

그러므로 스택피보팅을 사용하여서 system('/bin/sh') 이 되도록 코드를 짜면 shell을 획득할 수 있다.