backend-install:
	cd backend && npm install

backend-start:
	cd backend && npm run backend

backend-build:
	cd backend && npm run build

backend-clean:
	cd backend && rm -rf dist tsconfig.tsbuildinfo

frontend-install:
	cd frontend && npm install

frontend-start:
	cd frontend && npm run start
