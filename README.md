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
