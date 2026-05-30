# Aura Payroll Monorepo

Welcome to the production-grade monorepo for Aura Payroll. This project uses **Turborepo** to manage a hybrid Web3/Web2 architecture.

## Structure

- `apps/frontend`: Vite + React + Tailwind + Shadcn UI (Solana integrated).
- `apps/server`: Node.js + TypeScript + Prisma (PostgreSQL) + Express.
- `packages/types`: Shared TypeScript interfaces.
- `packages/config`: Shared environment and project constants.
- `packages/ui`: Reusable UI component library.
- `packages/sdk`: Abstraction layer for backend and Solana interactions.
- `programs/`: Rust/Anchor smart contracts (ready for initialization).
- `infra/`: Docker and database configurations.

## Getting Started

### Prerequisites
- Node.js & NPM
- Docker (for local database)
- Solana Tool Suite & Anchor (for smart contracts)

### Installation
```bash
npm install
```

### Running Locally
1. Start the database:
   ```bash
   docker-compose up -d
   ```
2. Start the development environment:
   ```bash
   npm run dev
   ```

## Development Workflow

### Smart Contracts
- Located in `programs/`.
- Built using Anchor.
- To build: `anchor build`
- To test: `anchor test`

### Backend
- Located in `apps/server`.
- To run tests: `npm run test --workspace=@aura/server`
- Prisma Studio: `npm run prisma:studio --workspace=@aura/server`

### Frontend
- Located in `apps/frontend`.
- Built with Vite and React.
- To run: `npm run dev --workspace=@aura/frontend`

## Key Features Implemented
- **Monorepo Tooling**: Turborepo for optimized builds and caching.
- **Domain-Driven Backend**: Modular structure for Payroll, Tax, Employee, and Compliance.
- **Solana Layer**: Decoupled blockchain interaction layer calling custom Anchor programs.
- **Smart Contracts**: Anchor programs for `payroll_program` and `tax_vault_program` with core logic implemented.
- **Bulk Payroll**: Support for batching multiple employee payments in a single session.
- **Tax Rules Engine**: Region-aware tax calculation (India, US, and fallback).
- **Yield Integration**: Automated yield allocation events after tax withholding.
- **Security**: Wallet-based authentication with JWT session management.
- **Database**: PostgreSQL with Prisma ORM, including a seeding script for demo data.

## Next Steps
1. Start the database and redis:
   ```bash
   docker-compose up -d
   ```
2. Run Prisma migrations and seed the database:
   ```bash
   npm run prisma:generate --workspace=@aura/server
   npm run prisma:seed --workspace=@aura/server # Needs manual setup of seed script in package.json if not using prisma seed
   ```
3. Start the development environment:
   ```bash
   npm run dev
   ```
4. Deploy Solana programs to devnet (if Anchor is installed):
   ```bash
   anchor deploy
   ```
