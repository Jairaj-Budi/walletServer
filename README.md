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
- [API Endpoints & Sample Queries](#api-endpoints--sample-queries)
- [Database and Query Design](#database-and-query-design)
- [Testing](#testing)
- [License](#license)

## Overview

The Wallet API performs the following functions:
- **Transactions:** Create, update, and export wallet transactions.
- **Wallet Management:** Create, retrieve, and update wallet information.
- **Caching:** Uses Redis via the `cache-manager` for performance optimization. A dedicated `CacheService` handles caching logic.
- **Security & Rate Limiting:** Uses Helmet for HTTP header security, express-rate-limit middleware for API rate limiting, and global guards/exception filters.
- **Clustering:** Supports clustering in production to utilize all available CPU cores.
- **Swagger Documentation:** Auto-generated API documentation is available via Swagger.

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/) (for caching)

### Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd wallet
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   If dependency issues occur, try:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables:**  
   Create a `.env` file in the project root:
   ```dotenv
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/wallet
   API_KEY=your-api-key
   ```

4. **Compile and Run the Project:**
   - Development mode:
     ```bash
     npm run start:dev
     ```
   - Production mode:
     ```bash
     npm run start:prod
     ```
   - With clustering:
     ```bash
     npm run start:cluster
     ```

5. **Access API Documentation:**  
   Visit [https://wallet-dry-snowflake-6122.fly.dev/api-docs](https://wallet-dry-snowflake-6122.fly.dev/api-docs) to view the Swagger UI with full API details and sample payloads.


## API Endpoints & Sample Queries

### Transaction Endpoints

1. **POST `/transact/:walletId`**  
   **Description:** Create a new transaction for a wallet.  
   **Sample Query:**
   ```http
   POST https://wallet-dry-snowflake-6122.fly.dev/transact/12345abcde
   Content-Type: application/json
   x-api-key: your_api_key

   {
      "amount": 100,
      "description": "Payment for order #1234"
   }
   ```
   **Response Example:**
   ```json
   {
      "id": "generated-transaction-id",
      "walletId": "12345abcde",
      "amount": 100,
      "balance": 500,
      "description": "Payment for order #1234",
      "date": "2025-02-16T18:00:00.000Z",
      "type": "CREDIT"
   }
   ```

2. **GET `/transactions?walletId=<walletId>&skip=0&limit=100&sortColumn=date&sortOrder=asc`**  
   **Description:** Retrieve transactions for the specified wallet with pagination.  
   **Sample Query:**
   ```http
   GET https://wallet-dry-snowflake-6122.fly.dev/transactions?walletId=12345abcde&skip=0&limit=50&sortColumn=date&sortOrder=asc
   ```
   **Response Example:**
   ```json
   {
      "data": [
         {
            "id": "tx-1",
            "walletId": "12345abcde",
            "amount": 100,
            "balance": 500,
            "description": "Initial Deposit",
            "date": "2025-02-16T18:00:00.000Z",
            "type": "CREDIT"
         },
         {
            "id": "tx-2",
            "walletId": "12345abcde",
            "amount": -50,
            "balance": 450,
            "description": "Purchase",
            "date": "2025-02-16T18:05:00.000Z",
            "type": "DEBIT"
         }
      ],
      "count": 2
   }
   ```

3. **GET `/export-transactions?walletId=12345abcde`**  
   **Description:** Export transactions for a wallet in CSV format.  
   **Sample Query:**
   ```http
   GET https://wallet-dry-snowflake-6122.fly.dev/export-transactions?walletId=12345abcde
   ```
   *The endpoint streams a CSV file with transaction records.*

### Wallet Endpoints

1. **POST `/wallets`**  
   **Description:** Create a new wallet.  
   **Sample Query:**
   ```http
   POST https://wallet-dry-snowflake-6122.fly.dev/wallets
   Content-Type: application/json

   {
      "name": "John Doe",
      "balance": 0
   }
   ```
   **Response Example:**
   ```json
   {
      "id": "generated-wallet-id",
      "name": "John Doe",
      "balance": 0,
      "date": "2025-02-16T18:00:00.000Z",
      "transactionId": "generated-transaction-id"
   }
   ```

2. **GET `/wallets/:id`**  
   **Description:** Retrieve wallet information by ID.  
   **Sample Query:**
   ```http
   GET https://wallet-dry-snowflake-6122.fly.dev/wallets/12345abcde
   ```
   **Response Example:**
   ```json
   {
      "id": "12345abcde",
      "name": "John Doe",
      "balance": 1000,
      "date": "2025-02-16T18:00:00.000Z"
   }
   ```

3. **GET `/wallets?name=John`**  
   **Description:** Retrieve wallets filtered by name.  
   **Sample Query:**
   ```http
   GET https://wallet-dry-snowflake-6122.fly.dev/wallets?name=John
   ```
   **Response Example:**
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

1. **GET `/health`**  
   **Description:** Returns system health and performance metrics.  
   **Sample Query:**
   ```http
   GET https://wallet-dry-snowflake-6122.fly.dev/health
   ```
   **Response Example:**
   ```json
   {
      "status": "ok",
      "timestamp": "2025-02-16T18:00:00.000Z",
      "pid": 12345,
      "memory": { "rss": 12345678, "heapTotal": 3456789, "heapUsed": 2345678 },
      "cpu": [0.2, 0.1, 0.05],
      "uptime": 3600
   }
   ```

## Database and Query Design

- **Database Type:**  
  The application utilizes **MongoDB** as its primary database, interfaced through **Mongoose** for schema management and object data modeling.

- **Schema Design:**  
  - **Wallet Schema:**  
    Stores wallet details such as `id`, `name`, `balance`, `transactionId`, and `date`. Unique identifiers are generated for each wallet and associated transaction.
  - **Transaction Schema:**  
    Manages transactions linked to wallets. Key fields include `walletId`, `amount`, `balance`, `description`, `transactionId`, `date`, and `type`. Each transaction is either a **CREDIT** or **DEBIT** based on the amount.

- **Query Design:**  
  - **Lean Queries:**  
    Many read queries use the `.lean()` method to return plain JavaScript objects. This approach enhances performance by bypassing the full Mongoose document overhead.
  - **Pagination:**  
    Endpoints that may return large sets of data (e.g., transactions) implement pagination using `skip` and `limit` parameters.
  - **Caching:**  
    Frequent read operations, such as retrieving wallet details, are cached using Redis (via `cache-manager`), reducing database load and improving performance.

## Testing

- **Unit Tests:**  
  The project uses **Jest** for unit testing. Run tests with:
  ```bash
  npm run test
  ```
- **End-to-End Tests:**  
  For integration/E2E tests, use:
  ```bash
  npm run test:e2e
  ```

## License

This project is licensed under the UNLICENSED (update as needed).
