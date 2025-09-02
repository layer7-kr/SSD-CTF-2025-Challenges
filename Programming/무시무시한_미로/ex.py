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