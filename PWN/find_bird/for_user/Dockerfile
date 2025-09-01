FROM ubuntu:22.04@sha256:b6b83d3c331794420340093eb706a6f152d9c1fa51b262d9bf34594887c2c7ac

RUN apt update
RUN apt-get install -y socat

RUN adduser pwn

WORKDIR /home/pwn

COPY ./flag ./flag
COPY ./chall ./chall

RUN chmod 644 ./flag 
RUN chmod 755 ./chall

USER pwn

EXPOSE 1557
CMD socat TCP-LISTEN:1557,reuseaddr,fork EXEC:./chall,stderr
