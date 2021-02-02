data "aws_availability_zones" "available" {
  state = "available"
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "2.68.0"

  name = "stats-service-vpc-${var.environment}"
  cidr = "10.0.0.0/16"

  azs = [
    data.aws_availability_zones.available.names[0],
    data.aws_availability_zones.available.names[1]
  ]

  public_subnets = [
    "10.0.101.0/24",
    "10.0.102.0/24",
  ]

  enable_nat_gateway = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Environment = var.environment
  }
}
