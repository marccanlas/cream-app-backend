
#!/bin/bash +x
export NODE_OPTIONS=--openssl-legacy-provider
export STAGE=local
export DB_PASSWORD=password
export CONTAINER_NAME=mysql-demo-db
export DDB_CONTAINER_NAME=dynamo-db-demo
export DB_PORT=3308
export DB_HOST=127.0.0.1
export DB_DIALECT=mysql
export DB_NAME=cream_rds_$STAGE
export DB_USERNAME=admin_$STAGE
export ENVIRONMENT_NAME=local
export DDB_PORT=8001
export USER_POOL_NAME=MyUserPool

if ! docker ps -a --format '{{.Names}}' | grep -w $CONTAINER_NAME &> /dev/null; then
  cd scripts/
  docker compose --env-file ../.env up -d
  sleep 40
  docker exec -it $CONTAINER_NAME mysql -u root --password="$DB_PASSWORD" -e "CREATE USER '$DB_USERNAME'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
  docker exec -it $CONTAINER_NAME mysql -u root --password="$DB_PASSWORD" -e "GRANT ALL PRIVILEGES ON * . * TO '$DB_USERNAME'@'localhost';"
  docker exec -it $CONTAINER_NAME mysql -u root --password="$DB_PASSWORD" -e "UPDATE mysql.user SET host='%' WHERE user='$DB_USERNAME';"
  docker restart $CONTAINER_NAME
  sleep 40
  cd ../
  ./migrations/dynamodb/migrate-dynamodb.sh
  ./seeders/dynamodb/seed-dynamodb.sh
  npx sequelize db:create
  npx sequelize db:migrate
  npx sequelize db:seed:all
else
  docker start $CONTAINER_NAME
  docker start $DDB_CONTAINER_NAME
  sleep 40
  ./migrations/dynamodb/migrate-dynamodb.sh
  npx sequelize db:migrate
fi


yarn start-offline

#yarn start-offline-with-output
