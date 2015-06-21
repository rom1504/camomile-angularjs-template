cd /usr/share/nginx/html
sed "s|CAMOMILE_API|${CAMOMILE_API}|" js/config.TEMPLATE.js > js/config.js 
nginx -g "daemon off;"
