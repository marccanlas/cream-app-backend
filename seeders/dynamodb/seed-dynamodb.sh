
#!/bin/bash +x
aws dynamodb put-item --table-name UsersTable --item "{\"id\":{\"S\":\"test-user-ddb-1\"},\"email\":{\"S\":\"testuser1@testemail.com\"}}" --endpoint-url http://localhost:$DDB_PORT 2>&1 > /dev/null

aws dynamodb put-item --table-name RolesTable --item "{\"id\":{\"S\":\"test-role-ddb-1\"},\"name\":{\"S\":\"Test Role 1\"}}" --endpoint-url http://localhost:$DDB_PORT 2>&1 > /dev/null



