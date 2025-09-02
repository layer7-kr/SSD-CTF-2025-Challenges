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