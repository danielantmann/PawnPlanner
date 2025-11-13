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
