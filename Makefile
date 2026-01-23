backend-install:
	cd backend && npm install

backend-start:
	cd backend && npm run start

backend-build:
	cd backend && npm run build

backend-dev:
	cd backend && npm run dev

backend-clean:
	cd backend && rm -rf dist tsconfig.tsbuildinfo

backend-test-unit:
	cd backend && npm run test:unit

backend-test-integration:
	cd backend && npm run test:integration

backend-test:
	cd backend && npm run test

frontend-install:
	cd frontend && npm install

frontend-start:
	cd frontend && npm run start
