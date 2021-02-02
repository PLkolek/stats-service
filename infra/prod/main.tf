locals {
  region = "eu-central-1"
  environment = "prod"
}

provider "aws" {
  region = local.region
}

module "stats-service" {
  source = "../modules/stats-service"
  db_password = var.db_password
  environment = local.environment
  fargate-task-definition = file("task-definitions/stats-service.json")
}
