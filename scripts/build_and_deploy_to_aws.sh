#!/usr/bin/env bash
set -e

AWS_REGION=eu-central-1
DOCKER_REGISTRY_URL=898342449263.dkr.ecr.eu-central-1.amazonaws.com

COMMIT_HASH=$(git rev-parse --short HEAD)
IMAGE_TAG=$DOCKER_REGISTRY_URL/stats-service:${COMMIT_HASH}

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $DOCKER_REGISTRY_URL
docker build -t stats-service .
docker tag stats-service:latest $DOCKER_REGISTRY_URL/stats-service:latest
docker tag stats-service:latest $DOCKER_REGISTRY_URL/stats-service:${COMMIT_HASH}
docker push $DOCKER_REGISTRY_URL/stats-service:latest
docker push $DOCKER_REGISTRY_URL/stats-service:${COMMIT_HASH}

TASK_DEFINTION_NAME=stats-service
CLUSTER_NAME=stats-service-prod
SERVICE_NAME=stats-service-prod

TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition "$TASK_DEFINTION_NAME" --region "${AWS_REGION}")
NEW_TASK_DEFINITION=$(echo $TASK_DEFINITION | jq --arg IMAGE "$IMAGE_TAG" '.taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')
NEW_TASK_INFO=$(aws ecs register-task-definition --region "${AWS_REGION}" --cli-input-json "$NEW_TASK_DEFINITION")
NEW_REVISION=$(echo $NEW_TASK_INFO | jq '.taskDefinition.revision')
aws ecs update-service --region "${AWS_REGION}" --cluster "${CLUSTER_NAME}" --service "${SERVICE_NAME}"  --task-definition "${TASK_DEFINTION_NAME}:${NEW_REVISION}"
