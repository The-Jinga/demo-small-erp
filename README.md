# Small ERP System

A small ERP system built with NestJS for managing products processing operations, including products, inventory, suppliers, purchase orders, and reporting.

## Tech Stack

- **Backend Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis
- **Authentication**: JWT with Passport
- **Queue and Schedule Management**: BullMQ + Redis
- **API Documentation**: Swagger

## Setup Instructions

### Prerequisites

- Node.js (v21 or higher)
- Yarn package manager
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
yarn install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- Set up PostgreSQL credentials
- Configure Redis connection
- Set JWT secrets and token expiration times

5. Run database migrations:
```bash
yarn migration:run
```

6. Run seed data:
```bash
yarn seed:run
```

7. Start the development server:
```bash
yarn start:dev
```

The application will be available at `http://localhost:3000` - Interactive API documentation available at `http://localhost:3000/api`

## Seeded Users

After running the database seed, the system will include 4 default users, each assigned to a different role:

| Name               | Email                    | Password      | Role         |
|--------------------|---------------------------|----------------|--------------|
| Procurement User   | procurement@example.com   | password@123    | procurement  |
| Manager User       | manager@example.com       | password@123    | manager      |
| Inventory User     | inventory@example.com     | password@123    | inventory    |
| Finance User       | finance@example.com       | password@123    | finance      |


You can use these accounts to log in and test features based on different user roles.

## API Routes

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `POST /auth/register` - Endpoint for user registration. For testing purposes, users can register with any available role.

### Products
- `GET /products` - Get all products

### Suppliers
- `GET /suppliers` - Get all suppliers
- `GET /suppliers/:id` - Get supplier by ID

### Purchase Orders
- `GET /purchase-orders` - Get all purchase orders
- `GET /purchase-orders/:id` - Get purchase order by ID
- `PUT /purchase-orders` - Create new purchase order with `draft` status
- `PUT /purchase-orders/:id/submit` - Update status purchase order to `pending_review`
- `PUT /purchase-orders/:id/review` - Update status purchase order to `approval` or `rejected`

### Inventory
- `GET /inventory/transactions` - Get inventory transactions
- `POST /inventory/` - Add to inventory
- `POST /inventory/:id/stock-in` - Stock in products
- `POST /inventory/:id/stock-out` - Stock out products

### Reports
- `GET /reports/inventory-turnover?2025-04-01&end=2025-04-31` - Generate turnover report based on date range
- `GET /reports/supplier-spending` - Generate supplier spent for each month reports
## Design Decisions

### Architecture
- **Modular Design**: The application follows NestJS's modular architecture with the following feature modules:
  - `AuthModule`: Handles user authentication and authorization
  - `ProductModule`: Manages product catalog and specifications
  - `PurchaseOrderModule`: Handles purchase order creation and management
  - `InventoryModule`: Tracks inventory levels and movements
  - `SupplierModule`: Manages supplier information and relationships
  - `ReportsModule`: Generates various business reports
  - `QueueModule`: Manages background jobs and asynchronous processing by using BullMQ
  - `CacheModule`: Provides caching functionality backed by Redis, enhancing performance and minimizing redundant database queries.
  - `DatabaseModule`: Handles database configuration and connection

- **Repository Pattern**: TypeORM repositories are used for database operations
- **Service Layer**: Business logic is encapsulated in service classes
- **Controller Layer**: Handles HTTP requests and responses

### Security
- JWT-based authentication with refresh token mechanism
- Role-based access control
- Password hashing using bcrypt
- Environment-based configuration

### Performance
- Redis caching for frequently accessed data
- BullMQ for handling background jobs and queues
- Database indexing for optimized queries
- Connection pooling for database operations