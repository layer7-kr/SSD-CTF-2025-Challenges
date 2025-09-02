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
