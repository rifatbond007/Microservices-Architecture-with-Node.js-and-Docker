# Microservices Architecture for learning

This project demonstrates a complete Docker-based microservices architecture using Node.js, Express, JWT authentication, and NGINX as an API gateway.

## Architecture

- **auth-service** (Port 3003): Handles JWT authentication
- **user-service** (Port 3001): Provides user data (protected)
- **order-service** (Port 3002): Provides order data with user information (protected)
- **nginx** (Port 3000): API gateway routing requests to appropriate services

## Services

### Auth Service
- `POST /login` - Login with username/password, returns JWT token
- `GET /health` - Health check

### User Service
- `GET /users` - Returns sample user data (requires JWT)
- `GET /health` - Health check

### Order Service
- `GET /orders` - Returns orders combined with user data (requires JWT)
- `GET /health` - Health check

### API Gateway
- Routes `/login` to auth-service
- Routes `/users` to user-service
- Routes `/orders` to order-service
- `GET /health` - Gateway health check

## Prerequisites

- Docker
- Docker Compose

## Setup

1. Clone or navigate to the project directory
2. Copy `.env` file and update environment variables if needed
3. Run the following command to build and start all services:

```bash
docker-compose up --build
```

The API gateway will be available at `http://localhost:3000`

## Testing the API

### 1. Login to get JWT token
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "1234"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Get users (protected)
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get orders (protected)
```bash
curl -X GET http://localhost:3000/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Health checks
```bash
# Gateway health
curl http://localhost:3000/health

# Individual services
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

## Environment Variables

- `JWT_SECRET`: Secret key for JWT token signing (configured in `.env` file)
- `NODE_ENV`: Environment mode (development/production)
- Service ports can be customized in `.env` file

## Configuration

1. Copy `.env` file and update the values as needed
2. Make sure to change `JWT_SECRET` in production environments

## Demo Credentials

- Username: `admin`
- Password: `1234`

## Stopping the Application

```bash
docker-compose down
```

## Project Structure

```
.
├── app/
│   ├── auth-service/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   └── package.json
│   ├── user-service/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   └── package.json
│   ├── order-service/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   └── package.json
│   └── nginx/
│       └── nginx.conf
├── .env
├── .gitignore
├── .dockerignore
├── docker-compose.yml
└── README.md
```
