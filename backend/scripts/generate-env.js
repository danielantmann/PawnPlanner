import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateKey() {
  return crypto.randomBytes(64).toString('hex');
}

const envContent = `
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
JWT_SECRET=${generateKey()}
JWT_REFRESH_SECRET=${generateKey()}
JWT_RESET_SECRET=${generateKey()}
`;

// Ruta correcta: /backend/.env
const envPath = path.join(__dirname, '..', '.env');

fs.writeFileSync(envPath, envContent.trim() + '\n');

console.log(`✅ .env file generated successfully at ${envPath}`);
