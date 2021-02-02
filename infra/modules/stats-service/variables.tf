variable "environment" {
  default = "test"
}

variable "db_password" {
  description = "db Password"
}

variable "fargate-task-definition" {
  description = "ECS task definition for stats-service"
}
