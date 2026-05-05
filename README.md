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

## Key Features Implemented
- **Monorepo Tooling**: Turborepo for optimized builds and caching.
- **Domain-Driven Backend**: Modular structure for Payroll, Tax, Employee, and Compliance.
- **Solana Layer**: Decoupled blockchain interaction layer (`apps/server/src/solana`).
- **Fiat Bridge**: Ready-to-implement integration layer for INR/USD ↔ USDC.
- **Security**: Wallet-based authentication with JWT session management.
- **Database**: PostgreSQL with Prisma ORM for reliable Web2 data management.

## Next Steps
- Implement logic in `apps/server/src/modules/payroll` to link on-chain transactions with DB records.
- Initialize Solana programs in the `programs/` directory using `anchor init aura_payroll`.
- Define shared types in `packages/types` to be used across frontend and backend.
