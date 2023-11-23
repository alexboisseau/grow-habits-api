start:
	@docker-compose up -d
	@npm run prisma:migrate:dev
	@npm run start:dev