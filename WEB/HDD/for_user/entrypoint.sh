#!/bin/bash

echo "*/5 * * * * pkill -f 'node src/index.js' && node /app/src/index.js &" >> /etc/crontab
cron

useradd -m ctf
chown -R ctf:ctf /app && chmod -R 700 /app
exec su -s /bin/bash -c "node /app/src/index.js" ctf
