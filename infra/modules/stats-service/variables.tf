variable "environment" {
  default = "prod"
}

variable "db_password" {
  description = "db Password"
}

variable "fargate-task-definition" {
  description = "ECS task definition for stats-service"
}
