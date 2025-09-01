FROM ubuntu:22.04
RUN apt-get update -y
RUN apt-get install socat passwd -y
RUN adduser osori
WORKDIR /home/osori

USER osori
COPY ./osh ./osh
COPY ./flag.txt /flag.txt

USER root
RUN chown -R root:root /home/osori
RUN chmod 755 /home/osori
RUN chmod 644 /flag.txt
RUN chmod 755 ./osh

CMD socat TCP-LISTEN:15252,reuseaddr,fork EXEC:/home/osori/osh,su=osori,stderr
EXPOSE 1525