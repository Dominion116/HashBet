.PHONY: install test test-contracts test-backend build-frontend lint lint-sol docker-up docker-down clean

install:
	cd backend && npm ci
	cd frontend && npm ci
	cd contracts && npm ci

test: test-contracts test-backend

test-contracts:
	cd contracts && npm run test:unit

test-backend:
	cd backend && npm test

test-backend-unit:
	cd backend && npm run test:unit

test-backend-integration:
	cd backend && npm run test:integration

build-frontend:
	cd frontend && npm run build

lint:
	cd backend && npm run lint
	cd contracts && npx eslint scripts/ test/ --ext .js

lint-sol:
	cd contracts && npm run lint:sol

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f backend

clean:
	rm -rf backend/coverage contracts/coverage frontend/dist
	rm -rf contracts/artifacts contracts/cache
