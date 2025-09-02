# 술식전개
#### 출제자 : 서재연 / jaexeon
## Concept
- 너비우선탐색, 구현
## Writeup
Visited배열에 방문 여부와 최단거리를 저장합니다.
아카자가 이동할 때는 F만큼 떨어져있으며 무한성의 범위를 벗어나지 않는 방들에 대해 차례대로 방문을 하는 것으로 너비우선탐색을 진행합니다.
이때 F ≤ 900 이고, 시간복잡도는 O(F * N * M)으로, 모든 방을 방문하더라도 시간 제한을 통과합니다.

## ex.py
```python
import sys
from collections import deque
input = sys.stdin.readline

N, M = map(int, input().split())
a, b, c, d = map(int, input().split())
Map = [list(map(int, input().split())) for _ in range(N)]
Visited = [[-1]*M for _ in range(N)]

def sum_domain(y, x):
    total = 0
    for i in range(y - 1, y + 2):
        for j in range(x - 1, x + 2):
            if 0 <= i < N and 0 <= j < M:
                total += Map[i][j]
    return total


def bfs(start):
    nodes = deque()
    nodes.append(start)
    Visited[start[0]][start[1]] = 0 

    while nodes:
        cy, cx = nodes.popleft()

        if (cy, cx) == (a, b):
            return Visited[cy][cx]

        F = sum_domain(cy, cx)

        for dy in range(-F, F + 1):
            dx = F - abs(dy)
            ny = cy + dy
            for nx in [cx + dx, cx - dx]:
                if 0 <= ny < N and 0 <= nx < M:
                    if Visited[ny][nx] == -1:
                        Visited[ny][nx] = Visited[cy][cx] + 1
                        nodes.append((ny, nx))
    return ";("


print(bfs((c, d)))

```