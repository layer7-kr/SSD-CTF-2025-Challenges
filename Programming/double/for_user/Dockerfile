FROM ubuntu:24.04@sha256:7c06e91f61fa88c08cc74f7e1b7c69ae24910d745357e0dfe1d2c0322aaf20f9

RUN apt update && \
    apt install -y python3 python3-pip socat && \
    pip install --no-cache-dir inputimeout pwntools --break-system-packages

COPY ./submission /app
RUN chmod -R 744 /app
WORKDIR /app

EXPOSE 20101

CMD socat TCP-LISTEN:20101,reuseaddr,fork EXEC:"python3 prob.py"
