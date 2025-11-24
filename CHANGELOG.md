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
