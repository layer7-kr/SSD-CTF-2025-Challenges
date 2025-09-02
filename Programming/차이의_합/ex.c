#include <stdio.h>
#include <stdlib.h>

typedef long long ll;

int compare(const void *a, const void *b) {
    int num1 = *(const int *)a;
    int num2 = *(const int *)b;

    if (num1 < num2) return -1;
    if (num1 > num2) return 1;   
    return 0;                   
}

int main()
{
    int N;
    ll list[200000];
    scanf("%d", &N);
    for(int i = 0; i < N; i++)
    {
        scanf("%lld", &list[i]);
    }
    qsort(list, N, sizeof(ll), compare);
    ll sum = 0;
    for(ll i = 0; i < N-1; i++)
    {
        if(i%2 == 0)
        {
            sum += (list[i/2+1]-list[i/2])*((i/2+1)*2);
        }
        else
        {
            sum += (list[N-i/2-1]-list[N-i/2-2])*((i/2+1)*2);
        }
    }
    if(N%2 == 0)
    {
        sum -= list[N/2]-list[N/2-1];
    }
    else
    {
        if(list[N/2+1]-list[N/2] > list[N/2]-list[N/2-1])
        {
            sum -= list[N/2]-list[N/2-1];
        }
        else
        {
            sum -= list[N/2+1]-list[N/2];
        }
    }
    printf("%lld\n", sum);
}