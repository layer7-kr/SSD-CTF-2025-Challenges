// gcc -o catchme catchme.c

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

void get_shell() {
    execve("/bin/sh", NULL, NULL);
}

unsigned int n;
unsigned int a;
void *p;

int main() {

    setvbuf(stdin, 0, _IONBF, 0);
    setvbuf(stdout, 0, _IONBF, 0);

    char buf[0x40];

    printf("get_shell = %p\n", get_shell);

    a = rand() | 1;
    printf("a = %u\n", a);
    printf("input n: ");
    scanf("%u", &n);

    p = buf + (a * n);
    printf("input 8 bytes: ");
    read(0, p, 8);

    return 0;
}
