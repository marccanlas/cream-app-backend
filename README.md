# AppSync boilerplate
This is a boilerplate AppSync-aurora project, that is deployed using the serverless framework with out of the box support for automated creation of a Serverless database cluster, lambdas, vpcs, security groups, nat gateways, etc. 

## Prerequisites

- Install Docker
- Install Yarn
- Install AWS CLI
- Configure AWS account profile

```shell
$ aws configure
```

```shell
$ yarn
```

## Local setup

Run the following command to setup the local database and run migrations
```shell
./scripts/setup-local.sh
```

## Deployment

Run the following command to deploy to AWS
```shell
sls deploy --stage dev
```

