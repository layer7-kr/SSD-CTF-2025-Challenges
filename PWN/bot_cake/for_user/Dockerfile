FROM ubuntu:24.04@sha256:7c06e91f61fa88c08cc74f7e1b7c69ae24910d745357e0dfe1d2c0322aaf20f9

RUN apt update
RUN apt install -y socat

COPY ./submission /app
RUN chmod -R 744 /app
WORKDIR /app

EXPOSE 20100
CMD socat TCP-LISTEN:20100,reuseaddr,fork EXEC:./prob