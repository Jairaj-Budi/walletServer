<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Wallet API

The Wallet API is a comprehensive solution built with [NestJS](https://nestjs.com/) that manages wallet transactions, caching, rate limiting, and security. It uses MongoDB (with Mongoose) for data storage, Redis for caching, and supports clustering in production for high availability.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Endpoints & Payloads](#api-endpoints--payloads)
  - [Transaction Endpoints](#transaction-endpoints)
  - [Wallet Endpoints](#wallet-endpoints)
  - [Health Check Endpoint](#health-check-endpoint)
- [Implementation Details](#implementation-details)
- [Testing](#testing)
- [License](#license)

## Overview

The Wallet API performs the following functions:
- **Transactions:** Create, update, and export wallet transactions.
- **Wallet Management:** Create, retrieve, and update wallet information.
- **Caching:** Uses Redis via the `cache-manager` for performance optimization. A dedicated `CacheService` handles caching logic.
- **Security & Rate Limiting:** Uses Helmet for HTTP headers security, express-rate-limit middleware for API rate limiting, and global guards/exception filters.
- **Clustering:** Supports clustering in production to utilize all available CPU cores.
- **Swagger Documentation:** Auto-generated API documentation is available via Swagger.

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm
- MongoDB
- Redis (for caching)

### Installation

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd wallet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   If dependency conflicts occur, run:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Start the server:**
   - Development:
     ```bash
     npm run start:dev
     ```
   - Production:
     ```bash
     npm run start:prod
     ```
   - With clustering in production:
     ```bash
     npm run start:cluster
     ```

5. **Access API Documentation:**

   Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to view the Swagger UI with full API details and sample payloads.

## Environment Configuration

Create a `.env` file in the project root with entries like:

```dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/wallet
API_KEY=your-api-key
```

## API Endpoints & Payloads

### Transaction Endpoints

#### POST `/transact/:walletId`

**Description:** Create a new transaction on a wallet.

**Headers:**
- `x-api-key` – API key for authentication.

**Path Parameters:**
- `walletId` (string): Unique wallet identifier.

**Request Payload (TransactDto):**
```json
{
  "amount": 100,
  "description": "Payment for order #1234"
}
```

**Response:**
```json
{
  "id": "generated-transaction-id",
  "walletId": "walletId provided",
  "amount": 100,
  "balance": 500,
  "description": "Payment for order #1234",
  "date": "2025-02-16T18:00:00.000Z",
  "type": "CREDIT"
}
```

#### GET `/transactions?walletId=<walletId>&skip=0&limit=100&sortColumn=date&sortOrder=true`

**Description:** Retrieves transactions for the given wallet with pagination.

**Query Parameters:**
- `walletId` (string, required)
- `skip` (number, optional, default: 0)
- `limit` (number, optional, default: 100)
- `sortColumn` (string, e.g., `"date"`)
- `sortOrder` (string, `"true"` for ascending, `"false"` for descending)

**Response:**
```json
{
  "data": [
    {
      "id": "tx-1",
      "walletId": "wallet-1",
      "amount": 50,
      "balance": 150,
      "description": "Transaction one",
      "date": "2025-02-16T18:00:00.000Z",
      "type": "CREDIT"
    },
    {
      "id": "tx-2",
      "walletId": "wallet-1",
      "amount": -25,
      "balance": 125,
      "description": "Transaction two",
      "date": "2025-02-16T18:05:00.000Z",
      "type": "DEBIT"
    }
  ],
  "count": 2
}
```

#### GET `/export-transactions`

**Description:** Exports transactions for a wallet as a CSV file (implementation may vary).

**Query Parameters:**
- `walletId`: UUID of the wallet.
- `skip` (optional)
- `limit` (optional)

The endpoint streams a CSV file with headers and transaction rows.

### Wallet Endpoints

#### POST `/wallets`

**Description:** Create a new wallet.

**Payload (CreateWalletDto):**
```json
{
  "name": "John Doe",
  "balance": 0
}
```

**Response:**
```json
{
  "id": 1234567890,
  "name": "John Doe",
  "balance": 0,
  "date": "2025-02-16T18:00:00.000Z",
  "transactionId": 1234567890
}
```

#### GET `/wallets/:id`

**Description:** Retrieve wallet information by ID.

**Response:**
```json
{
  "id": "wallet-id",
  "name": "John Doe",
  "balance": 1000,
  "date": "2025-02-16T18:00:00.000Z"
}
```

#### GET `/wallets?name=John`

**Description:** Retrieve wallets by name.

**Response:**
```json
[
  {
    "id": "wallet-id-1",
    "name": "John Doe",
    "balance": 1000,
    "date": "2025-02-16T18:00:00.000Z"
  },
  {
    "id": "wallet-id-2",
    "name": "John Doe",
    "balance": 500,
    "date": "2025-02-16T19:00:00.000Z"
  }
]
```

### Health Check Endpoint

#### GET `/health`

**Description:** Returns system health and performance metrics.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-02-16T18:00:00.000Z",
  "pid": 12345,
  "memory": { ... },
  "cpu": [ ... ],
  "uptime": 3600
}
```

## Implementation Details

- **Clustering:**  
  The `setupCluster` function in `src/cluster.ts` enables clustering in production. It forks workers based on available CPU cores.

- **Caching:**  
  The application uses Redis via `cache-manager` along with a custom `CacheService` (`src/common/services/cache.service.ts`) that provides methods for getting, setting, and clearing cache entries.  
  The caching logic is integrated into both wallet and transaction services.

- **Database & Transactions:**  
  MongoDB is used along with Mongoose. Database transactions are handled using Mongoose sessions, ensuring consistency during operations such as wallet balance updates and transaction creation.

- **Security & Rate Limiting:**  
  - **Security Middleware:** Uses Helmet for security headers.
  - **Rate Limiting:** The `RateLimiterMiddleware` (in `src/common/middleware/rate-limiter.middleware.ts`) limits the number of requests per IP.
  - **API Authentication:** An `AuthGuard` ensures requests include a valid API key.
  - **Sanitization:** The `SanitizePipe` strips any HTML from inputs to prevent XSS attacks.

- **Global Exception Handling:**  
  The `GlobalExceptionFilter` catches errors application-wide, logs them, and returns a consistent JSON response.

- **Swagger Integration:**  
  Swagger is integrated and configured in `src/main.ts` to auto-generate comprehensive API documentation available under `/api-docs`.

## Testing

- **Unit Tests:**  
  Written using Jest.  
  To run tests:
  ```bash
  npm run test
  ```

- **End-to-End Tests:**  
  Available under the test directory.  
  To run E2E tests:
  ```bash
  npm run test:e2e
  ```

## License

This project is licensed under the UNLICENSED (update as needed).
