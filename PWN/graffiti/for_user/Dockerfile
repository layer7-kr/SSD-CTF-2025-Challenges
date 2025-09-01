FROM ubuntu:22.04
RUN apt-get update -y
RUN apt-get install socat passwd -y
RUN adduser graffiti
WORKDIR /home/graffiti

USER graffiti
COPY ./graffiti ./graffiti
COPY ./flag.txt ./flag.txt

USER root
RUN chown -R root:root /home/graffiti
RUN chmod 755 /home/graffiti
RUN chmod 644 ./flag.txt
RUN chmod 755 ./graffiti

CMD socat TCP-LISTEN:15252,reuseaddr,fork EXEC:/home/graffiti/graffiti,su=graffiti,stderr
EXPOSE 15252
