
#!/bin/bash +x
aws dynamodb create-table \
  --table-name UsersTable \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=email,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH AttributeName=email,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url http://localhost:$DDB_PORT 2>&1 > /dev/null

aws dynamodb create-table \
  --table-name RolesTable \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=name,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH AttributeName=name,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url http://localhost:$DDB_PORT 2>&1 > /dev/null

