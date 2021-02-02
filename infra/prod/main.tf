locals {
  region      = "eu-central-1"
  environment = "prod"
}

provider "aws" {
  region = local.region
}

module "stats-service" {
  source                  = "../modules/stats-service"
  db_password             = var.db_password
  environment             = local.environment
  fargate-task-definition = file("task-definitions/stats-service.json")
}

output "db_host" {
  value = module.stats-service.db_host
}

output "db_password" {
  value     = module.stats-service.db_password
  sensitive = true
}

output "ecr_url" {
  value = module.stats-service.ecr_url
}

