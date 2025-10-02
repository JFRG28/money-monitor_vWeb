#!/bin/bash

# Money Monitor Deployment Script
set -e

echo "🚀 Starting Money Monitor deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from production.env..."
    cp production.env .env
    print_warning "Please edit .env file with your actual configuration before running again."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Remove old images (optional)
if [ "$1" = "--clean" ]; then
    print_status "Cleaning up old images..."
    docker-compose down --rmi all
fi

# Build and start services
print_status "Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Check if services are running
print_status "Checking service status..."
docker-compose ps

# Run database migrations
print_status "Running database migrations..."
docker-compose exec backend alembic upgrade head

# Health check
print_status "Performing health check..."
sleep 5

# Check backend health
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    print_status "✅ Backend is healthy"
else
    print_error "❌ Backend health check failed"
fi

# Check frontend
if curl -f http://localhost/ > /dev/null 2>&1; then
    print_status "✅ Frontend is accessible"
else
    print_error "❌ Frontend is not accessible"
fi

print_status "🎉 Deployment completed!"
print_status "Frontend: http://localhost"
print_status "Backend API: http://localhost:3001"
print_status "API Docs: http://localhost:3001/docs"
print_status "Database: localhost:5432"

echo ""
print_status "To view logs: docker-compose logs -f"
print_status "To stop: docker-compose down"
