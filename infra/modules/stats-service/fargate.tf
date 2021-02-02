resource "aws_ecr_repository" "stats-service" {
  name = "stats-service"
}

resource "aws_ecr_lifecycle_policy" "remove-old-untagged-images" {
  repository = aws_ecr_repository.stats-service.name

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep only 10 ${var.environment} images",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ["${var.environment}"],
                "countType": "imageCountMoreThan",
                "countNumber": 10
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}


resource "aws_ecs_cluster" "stats-service" {
  name = "stats-service-${var.environment}"
}

resource "aws_ecs_service" "stats-service" {
  name = "stats-service-${var.environment}"
  cluster = aws_ecs_cluster.stats-service.id
  launch_type = "FARGATE"
  task_definition = aws_ecs_task_definition.stats-service.arn
  desired_count = 1
  network_configuration {
    subnets = [
      module.vpc.public_subnets[0]
    ]
    assign_public_ip = true
    security_groups = [
      module.stats-service_security_group.this_security_group_id
    ]
  }

  lifecycle {
    //it is updated during new version deployment
    ignore_changes = [
      task_definition
    ]
  }
}

resource "aws_ecs_task_definition" "stats-service" {
  family = "stats-service"
  container_definitions = var.fargate-task-definition
  requires_compatibilities = [
    "FARGATE"
  ]
  cpu = "256"
  memory = "512"
  network_mode = "awsvpc"
  execution_role_arn = aws_iam_role.ecsTaskExecutionRole.arn
  task_role_arn = aws_iam_role.stats-service-task-role.arn
  lifecycle {
    //it is updated during deployment by Gitlab
    ignore_changes = [
      container_definitions
    ]
  }
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name = "ecs_task_execution_role-${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole" {
  role = aws_iam_role.ecsTaskExecutionRole.id
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

//it is used in `task-definitions/stats-service.json`, keep the name in sync
resource "aws_cloudwatch_log_group" "stats-service" {
  name = "stats-service-${var.environment}"
}

module "stats-service_security_group" {
  version = "3.17.0"
  source = "terraform-aws-modules/security-group/aws"

  name = "stats-service-${var.environment}"
  description = "Security group for stats service backend with HTTP ports open"
  vpc_id = module.vpc.vpc_id

  egress_rules = ["all-all"]

  ingress_with_cidr_blocks = [
    {
      from_port = 3000
      to_port = 3000
      protocol = "tcp"
      description = "Accept connections from my IP"
      cidr_blocks = "${local.my-ip}/32"
    }
  ]
}
