start_dev:
	@docker-compose -f docker-compose.dev.yml up -d
	@echo "Development server started"

stop_dev:
	@docker-compose -f docker-compose.dev.yml down
	@echo "Development server stoped"

build_and_start_dev:
	@docker-compose -f docker-compose.dev.yml up -d --build
	@echo "Development server started"