resource "aws_iam_role" "stats-service-task-role" {
  name = "stats-service-task-role-${var.environment}"

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

resource "aws_iam_role_policy_attachment" "backend-role-ssm" {
  role = aws_iam_role.stats-service-task-role.id
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}
