resource "aws_ssm_parameter" "db_url" {
  name = "/config/stats-service_${var.environment}/DB_HOST"
  type = "String"
  value = module.db.this_db_instance_address
}

resource "aws_ssm_parameter" "db_port" {
  name = "/config/stats-service_${var.environment}/DB_PORT"
  type = "String"
  value = module.db.this_db_instance_port
}

resource "aws_ssm_parameter" "db_password" {
  name = "/config/stats-service_${var.environment}/DB_PASSWORD"
  type = "SecureString"
  value = module.db.this_db_instance_password
}
