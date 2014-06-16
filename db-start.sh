title="feedstore-db"
killall mongod
echo -n -e "\033]0;$title\007"
mongod --dbpath feedstore-db