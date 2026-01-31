# 🐾 PawnPlanner – Dog Grooming Management System

Full‑stack mobile app for managing appointments, pets, owners and services. Built with **React Native (Expo)** + **Node.js / TypeScript** using **Clean Architecture**, **DDD**, and **96% test coverage**.

**Status:** Backend completed and fully tested. Mobile app in active development (login, register, home connected to API).

---

## 🚀 Overview

PawnPlanner is a real-world management system built for a dog‑grooming business. It includes:

- Mobile app (React Native + Expo)
- Backend API (Node.js, Express, TypeScript, TypeORM)
- Authentication (JWT)
- Multi‑tenant data isolation
- Full CRUD for owners, pets, services and appointments
- 96% test coverage (unit + integration)

---

## 📦 Project Structure

PawnPlanner/
backend/ → Full backend API (Node.js, Express, TypeScript, TypeORM)
app/ → Expo project files (React Native frontend)
package.json → Expo project config
README.md → You are here

⚠️ **Note:** There is no `/frontend` folder. The **Expo project itself is the frontend**.

---

# 🏁 Running the Project

## 1️⃣ Install dependencies

### Backend

```
cd backend
npm install
```

### Frontend (Expo)

From the project root:

```
npm install
```

---

## 2️⃣ Start the backend (development mode)

```
cd backend
npm run dev
```

---

## 3️⃣ Start the mobile app (Expo)

### From the project root:

```
npx expo start
```

#### This opens Metro Bundler and allows you to:

- run on Android
- run on iOS
- run on web
- use Expo Go on your mobile device

---

# 🧪 Running Tests (Backend)

```
cd backend
npm run test
```

## Specific tests:

```
npm run test:unit
npm run test:integration
```

---

## 📚 Backend Documentation

The backend includes full documentation:

- Architecture
- Domain model
- Endpoints
- Testing (unit + integration)
- ERD diagram
- Makefile commands
- Environment variables

👉 See full backend documentation: `/backend/README.md`
