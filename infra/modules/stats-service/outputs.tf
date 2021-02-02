output "db_host" {
  value = module.db.this_db_instance_address
}

output "db_password" {
  value     = module.db.this_db_instance_password
  sensitive = true
}

output "ecr_url" {
  value = aws_ecr_repository.stats-service.repository_url
}
