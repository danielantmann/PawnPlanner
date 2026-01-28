# 🐾 PawnPlanner – Dog grooming Management

Backend API for the PawnPlanner project  
GitHub: https://github.com/danielantmann/PawnPlanner/

---

# 🧭 Project Overview

PawnPlanner is a full backend API built with **Node.js**, **Express**, **TypeScript**, **TypeORM**, and **Clean Architecture principles**.  
Although the backend currently lives inside an Expo project structure, it is fully modular and can be moved to a standalone `/backend` folder at any time without breaking functionality.

## 📚 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Testing](#-testing)
- [Authentication](#-authentication)
- [Database](#-database)
- [Main Endpoints](#-main-endpoints)
- [Running the Backend](#-running-the-backend)
- [Environment Variables](#-environment-variables)
- [Generating Secure JWT Secrets](#-generating-secure-jwt-secrets)
- [Development vs Production](#-development-vs-production)
- [Seeding the Database](#-seeding-the-database)
- [Database Behavior in Production](#-database-behavior-in-production)
- [Future Scalability](#-future-scalability)
- [Production Configuration](#-production-configuration)
- [Domain Model](#-domain-model)
- [Entity-Relationship Diagram](#-entity-relationship-diagram)
- [Tech Stack](#-tech-stack)
- [Roadmap](#-roadmap)
- [Troubleshooting](#-troubleshooting)

The system manages:

- Owners
- Animals
- Breeds
- Pets
- Services
- Appointments

It includes:

- JWT authentication
- Multi‑tenant isolation (per‑user data separation)
- Validation and normalization
- Repository pattern
- Complete unit + integration test coverage for critical modules

---

# 🧱 Architecture

The backend follows a clean, layered architecture:

```text
backend/
  api/            → Express controllers, routes, middlewares
  application/    → Services, DTOs, mappers (business use cases)
  core/           → Domain models and interfaces
  infrastructure/ → Repositories, ORM entities, database config
  shared/         → Errors, utilities, normalizers
  tests/          → Unit + integration tests
```

This structure ensures:

- clear separation of concerns
- testability
- maintainability
- easy future refactoring (e.g., moving backend outside Expo)

---

# 🧪 Testing

The backend includes:

### ✔ Unit Tests

- Services
- Repositories
- Mappers
- Domain logic
- Validation and error handling

### ✔ Integration Tests

- Real HTTP requests using `supertest`
- Authentication flow
- Multi‑tenant behavior
- Full Appointment module coverage

Global coverage: **~96%**

---

# 🔐 Authentication

- JWT‑based authentication
- `authMiddleware` protects all routes
- Every resource is scoped by `userId` (multi‑tenant isolation)

---

# 🗄️ Database

- SQLite for development/testing
- TypeORM entities with relations:
  - Owner → Pets
  - Animal → Breeds
  - Breed → Pets
  - Pet → Appointments
  - Service → Appointments

---

# 📡 Main Endpoints

| Method | Route                     | Description                    |
| ------ | ------------------------- | ------------------------------ |
| POST   | `/auth/register`          | Register user                  |
| POST   | `/auth/login`             | Login user                     |
| GET    | `/owners`                 | List owners                    |
| POST   | `/pets`                   | Create pet                     |
| GET    | `/appointments`           | Get appointments by date range |
| GET    | `/appointments/completed` | Get completed appointments     |
| POST   | `/appointments`           | Create appointment             |
| PUT    | `/appointments/:id`       | Update appointment             |
| DELETE | `/appointments/:id`       | Delete appointment             |

---

# 🚀 Running the Backend

From the project root:

```bash
npm install
npm run dev
npm run test
```

or using Makefile:

```bash
make backend-install
make backend-dev
make backend-test
```

## Makefile commands

```bash
backend-install:
    cd backend && npm install

backend-dev:
    cd backend && npm run dev

backend-build:
    cd backend && npm run build

backend-start:
    cd backend && npm start

backend-clean:
    cd backend && rm -rf dist tsconfig.tsbuildinfo

backend-test:
    cd backend && npm test

backend-test-unit:
    cd backend && npm run test:unit

backend-test-integration:
    cd backend && npm run test:integration

frontend-install:
    cd frontend && npm install

frontend-start:
    cd frontend && npm start
```

## 🔧 Environment Variables

Create a `.env` file inside `/backend`:

```env
# Server configuration
PORT=3000
API_PREFIX=/api/v1

# Database configuration
DB_TYPE=sqlite
DB_PATH=./data/db.sqlite

# TypeORM options
TYPEORM_SYNC=true
TYPEORM_LOGGING=false

# Tokens (auto-generated)
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_RESET_SECRET=
```

A template is provided in:

```bash
backend/.env.template
```

Copy it:

```bash
cp backend/.env.template backend/.env
```

## 🔐 Generating Secure JWT Secrets

This project includes a script that automatically generates a fully populated .env file with secure cryptographic keys.

Run:

```bash
node backend/scripts/generate-env.js
```

This will create: `backend/.env` with production‑grade secrets.

---

# 🛠️ Development vs Production

The backend behaves differently depending on the environment.

## 🧪 Development

- Uses **SQLite** stored locally (`./data/db.sqlite`)
- `TYPEORM_SYNC=true` automatically syncs schema
- Logging enabled/disabled via `.env`
- Hot‑reload with `ts-node-dev`

Start development mode:

```bash
make backend-dev
```

or:

```bash
cd backend
npm run dev
```

## 🔄 Seeding the Database

The backend includes a seed script that initializes the SQLite database with the required global data.

This is useful when:

setting up the project for the first time

regenerating the database during development

preparing a production-ready SQLite file

Run the seed script:

```bash
cd backend
npm run seed
```

This will:

create the SQLite file if it does not exist

populate required base data

ensure the schema is ready for use

## 🗄️ Database Behavior in Production

In development, the database schema is created automatically using:

```env
TYPEORM_SYNC=true
```

This is convenient for local development because TypeORM generates all tables automatically based on the entities.
⚠️ This must NOT be used in production.

In production:

TYPEORM_SYNC must be false

The schema should already exist (SQLite file generated during development).

No migration workflow is required for the current SQLite setup.

The database can simply be copied from development or generated once using the seed script.

## Future scalability

Although migrations are not needed today, the project is fully adaptable:

- If the backend grows
- If multiple developers collaborate
- If you move from SQLite to PostgreSQL, MySQL, or another SQL engine
- If you introduce staging/production environments

…then a proper migration system (TypeORM migrations) can be added without refactoring the architecture.

The current clean architecture and TypeORM setup already support this evolution.

## 🛡️ Production Configuration

Even when using **SQLite**, production environments must disable automatic schema synchronization.

```env
TYPEORM_SYNC=false
TYPEORM_LOGGING=false
```

## 🔎 Quick Explanation

### Owner

- Has many pets.

### Pet

- Belongs to an **Owner**.
- Belongs to a **Breed**.
- Can have many **Appointments**.

### Breed

- Belongs to an **Animal**.
- Can have many **Pets**.

### Animal

- General category (Dog, Cat, Bird).
- Has many **Breeds**.

### Service

- Example: consultation, vaccination, grooming.
- Can have many **Appointments**.

### Appointment

- Connects a **Pet** with a **Service**.
- Has `startTime`, `endTime`, and optional `notes`.

# Domain Model

The system is organized around the following entities:

## 📘 Entity-Relationship Diagram

```text
Owner ──< Pet ──< Appointment >── Service
        │
        >── Breed >── Animal
```

- **Owner**: pet owner.
- **Pet**: specific pet.
- **Breed**: pet’s breed.
- **Animal**: general species.
- **Service**: service offered by the clinic.
- **Appointment**: scheduled appointment linking pet and service.

## 🧰 Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **TypeORM**
- **SQLite**
- **tsyringe (Dependency Injection)**
- **Vitest + Supertest (Testing)**
- **Clean Architecture**

# Swagger

## 🔐 Authentication for testing

To test protected endpoints, create a user using:

POST /auth/register

```
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

Then login:

POST /auth/login

```
{
  "email": "test@example.com",
  "password": "123456"
}
```

or use created user at seed DB:

```
{
  "email": "daniel123@example.com",
  "password": "Daniel123!"
}
```

Copy the returned JWT token and use it in Swagger via the "Authorize" button.
