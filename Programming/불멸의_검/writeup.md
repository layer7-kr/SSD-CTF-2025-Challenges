# 불멸의 검
#### 출제자 : 김승철 / seuch10
## Concept
- 다이나믹 프로그래밍
## Writeup

승철이 레이드에서 얻을 수 있는 가장 좋은 결과는 D일 동안 모두 S랭크 증표를 얻는 것입니다. 승철이 기록할 수 있는 최악은 자신과 등수가 비슷한 사람이 A랭크와 B랭크 증표를 얻어 승철보다 더 높은 등수에 오르는 것입니다. 

승철의 현재 S, A, B랭크 개수를 Ms, Ma, Mb라고 하고 어떤 플레이어의 현재 S, A, B랭크 개수를 Ps, Pa, Pb라 정의합시다. 현재 만약 어떤 플레이어의 Ps가 Ms+D보다 높다면 그 플레이어는 항상 승철보다 등수가 높고, 낮다면 항상 등수가 낮습니다. 만약 값이 서로 같다면 A, B증표 개수에 따라서 승철보다 더 높은 등수에 도달할 여지가 있습니다.

어떤 플레이어의 Ps가 Ms+D와 같을 때를 생각해 봅시다. 이때, 만약 Ma < Pa라면 그 플레이어는 항상 승철보다 등수가 높습니다. 만약 Ma == Pa이고 Mb < Pb여도 그 플레이어는 항상 승철보다 등수가 높습니다. 그러므로 Ma > Pa이거나 Ma == Pa이고 Mb >= Pb 일때만 생각해주면 됩니다.

그러면 그 플레이어가 몇개의 A와 B증표를 얻어야 승철보다 더 높은 등수에 도달할 수 있을까요? 만약 Mb > Pb일 때는 (필요한 A개수, 필요한B개수)에 대하여 (Ma-Pa+1, 0), (Ma-Pa, Mb-Pb+1) 모두 고려해주어야 합니다. 만약 Mb < Pb일 때는 Mb-Pb+1가 0이하의 정수가 되므로 (Ma-Pa+1, 0)만 고려해주면 됩니다. 예를 들어 10 6 5인 플레이어가 승철이가 가지고 있는 10 7 9를 뛰어넘으려 할 때 (2, 0), (1, 5) 두가지 경우 모두 고려해주어야 합니다. 10 4 11인 플레이어가 10 5 9를 뛰어넘으려 할 때 (1,0)만 고려해주면 됩니다.

다만 함정이 있습니다. 레이드에서 제공가능한 총 A, B의 개수는 각각 2D, 3D이지만 한 플레이어는 하루마다 증표를 단 하나만 얻을 수 있습니다. 그러므로 플레이어가 승철의 등수보다 높은 등수를 도달하기 위한 A, B증표 개수의 합이 D를 초과한다면 항상 그 플레이어는 승철의 등수보다 낮을 수밖에 없습니다.

이제 DP를 구현해봅시다. D[i][j]를 승철이 i번째 등수가 되고 제공되고 남은 A증표의 개수가 j개가 될 때 제공되고 남은 B증표의 개수의 최댓값이라고 정의합시다. 그 플레이어가 승철보다 높은 등수에 도달하기 위해 필요한 A, B랭크 증표의 개수를 Ea, Eb라고 정의합시다. 이때 D[i-1][j-Ea]-Eb < D[i][j]이라면 D[i][j]는 D[i-1][j-Ea]-Eb가 될 수 있습니다. 다음과 같이 구현한다면 정렬할 때 든 시간 log N와 검색을 할 때 든 시간 N^2D를 합하여 대략 O(log N+N^2D)이 걸립니다.

## ex.c
```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int player[100][4];
int DP[100][10001];
int level[4];

int compare(const void *a, const void *b);
void howtolevel(int stan, int compared);

int main()
{
    int N, D;
    memset(DP, -1, sizeof(DP));
    scanf("%d %d", &N, &D);
    for(int i = 0; i < N; i++)
    {
        scanf("%d", &player[i][3]);
        for(int j = 0; j < 3; j++)
        {
            scanf("%d", &player[i][j]);
        }
        if(player[i][3] == 1)
        {
            player[i][0] += D;
        }
    }
    qsort(player, N, sizeof(player[0]), compare);
    int idx = 0;
    while(1 != player[idx][3]) 
    {
        idx++;
    }
    int me = idx;
    DP[me][D*2] = D*3;
    while(++idx < N && player[idx][0] == player[me][0])
    {
        howtolevel(me, idx);
        for(int j = idx-1; j >= me; j--)
        {
            for(int k = 0; k <= D*2; k++)
            {
                if(DP[j][k] != -1)
                {
                    if(k-level[0] >= 0 && level[0] <= D)
                    {
                        if(DP[j+1][k-level[0]] < DP[j][k])
                        {
                            DP[j+1][k-level[0]] = DP[j][k];
                        }
                    }
                    if(k-level[2] >= 0 && level[2]+level[3] <= D)
                    {
                        if(DP[j+1][k-level[2]] < DP[j][k]-level[3])
                        {
                            DP[j+1][k-level[2]] = DP[j][k]-level[3];
                        }
                    }
                }
            }
        }
    }
    for(int i = N-1; i >= me; i--)
    {
        for(int j = 0; j <= D*2; j++)
        {
            if(DP[i][j] != -1)
            {
                printf("%d\n", i+1);
                return 0;
            }
        }
    }
}

int compare(const void *a, const void *b) {
    const int *rowA = (const int *)a;
    const int *rowB = (const int *)b;

    for(int i = 0; i < 3; i++)
    {
        if(rowA[i] > rowB[i])
        {
            return -1;
        }
        else if(rowA[i] < rowB[i])
        {
            return 1;
        }
    }
    if(rowA[3] > rowB[3])
    {
        return 1;
    }
    else
    {
        return -1;
    }
    return 0;
}

void howtolevel(int stan, int compared)
{
    level[0] = player[stan][1]-player[compared][1]+1;
    level[1] = 0;
    level[2] = level[0]-1;
    level[3] = player[stan][2] >= player[compared][2] ? player[stan][2]-player[compared][2]+1 : 0;
}
```