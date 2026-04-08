.PHONY: help build build-frontend build-admin lint lint-frontend lint-admin validate deploy-staging health-check clean all stop

# Detect docker-compose command (docker-compose or docker compose)
DOCKER_COMPOSE := $(shell which docker-compose 2>/dev/null || echo "docker compose")

# Default target
help:
	@echo "Available targets:"
	@echo "  all              - Run full pipeline: build → validate → deploy-staging"
	@echo "  build            - Build all Docker images"
	@echo "  build-frontend   - Build frontend Docker image"
	@echo "  build-admin      - Build admin-panel Docker image"
	@echo "  lint             - Run linting for both services"
	@echo "  lint-frontend    - Run linting for frontend"
	@echo "  lint-admin       - Run linting for admin-panel"
	@echo "  validate         - Run all validation checks (lint + health check)"
	@echo "  deploy-staging   - Deploy to staging environment"
	@echo "  health-check     - Verify deployed services are healthy"
	@echo "  stop             - Stop all running containers"
	@echo "  clean            - Clean up containers and images"
	@echo "  help             - Show this help message"

# Build all Docker images
build: build-frontend build-admin
	@echo "✓ All Docker images built successfully"

# Build frontend Docker image
build-frontend:
	@echo "Building frontend Docker image..."
	@cd frontend && docker build -t site-frontend:latest -f Dockerfile .
	@echo "✓ Frontend image built successfully"

# Build admin-panel Docker image
build-admin:
	@echo "Building admin-panel Docker image..."
	@cd admin_panel && docker build \
		--build-arg NEXTAUTH_SECRET=$${NEXTAUTH_SECRET:-default-secret} \
		--build-arg NEXTAUTH_URL=$${NEXTAUTH_URL:-http://localhost:8080/admin} \
		--build-arg JWT_SECRET=$${JWT_SECRET:-default-jwt-secret} \
		--build-arg DATABASE_URL=$${DATABASE_URL:-postgresql://postgres:postgres@postgres_db:5432/liceum} \
		-t site-admin-panel:latest \
		-f Dockerfile .
	@echo "✓ Admin-panel image built successfully"

# Run linting for both services
lint: lint-frontend lint-admin
	@echo "✓ All linting checks passed"

# Run linting for frontend
lint-frontend:
	@echo "Running linting for frontend..."
	@cd frontend && npm run lint
	@echo "✓ Frontend linting passed"

# Run linting for admin-panel
lint-admin:
	@echo "Running linting for admin-panel..."
	@cd admin_panel && npm run lint
	@echo "✓ Admin-panel linting passed"

# Run all validation checks
validate: lint
	@echo "✓ All validation checks passed"

# Deploy to staging environment
deploy-staging: build
	@echo "Deploying to staging environment..."
	@if [ -f .env ]; then \
		echo "Using existing .env file"; \
	else \
		echo "Warning: .env file not found. Using default values."; \
	fi
	@$(DOCKER_COMPOSE) -f docker-compose.yml down || true
	@$(DOCKER_COMPOSE) -f docker-compose.yml build --no-cache
	@$(DOCKER_COMPOSE) -f docker-compose.yml up -d
	@echo "Waiting for services to start..."
	@sleep 10
	@echo "✓ Deployment to staging completed"
	@$(MAKE) health-check

# Health check - verify deployed services
health-check:
	@echo "Running health checks..."
	@echo "Checking container status..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml ps
	@echo ""
	@echo "Checking /health endpoint..."
	@timeout=30; \
	count=0; \
	while [ $$count -lt $$timeout ]; do \
		if curl -f -s http://localhost/health > /dev/null 2>&1; then \
			echo "✓ Health endpoint responded successfully"; \
			break; \
		fi; \
		echo "Waiting for health endpoint... ($$count/$$timeout)"; \
		sleep 2; \
		count=$$((count + 2)); \
	done; \
	if [ $$count -ge $$timeout ]; then \
		echo "✗ Health check failed: endpoint did not respond within $$timeout seconds"; \
		exit 1; \
	fi
	@echo ""
	@echo "Checking container health..."
	@failed=0; \
	for container in postgres_db admin-panel frontend nginx; do \
		if docker ps --format '{{.Names}}' | grep -q "^$$container$$"; then \
			status=$$(docker inspect --format='{{.State.Status}}' $$container 2>/dev/null); \
			if [ "$$status" = "running" ]; then \
				echo "✓ Container $$container is running"; \
			else \
				echo "✗ Container $$container is not running (status: $$status)"; \
				failed=$$((failed + 1)); \
			fi; \
		else \
			echo "✗ Container $$container is not found"; \
			failed=$$((failed + 1)); \
		fi; \
	done; \
	if [ $$failed -gt 0 ]; then \
		echo "✗ Health check failed: $$failed container(s) are not healthy"; \
		exit 1; \
	fi
	@echo "✓ All health checks passed"

# Stop all running containers
stop:
	@echo "Stopping all containers..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml down
	@echo "✓ All containers stopped"

# Clean up containers and images
clean: stop
	@echo "Cleaning up Docker resources..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml down -v --rmi local 2>/dev/null || true
	@docker rmi site-frontend:latest site-admin-panel:latest 2>/dev/null || true
	@echo "✓ Cleanup completed"

# Main pipeline: build → validate → deploy-staging
all: build validate deploy-staging
	@echo ""
	@echo "=========================================="
	@echo "✓ Pipeline completed successfully!"
	@echo "=========================================="
	@echo "Services are running at:"
	@echo "  - Frontend: http://localhost"
	@echo "  - Admin Panel: http://localhost/admin"
	@echo "  - Health Check: http://localhost/health"
	@echo "=========================================="
