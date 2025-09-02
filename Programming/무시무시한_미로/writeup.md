# 무시무시한 미로
#### 출제자 : 서재연 / jaexeon
## Concept
- 다익스트라
## Writeup
K의 값이 N*M이하이기 때문에, 미로의 대부분의 칸 사이에 잠긴 문이 위치할 수 있습니다. 
이는 칸을 이동할 때 대부분의 비용이 1이 아닌 값으로 이루어져있다는 뜻이며, 따라서 너비우선탐색을 이용한 미로탐색이 아닌 잠긴 문의 해제 시간을 고려한 다익스트라 탐색 문제가 됩니다.

기본적으로 미로의 형태를 저장하는 배열 Map과 잠긴문을 딕셔너리 자료형을 이용한 Locked 변수로 관리합니다.
N과 M이 100 이하의 값이기 때문에 N*M은 10000 이하로, 딕셔너리로 잠김 상태를 표현하지 않더라도 넉넉히 시간제한을 통과할 수 있습니다.

최종적으로 우선순위 큐를 이용한 다익스트라 탐색을 진행하면 문제가 해결됩니다.
 
## ex.py
```python
import sys
import heapq
input = sys.stdin.readline
INF = 10**18
N, M, K = map(int, input().split())
Map = [list(map(int, input().split())) for _ in range(N)]

Locked = {}

for _ in range(K):
    i, j, p, q, v = map(int, input().split())
    Locked[(i,j,p,q)] = v
    Locked[(p,q,i,j)] = v

start = (0,0)
goal = (N-1, M-1)

def dijkstra(start, goal):
    D = [[INF] * M for _ in range(N)]
    D[start[0]][start[1]] = 0
    heap = [(0, start)]

    while heap:
        cost, node = heapq.heappop(heap)
        cy, cx = node
        if cost > D[cy][cx]:
            continue
        for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < N and 0 <= nx < M and Map[ny][nx] == 1:
                door_cost = Locked.get((cy, cx, ny, nx), 0)
                dist = cost + 1 + door_cost
                if dist < D[ny][nx]:
                    D[ny][nx] = dist
                    heapq.heappush(heap, (dist, (ny, nx)))

    print(D[goal[0]][goal[1]])

dijkstra(start, goal)
```