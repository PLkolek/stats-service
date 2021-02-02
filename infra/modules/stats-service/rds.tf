module "db" {
  source = "terraform-aws-modules/rds/aws"
  version = "~> 2.0"
  identifier = "stats-service-${var.environment}"

  allocated_storage = 5
  engine = "postgres"
  engine_version = "12.5"
  create_db_option_group = false
  instance_class = "db.t3.micro"

  name = "statsservice"
  username = "statsservice"
  password = var.db_password
  port = 5432

  vpc_security_group_ids = [
    module.postgresql_security_group.this_security_group_id
  ]

  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window = "03:00-06:00"

  tags = {
    Environment = var.environment
  }

  # DB subnet group
  subnet_ids = module.vpc.public_subnets
  publicly_accessible = true

  final_snapshot_identifier = "stats-service-${var.environment}-db-final-snapshot"
  deletion_protection = false
  storage_encrypted = true

  enabled_cloudwatch_logs_exports = [
    "postgresql",
    "upgrade"
  ]

  family = "postgres12"
}

module "postgresql_security_group" {
  source  = "terraform-aws-modules/security-group/aws//modules/postgresql"
  version = "~> 3.0"

  name = "stats-service-db-${var.environment}"
  description = "Security group for stats service DB with access from Fargate task and your machine"
  vpc_id = module.vpc.vpc_id

  auto_ingress_rules = []

  ingress_with_source_security_group_id = [
    {
      rule                     = "postgresql-tcp"
      source_security_group_id = module.stats-service_security_group.this_security_group_id
    },
  ]

  ingress_with_cidr_blocks = [
    {
      from_port = 5432
      to_port = 5432
      protocol = "tcp"
      description = "Accept connections from my IP"
      cidr_blocks = "${local.my-ip}/32"
    }
  ]
}
