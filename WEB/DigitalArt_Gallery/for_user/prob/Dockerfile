FROM php:7.4-apache

RUN echo "phar.readonly = Off" >> /usr/local/etc/php/conf.d/docker-php-ext-phar.ini

RUN a2enmod rewrite

COPY . /var/www/html/
RUN chmod 777 /var/www/html/gallery

RUN rm -rf /var/www/html/flag.txt
COPY flag.txt /flag.txt
RUN chmod 444 /flag.txt

RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
