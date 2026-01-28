# PawnPlanner – Postman Setup

This folder contains the official Postman collection and environment used to test the PawnPlanner backend API. Importing these files allows you to run all endpoints with minimal configuration.

## Files Included

### 1. `paw_planner.postman_collection.json`

The complete Postman collection containing all API endpoints, organized by module:

- Auth
- Owners
- Animals
- Breeds
- Pets
- Services
- Appointments

### 2. `pawn_planner_environment.json`

A Postman environment containing reusable variables:

- baseURL – API base URL (e.g., http://localhost:3000/api)
- jwt – JWT access token

## How to Import in Postman

1. Open Postman
2. Click **Import**
3. Select both files:
   - `paw_planner.postman_collection.json`
   - `pawn_planner_environment.json`
4. In the top-right corner, select the environment:
   - **PawnPlanner Environment**

## Environment Setup

After importing, open the environment and set:

| Variable | Example Value             |
| -------- | ------------------------- |
| baseURL  | http://localhost:3000/api |
| jwt      | your JWT token            |

Save the environment when done.

## Running Requests

- Use the **Auth** folder to log in and obtain a JWT.
- Once the `jwt` variable is set, all protected endpoints will work automatically.
- You can create additional environments for staging or production if needed.

## Notes

- Do not commit real tokens or sensitive data.
- This setup is intended for development and testing.
