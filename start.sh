#!/bin/bash

# Simple start script for Money Monitor
echo "🚀 Starting Money Monitor..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from production.env..."
    cp production.env .env
    echo "📝 Please edit .env file with your configuration and run again."
    exit 1
fi

# Start the application
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 15

echo "✅ Money Monitor is running!"
echo ""
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:3001"
echo "📚 API Docs: http://localhost:3001/docs"
echo ""
echo "📋 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
