# Changelog

## [Pet Branch] - 2025-11-12

### Overview

The `pet` branch introduced full support for managing **Pets** in the backend.  
It covers domain, application, infrastructure, and API layers, following a clean architecture approach.

---

### Key Changes

#### 1. Domain Layer

- Added `Pet` entity in `core/pets/domain/Pet.ts`.
- Defined `IPetRepository` interface for persistence abstraction.

#### 2. Application Layer

- **DTOs**
  - `CreatePetDTO`
  - `UpdatePetDTO`
  - `PetResponseDTO`
- **Services**
  - `CreatePetService` – handles creation of new pets.
  - `UpdatePetService` – updates existing pets.
  - `DeletePetService` – deletes pets by ID.
  - `GetAllPetsService` – retrieves all pets.
  - `GetPetByIdService` – retrieves a pet by ID.
  - `GetPetByNameService` – retrieves pets by name.
  - `GetPetByBreedService` – retrieves pets by breed.
- **Mapper**
  - Implemented `PetMapper` to convert between domain entities and DTOs.

#### 3. Infrastructure Layer

- Implemented `PetRepository` with TypeORM for persistence.
- Integrated with SQLite via `data-source.ts`.

#### 4. API Layer

- Added routes under `/api/v1/pets`:
  - `POST /` → create pet
  - `PUT /:id` → update pet
  - `DELETE /:id` → delete pet
  - `GET /` → get all pets
  - `GET /:id` → get pet by ID
  - `GET /name/:name` → get pets by name
  - `GET /breed/:breedId` → get pets by breed
- Applied `validationMiddleware` to enforce DTO validation.
- Centralized route exports in `index.ts`.

#### 5. Container

- Registered `PetRepository` in `container.ts` for dependency injection with **tsyringe**.

---

### Notes

- All endpoints follow REST conventions and return appropriate HTTP status codes (`201 Created`, `200 OK`, `204 No Content`, `404 Not Found`).
- Relationships with **Owner** and **Breed** are prepared but will be fully integrated once those modules are implemented.

---

### Outcome

- Full CRUD and query operations for **Pets** are now available.
- Services are clean, consistent, and aligned with the error-handling strategy.
- Routes expose a RESTful API for pets, integrated with the existing server setup.
- The branch is ready to merge into `master` and tag for release.

## [Breed Branch] - 2025-11-13

### Overview

The `breed` branch introduced full support for managing **Breeds** in the backend.  
This included domain, application services, routes, and error handling aligned with the existing architecture.

---

### Key Changes

#### 1. Domain Layer

- Defined the `Breed` entity in `core/breeds/domain/Breed.ts`.
- Created the `IBreedRepository` interface to abstract persistence operations.

#### 2. Application Layer

- Added DTOs:
  - `CreateBreedDTO`
  - `UpdateBreedDTO`
  - `BreedResponseDTO`
- Implemented `BreedMapper` to convert between domain entities and DTOs.
- Implemented services with proper exception handling:
  - `CreateBreedService`
  - `UpdateBreedService`
  - `DeleteBreedService`
  - `GetAllBreedsService`
  - `GetBreedByIdService`
  - `GetBreedByNameService`
  - `GetBreedsByAnimalService`
- Refactored services to **throw exceptions** (`NotFoundError`, `ValidationError`) instead of returning `null` or `boolean`.

#### 3. Infrastructure Layer

- Added `BreedRepository` implementation in `infrastructure/repositories`.

#### 4. API Layer

- Created routes under `api/routes/breeds/`:
  - `create.ts` → `POST /breed`
  - `update.ts` → `PUT /breed/:id`
  - `delete.ts` → `DELETE /breed/:id`
  - `getAll.ts` → `GET /breed`
  - `getById.ts` → `GET /breed/:id`
  - `getByName.ts` → `GET /breed/name/:name`
  - `getByAnimal.ts` → `GET /breed/animal/:animalId`
  - `index.ts` → aggregates all breed routes
- Integrated routes in `server.ts` with `app.use("/breed", breedsRouter)`.

#### 5. Error Handling

- Standardized error handling using custom exceptions in `shared/errors`:
  - `NotFoundError`
  - `ValidationError`
  - `ConflictError`
  - `UnauthorizedError`
- Ensured routes catch these exceptions and return proper HTTP codes (404, 400, etc.).

---

### Outcome

- Full CRUD and query operations for **Breeds** are now available.
- Services are clean, consistent, and aligned with the error-handling strategy.
- Routes expose a RESTful API for breeds, integrated with the existing server setup.
- The branch is ready to merge into `master` and tag for release.

## [Breed Branch] - 2025-11-14

## Overview

The **animals** branch introduced full support for managing **Animals** in the backend.  
It includes the domain layer, application services, RESTful routes, and standardized error handling, all aligned with the existing architecture.

---

## Key Changes

### 1. Domain Layer

- Defined the **Animal** entity in `core/animals/domain/Animal.ts`.
- Created the **IAnimalRepository** interface to abstract persistence operations.

### 2. Application Layer

- Added DTOs:
  - `CreateAnimalDTO`
  - `UpdateAnimalDTO`
  - `AnimalResponseDTO`
- Implemented **AnimalMapper** to convert between domain entities and DTOs.
- Implemented services with proper exception handling:
  - `CreateAnimalService`
  - `UpdateAnimalService`
  - `DeleteAnimalService`
  - `GetAllAnimalsService`
  - `GetAnimalByIdService`
  - `GetAnimalBySpeciesService`
- Refactored services to throw exceptions (`NotFoundError`, `ConflictError`, `ValidationError`) instead of returning `null` or `boolean`.

### 3. Infrastructure Layer

- Added **AnimalRepository** implementation in `infrastructure/repositories/AnimalRepository.ts`.

### 4. API Layer

- Created routes under `api/routes/animals/`:
  - `create.ts` → **POST /animals**
  - `update.ts` → **PUT /animals/:id**
  - `delete.ts` → **DELETE /animals/:id**
  - `getAll.ts` → **GET /animals**
  - `getById.ts` → **GET /animals/:id**
  - `getBySpecies.ts` → **GET /animals/species/:species**
  - `index.ts` → aggregates all animal routes
- Integrated routes in `server.ts` with:

  ```ts
  app.use("/animals", animalsRouter);

  ### 5. Error Handling
  ```

- Standardized error handling using custom exceptions in `shared/errors`:
  - `NotFoundError`
  - `ValidationError`
  - `ConflictError`
- Ensured routes catch these exceptions and return proper HTTP codes:
  - **404** → Not Found
  - **400** → Bad Request (Validation)
  - **409** → Conflict
  - **500** → Internal Server Error

---

## Outcome

- Full CRUD and query operations for **Animals** are now available.
- Services are clean, consistent, and aligned with the error-handling strategy.
- Routes expose a RESTful API for animals, fully integrated with the existing server setup.
- The branch is ready to merge into master and tag for release.

## [Owner Branch] - 2025-11-15

1. Domain Layer
   Defined the Owner entity in core/owners/domain/Owner.ts.
   Created the IOwnerRepository interface to abstract persistence operations.
2. Application Layer
   Added DTOs:
   CreateOwnerDTO
   UpdateOwnerDTO
   OwnerResponseDTO
   Implemented OwnerMapper to convert between domain entities and DTOs (including pets summary).
   Implemented services with proper exception handling:
   CreateOwnerService
   UpdateOwnerService
   DeleteOwnerService
   GetAllOwnersService
   GetOwnerByIdService
   GetOwnerByEmailService
   GetOwnerByNameService
   Refactored services to throw exceptions (NotFoundError, ConflictError, ValidationError) instead of returning null or boolean.
3. Infrastructure Layer
   Added OwnerRepository implementation in infrastructure/repositories/OwnerRepository.ts.
4. API Layer
   Created routes under api/routes/owners/:

create.ts → POST /owners
update.ts → PUT /owners/:id
delete.ts → DELETE /owners/:id
getAll.ts → GET /owners
getById.ts → GET /owners/:id
getByEmail.ts → GET /owners/email/:email
getByName.ts → GET /owners/name/:name
index.ts → aggregates all owner routes
Integrated routes in server.ts with:

app.use("/owners", ownersRouter);

5. Error Handling
   Standardized error handling using custom exceptions in shared/errors:

NotFoundError
ValidationError
ConflictError
Ensured routes catch these exceptions and return proper HTTP codes:

404 → Not Found
400 → Bad Request (Validation)
409 → Conflict
500 → Internal Server Error

## [Refactor api routes and controllers] - 2025-11-18

Separation of routes and controllers in all entities.
Refactor of update methods to prevent data loss and ensure safe partial updates.
Changes
🔹 Separation of Routes and Controllers
Extracted routing logic into dedicated route files for each entity.
Controllers now handle request/response logic exclusively, while routes define endpoints and middleware.
Improves modularity and makes the API easier to extend and test.
🔹 Refactor of Update Methods
Replaced direct update(partialEntity) calls with merge + save pattern.
Ensures optional fields in DTOs do not overwrite existing values with undefined or NULL.
Applied consistently across Owner, Breed, Pet, and Animal services.
Added repository save methods where necessary to support this pattern.
Benefits
✅ Clearer separation of concerns between routing and business logic.
✅ Safer update operations that preserve existing data when DTOs are partial.
✅ Consistent architecture across all entities.
✅ Easier debugging and future feature development.
Notes
All existing tests should continue to pass.
This refactor does not introduce new endpoints, but improves reliability of current ones.
Future work: consider adding integration tests specifically for partial updates.

# [Unit and Integration Tests for Owner Module] - 2025-11-24

## Overview

This PR introduces a complete testing suite for the **Owner** module, covering both unit and integration layers.  
The goal is to ensure reproducibility, consistency, and full coverage of business logic and API behavior.

## Unit Tests

- Added unit tests for all Owner services:
  - `createOwner`
  - `updateOwner`
  - `deleteOwner`
  - `getOwnerById`
  - `getOwnerByEmail`
  - `getOwnerByName`
  - `getAllOwners`
- Verified that services throw the correct domain errors (`NotFoundError`, `ConflictError`, `ValidationError`).
- Covered edge cases such as duplicate emails, missing owners, and invalid DTOs.
- Added unit tests for `OwnerMapper`:
  - Ensures names are normalized to **TitleCase**.
  - Handles empty and non-empty pets arrays.
  - Guarantees DTO consistency across all fields.

## Integration Tests

- Added integration tests for API endpoints (`/owners`):
  - **Happy paths**: create, update, delete, and fetch owners.
  - **Error cases**:
    - `404 Not Found` when owner does not exist.
    - `409 Conflict` when creating with duplicate email.
    - `400 Bad Request` when DTO validation fails.
  - **Normalization**: verified that names are normalized to TitleCase in the real API flow.
  - **Validation errors**: ensured the API returns proper `errors` array with `property` and `constraints`.

## Benefits

- Ensures the Owner module is fully **blindado** (bulletproof) with both unit and integration coverage.
- Provides confidence that business logic and API responses behave consistently.
- Establishes a clear testing pattern for future modules (e.g., pets, breeds, animals).

## Next Steps

- Consider adding JWT authentication to protect endpoints and demonstrate security practices.
- Update Postman documentation to reflect error formats and normalization behavior.

## [User and Auth branch] - 2025-12-1

## Summary

This PR introduces the complete implementation of **User** and **Auth** modules.

### User Module

- Added self-service endpoints:
  - `GET /users/me` → get profile
  - `PUT /users/me` → update profile
  - `DELETE /users/me` → delete account
- Implemented application services:
  - `GetUserByIdService`
  - `UpdateUserService`
  - `DeleteUserService`
- Registered `UserRepository` and user services in `container.ts`
- Controllers refactored to use `RequestHandler` with `AuthRequest` casting for JWT-based flows

### Auth Module

- Added endpoints:
  - `POST /auth/register` → register new user
  - `POST /auth/login` → login and issue JWT
  - `POST /auth/forgot-password` → request password reset
  - `POST /auth/reset-password` → reset password
  - `POST /auth/change-password` → change password (private)
  - `POST /auth/refresh` → refresh access token (private)
- Implemented application services:
  - `RegisterUserService`
  - `LoginUserService`
  - `ForgotPasswordService`
  - `ResetPasswordService`
  - `ChangePasswordService`
  - `RefreshTokenService`
- Refactored controllers to consistent `RequestHandler` usage
- Adjusted `RefreshTokenDTO` to only require `refreshToken` (no redundant `userId`)
- Registered all auth services in `container.ts`

### General

- Ensured consistency in DI container registration
- Unified controller typing to avoid overload errors
- Prepared modules for upcoming integration tests

[Auth Tests & Owner Auth Integration] – 2026-01-14
Summary
This PR introduces full authentication test coverage (unit + integration) and updates the Owner module to operate under authenticated, multi‑user flows. It also includes minor refactors in the User module to support these changes.

Auth Module – Test Coverage
Unit Tests
Added complete unit test suites for all authentication services:

RegisterUserService

LoginUserService

RefreshTokenService

ForgotPasswordService

ResetPasswordService

ChangePasswordService

Coverage includes:

password hashing and validation

token generation and expiration

invalid credentials handling

reset token flows

edge‑case validation

Integration Tests
Implemented full end‑to‑end tests validating real HTTP flows:

POST /auth/register

POST /auth/login

POST /auth/refresh

POST /auth/forgot-password

POST /auth/reset-password

POST /auth/change-password

Auth middleware protecting private routes

These tests ensure controllers, middleware, services, and database interactions behave consistently.

Owner Module – Auth Integration
Integration Test Refactor
Updated all Owner integration tests to operate under authenticated, multi‑user behavior:

Added createTestUser() helper to generate isolated test users

All Owner endpoints now tested with Authorization: Bearer <token>

Ensured isolation between users:

Owners created by User A are not visible to User B

Updated tests:

createOwner

deleteOwner

getAllOwners

Owner–Pet relationship test (pending Pet refactor)

Multi‑User Behavior Validation
Added new test ensuring:

Users cannot access or delete owners belonging to another user

Owner queries return only resources scoped to the authenticated user

User Module – Minor Refactor
Small adjustments to improve testability and consistency with new auth flows

Ensured controllers use AuthRequest typing for JWT‑based access

Cleaned up DTO usage and error handling

General
Established a consistent testing pattern for authenticated integration tests

Prepared the codebase for the upcoming Pets multi‑user refactor

Ensured all Auth and User flows are stable before extending multi‑user logic to Pets

## [Pets Refactor Branch] – 2025-12-01

## Overview

The **pets** branch introduces a full refactor of the Pet module, including entity normalization, repository improvements, service restructuring, and alignment with the Owner and Animal modules.  
This update modernizes search behavior, standardizes error handling, and ensures consistent multi‑tenant behavior across the domain.

---

## Key Changes

### 1. Domain Layer

- Added the **searchName** field to `core/pets/domain/Pet.ts` for normalized search.
- Implemented the **normalizeFields()** lifecycle hook to:
  - Normalize `name`
  - Generate `searchName`
  - Ensure consistent data on insert/update
- Removed legacy or duplicated normalization logic.

---

### 2. Repository Layer

- Updated **PetRepository** to use normalized partial search:
  - `findByName` now uses `LIKE %searchName%`
  - Search is case‑insensitive, accent‑insensitive, and user‑friendly
- Added `userId` filtering to enforce multi‑tenant isolation.
- Fully aligned search behavior with Owner, Animal, and Breed repositories.

---

### 3. Application Layer

#### DTOs & Mappers

- No structural changes, but updated to support normalized fields and improved service flow.

#### Services

- Refactored **CreatePetService**:
  - Extracted logic into helper methods:
    - `resolveOwner()`
    - `resolveBreed()`
  - Improved readability, maintainability, and testability.
  - Added typed exceptions:
    - `NotFoundError` for missing Owner/Breed/Animal
    - `BadRequestError` for incomplete input
  - Enhanced creation flow:
    - Owner can be selected or created
    - Breed can be selected or created (with Animal validation)
    - All relationships validated against the authenticated user

- Updated **UpdatePetService**:
  - Added proper 404 handling when the Pet does not belong to the user
  - Restricted updates to Pet‑specific fields only
  - Owner/Breed reassignment intentionally excluded (future “transfer ownership” feature)

---

### 4. Owner & Animal Adjustments

- Minor updates to ensure compatibility with the new Pet behavior:
  - Normalization alignment
  - Consistent repository behavior
  - Validation improvements

---

## Outcome

- The Pet module is now fully aligned with the rest of the domain architecture.
- Search is modern, flexible, and consistent with real grooming/vet systems.
- Services are cleaner, safer, and easier to maintain.
- Error handling is standardized across modules using typed exceptions.
- The entire flow is production‑ready and supports multi‑tenant environments reliably.

## [Testing & Error Handling Stabilization] – 2025‑01‑18

## Overview

This branch finalizes the backend’s testing layer and stabilizes global error handling across all modules.  
It introduces a unified validation‑error format, completes missing integration tests, and ensures consistent behavior across Pets, Owners, Animals, Breeds, Auth, and Users.  
The update brings the backend to a production‑ready state before beginning the Clean Architecture refactor and the upcoming Appointments/Services modules.

---

## Key Changes

### 1. Global Error Handling

- Added a nested validation error flattener to standardize class‑validator output.
- Ensures all validation errors follow a consistent structure:
  - `status`
  - `message`
  - `errors[]` with fully‑qualified field paths (e.g., `ownerData.phone`)
- Prevents unnecessary 500 errors by correctly mapping:
  - Validation errors → 400
  - Domain errors → 400/404/409
  - Auth errors → 401
  - SQLite constraint errors → 409
- Improved logging for debugging and traceability.

---

### 2. Integration Test Suite Completion

- Added missing tests across all modules:
  - Pets
  - Owners
  - Animals
  - Breeds
  - Auth
  - Users
- Updated existing tests to match the new global error format.
- Added tests for nested DTO validation (e.g., `ownerData.phone`).
- Ensured all endpoints behave consistently under invalid input.
- Removed unused or empty test files to avoid false negatives.

---

### 3. Stability & Consistency Improvements

- Ensured all controllers return standardized error responses.
- Validated that all services throw typed domain exceptions.
- Confirmed that multi‑tenant filtering and ownership checks behave consistently.
- Improved normalization behavior across modules to avoid mismatches in tests.

---

## Outcome

- **91%+ total test coverage**, with full coverage on all critical modules.
- A stable, predictable API surface ready for the next architectural phase.
- Validation and error handling are now fully standardized across the backend.
- The system is significantly more robust, easier to debug, and safer for future refactors.
- The codebase is now ready for:
  - Clean Architecture / SRP refactor (module‑by‑module)
  - Implementation of Services (catalog)
  - Implementation of Appointments (core scheduling module)

## [Refactor – Big Clean Architecture Overhaul] – 2026‑01‑19

## Overview

This refactor introduces a full Clean Architecture restructuring across the entire backend.  
It modularizes dependency injection, standardizes error handling, improves repository consistency, and aligns all tests with domain boundaries.  
The result is a more maintainable, scalable, and predictable codebase ready for future modules such as Appointments and Services.

---

## Key Changes

### 1. Architecture & Project Structure

- Reorganized the entire backend into clear layers:
  - **core** (domain models & interfaces)
  - **application** (DTOs, mappers, services)
  - **infrastructure** (ORM entities, repositories, data sources)
  - **api** (controllers, routes, middleware)
- Introduced a **modular container system**, with dedicated DI containers for:
  - animals
  - breeds
  - owners
  - pets
  - users
  - auth

---

### 2. Dependency Injection

- Centralized all DI tokens for clarity and maintainability.
- Updated every service to use explicit `@inject` tokens.
- Removed legacy container definitions and auto‑resolution patterns.
- Ensured deterministic DI behavior across tests and runtime.

---

### 3. Domain‑to‑ORM Mapping

- Added a dedicated mapping layer to isolate infrastructure concerns.
- Standardized entity normalization:
  - email normalization
  - name normalization
  - search field normalization
- Ensured consistent behavior across all repositories.

---

### 4. Repositories

- Refactored all repositories to align with domain boundaries.
- Standardized search behavior across modules.
- Fixed inconsistent normalization logic.
- Improved error handling for missing entities and constraint violations.
- Ensured multi‑tenant filtering is applied consistently.

---

### 5. Application Layer

- Updated DTO validation with improved nested error reporting.
- Standardized naming conventions across DTOs, services, and mappers.
- Improved update services to prevent accidental data loss.
- Ensured all services throw typed domain exceptions:
  - `NotFoundError`
  - `ConflictError`
  - `BadRequestError`
  - `UnauthorizedError`

---

### 6. API Layer

- Updated controllers to follow a unified response contract.
- Improved error handling middleware:
  - consistent error format
  - nested validation error flattening
  - correct mapping of domain errors to HTTP codes
- Removed redundant logic now handled by services or middleware.

---

### 7. Testing

- Fully aligned unit and integration tests with the new architecture.
- Reworked test setup for deterministic DB initialization and teardown.
- Eliminated test flakiness caused by shared state.
- Achieved **95%+ total coverage** across the backend.
- Added missing branches in mappers and repositories.

---

## Outcome

- The backend now follows a clean, modular, and scalable architecture.
- Dependency injection is explicit, predictable, and easy to maintain.
- Error handling is standardized across all modules.
- Tests are stable, deterministic, and aligned with domain boundaries.
- The system is ready for:
  - Appointments module
  - Services module
  - Future multi‑tenant expansions
  - Additional domain features

## [Feature – Appointment Module Completed] – 2026‑01‑22

## Overview

This update introduces the full Appointment module, including domain logic, repository integration, application services, controllers, routing, and unit tests.  
The module is now fully functional and aligned with the project’s Clean Architecture structure.  
Integration tests will be added once the Service module is completed.

---

## Key Changes

### 1. Domain & Infrastructure

- Added complete Appointment domain model.
- Implemented `AppointmentEntity` with all required relations.
- Added `AppointmentRepository` with:
  - user‑scoped filtering
  - overlap detection
  - consistent domain mapping

---

### 2. Application Layer

- Implemented full set of Appointment services:
  - `CreateAppointmentService`
  - `UpdateAppointmentService`
  - `DeleteAppointmentService`
  - `GetAppointmentsByRangeService`
  - `GetCompletedAppointmentsInRangeService`
- Added DTOs for create/update flows.
- Added `AppointmentMapper` for consistent API responses.
- Ensured all services throw typed domain errors (`NotFoundError`, `ConflictError`, `BadRequestError`).

---

### 3. API Layer

- Added controllers for all Appointment operations.
- Added routing under `/appointments`.
- Unified response structure and error handling.

---

### 4. Testing

- Added unit tests covering:
  - creation logic
  - update rules (price, status, time range)
  - validation errors
  - not‑found scenarios
  - conflict detection
- Integration tests pending until the Service module is finalized.

---

## Outcome

- Appointment module is now complete and production‑ready.
- Fully aligned with the Clean Architecture refactor.
- Provides a solid foundation for the upcoming Service module.
- Integration tests will be added once the Service module is implemented.

## [Feature – Appointment Module Completed] – 2026‑01‑22

## Overview

This update finalizes the entire Appointment module, including domain logic, repository integration, application services, controllers, routing, and **full unit + integration test coverage**.  
The module is now fully functional, production‑ready, and fully aligned with the project’s Clean Architecture structure.

---

## Key Changes

### 1. Domain & Infrastructure

- Added complete Appointment domain model.
- Implemented `AppointmentEntity` with all required relations.
- Added `AppointmentRepository` with:
  - user‑scoped filtering
  - overlap detection
  - date‑range queries
  - completed‑appointments filtering
  - consistent domain mapping

---

### 2. Application Layer

- Implemented full set of Appointment services:
  - `CreateAppointmentService`
  - `UpdateAppointmentService`
  - `DeleteAppointmentService`
  - `GetAppointmentsByRangeService`
  - `GetCompletedAppointmentsInRangeService`
- Added DTOs for create/update flows.
- Added `AppointmentMapper` for consistent API responses.
- Ensured all services throw typed domain errors (`NotFoundError`, `ConflictError`, `BadRequestError`).

---

### 3. API Layer

- Added controllers for all Appointment operations.
- Added routing under `/appointments`:
  - `POST /appointments`
  - `PUT /appointments/:id`
  - `DELETE /appointments/:id`
  - `GET /appointments` (range queries)
  - `GET /appointments/completed`
- Unified response structure and error handling.

---

### 4. Testing

#### ✅ Unit Tests

- Full coverage for:
  - creation logic
  - update rules (price, status, time range)
  - validation errors
  - not‑found scenarios
  - conflict detection
  - duration calculation
  - multi‑tenant filtering
- Repository unit tests covering:
  - overlap detection
  - date‑range queries
  - completed‑appointments queries
  - CRUD operations

#### ✅ Integration Tests

- End‑to‑end tests using real HTTP requests via `supertest`:
  - create appointment
  - update appointment
  - delete appointment
  - get appointments by date range
  - get completed appointments in range
- All tests include:
  - real authentication
  - real creation of owners, animals, pets, breeds, and services
  - real multi‑tenant behavior
  - validation and error scenarios

---

## Outcome

- Appointment module is now **fully complete and production‑ready**.
- Achieves **100% coverage** across services, controllers, repository, DTOs, and mapper.
- Strengthens the overall Clean Architecture foundation.
- Ensures safe future refactors and feature expansion.
