# Task Management API

A REST API for task management built with NestJS and MongoDB.

## Features

- User authentication with JWT
- Task CRUD operations with soft delete
- Task assignment functionality
- Filtering and pagination for tasks
- API documentation with Swagger
- Rate limiting and security best practices
- Unit and integration tests

## Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:neilmehta31/upcover-task-management.git
   cd upcover-task-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your own values.

## Running the application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Documentation

After starting the server, you can access the Swagger API documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Tasks
- `GET /tasks` - Get all tasks (paginated and filterable)
- `GET /tasks/:id` - Get a task by ID
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Soft delete a task
- `POST /tasks/:id/assign` - Assign a task to another user

## Testing

### Running unit tests
```bash
npm run test
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent brute force attacks
- Input validation and sanitization
- NoSQL injection protection
- Centralized error handling