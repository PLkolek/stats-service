# Simple Stats Service

## Spec assumptions and deviations

I created an additional endpoint for creating courses (POST /courses), useful in local and e2e testing.

There is a possible weird case in the spec. If a course has N modules, and the user studied some modules more than once, his totalModulesStudied can exceed the total number of modules in the course. He could also study 1 module N times and it would look like he completed the course. To fix this, this would have to be aware of module ids and track these. I sticked to the spec and just count the total number.

There is no authentication and no authorization. Auth is not a concern for stats-service, should be handled by a separate service. I assumed that if there is Authorization header in the spec, the user was already authorized somewhere else or that it's out of scope for this task.

## Technology choices

* TypeScript - obviously ;)
* Nest.js - similar to Spring Boot, great documentation, provides a clean structure and architecture out of the box
* Sequelize - because I had a bad experience with TypeORM. With such a complicated piece of software like ORM =, better stick to something battle-tested (and Sequelize seems battle tested)
* Postgres - as they say, non-relational DBs optimize for speed, relational DBs for ease of evolution. This project is just starting, so it's nice to have something enforcing correctness in the data and enabling easy implementation of future use-cases. And when it comes to relational DBs, one can't go wrong with Postgres (Open-Source, predictable, battle tested)

## Project structure

```
/
  config/       # config for DB migrations
  infra/        # Terraform for creating infrastructure in AWS (see part about Terraform)
  migrations/   # DB migrations
    helpers/    # helpers for simplifying migration scripts and enforcing consistent Db structure
  scripts/      # deployment scripts (and possibly other in the future)
  src/          # well... (see part about code structure)
  test/         # well... (see part about tests)
```

## Code structure

The app is split into Nest modules in `modules/` directory. `app` is the main one, registering global guards and pipes and including other modules.

## Tests

The whole REST API is covered with end-to-end tests. With such a simple project, there was no need for more specialized, smaller and faster unit tests - the whole run takes around 10 seconds, covers almost everything and guarantees the contract of the service.

Tests which have to be repeated for each endpoint (i.e. auth tests) are extracted into `helpers/` and reused. There also is `factory.ts` for easy creation of test data.

## Migrations

One can spot a recurring pattern in different projects, where every time a table or column has to be added to the database, 
a developer copy-pastes existing mutation and introduces some changes. And, just like we have mutations in the DNA which occur during copying, mutations occur in migrations. After a while, all hell breaks lose, and we get: inconsistent types and naming, missing auditing columns, triggers and so on.

To alleviate that at least partially, common parts of each column definition were extracted into `helpers/`, allowing the developer to focus on the content of his table and get the basics right.

## Infrastructure

The project can be deployed to AWS using Terraform. The infrastructure was prepared for one environment, but `.tf` files are more or less ready for additional environments - all the project components are in `modules/stats-service`. This module can be used by different environments (`prod/`) to create its own infra. Of course, an attempt to create a second environment may blow up, as I haven't tested it, i.e. due to some resources being global or conflicting names, but these should be fairly simple to fix.

The app is packaged into a Docker container, uploaded to ECR and then deployed into Fargate. Fargate is nice for such use case, as one can just drop a container there and not worry about underlying EC2 machines. Moreover, it's much simpler (and cheaper) than Kubernetes (but why would anyone use Kubernetes to orchestrate one container?). It's not replicated, has no load balancer - it's a dead simple deployment, no high availability. It's not hidden in a private network behind API gateway, has a public IP - again, dead simple. Due to lack of authorization, by access to it is limited by security group to the public IP of a machine on which `terraform apply` was run.

Postgres is running on RDS. Just like Fargate, it allows access from _your IP_ and also from the app's container, obviously. Database host, port and password in SSM and the app reads them on startup when run in AWS. Locally, it uses `.env` for this purpose.

## Nice stuff I haven't done, but would do
Everyone wants to build a perfect a program, but also one has to stop somewhere, so below is an incomplete list of things I had in mind but didn't do. I'd say it's because of time constraints, despite these being unknown :)

* integrate husky and lint-staged for precommit prettier and eslint
* swagger for API documentation
* custom id types - currently every id is passed as string, so one can pass courseId where userId is expected and vice versa. Wrapper types could be used, giving more type safety
* ParseUUIDPipe doesn't report which argument failed parsing
* due to an issue in Sequelize v6 casting is needed: https://github.com/sequelize/sequelize/issues/12842
* faker.js can't generate unique values, making tests a little fragile (a little, I haven't experienced it :))
* spinning up a clean database for e2e tests
* config for migrations is provided separately  
* migrations are written in JS, not TS :(
* use umzug to run migrations on app startup instead of manually
* CI/CD with Gitlab CI or Github Actions

## Running

### Prerequisites

* [nvm](https://github.com/nvm-sh/nvm)
* [Docker](https://www.docker.com/))
* [jq](https://stedolan.github.io/jq/)
* [AWS CLI](https://aws.amazon.com/cli/)
* [tfenv](https://github.com/tfutils/tfenv)

### Running locally
```
nvm use
npm install
docker-compose -f docker-compose-local.yml up -d
npx sequelize-cli db:migrate
npm run start:dev # npm test:e2e
```

### Deploying to AWS

```
aws configure
cd infra/prod
echo 'db_password = "YOUR_DB_PASSWORD" > secret.tfvars'
tfenv use
terraform init
terraform apply -var-file="secret.tfvars"
cd ../../

# fill prod.host and prod.password in config/config.json based on output from terraform

env NODE_ENV=prod npx sequelize-cli db:migrate

# fill AWS_REGION and DOCKER_REGISTRY_URL in scripts/build_and_deploy_to_aws.sh
# based on output from terraform

npm run deploy
```

Check if the task started properly in AWS Console, check out the public IP and start testing!
