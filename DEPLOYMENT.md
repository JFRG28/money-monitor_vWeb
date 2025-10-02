# Money Monitor - Deployment Guide

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)
- At least 2GB of available RAM
- Ports 80, 3001, and 5432 available

### 1. Clone and Setup

```bash
git clone <your-repository-url>
cd money-monitor_vWeb
```

### 2. Configure Environment

Copy the production environment file and edit it:

```bash
cp production.env .env
```

Edit `.env` with your actual configuration:

```bash
nano .env
```

**Important:** Change the `SECRET_KEY` to a secure random string for production!

### 3. Deploy

Run the deployment script:

```bash
./deploy.sh
```

Or manually with Docker Compose:

```bash
docker-compose up --build -d
```

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/docs
- **Database**: localhost:5432

## 📋 Services

### Backend (FastAPI)
- **Port**: 3001
- **Health Check**: http://localhost:3001/api/health
- **API Docs**: http://localhost:3001/docs

### Frontend (React + Vite)
- **Port**: 80 (nginx)
- **Build**: Optimized production build
- **Static Files**: Served by nginx

### Database (PostgreSQL)
- **Port**: 5432
- **Database**: money_monitor
- **User**: money_user
- **Password**: money_password

## 🛠️ Management Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Update and Redeploy
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up --build -d
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend alembic upgrade head

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "Description"

# Access database shell
docker-compose exec db psql -U money_user -d money_monitor
```

### Clean Up
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: This will delete all data!)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://money_user:money_password@db:5432/money_monitor` |
| `SECRET_KEY` | JWT secret key | **CHANGE IN PRODUCTION** |
| `ENVIRONMENT` | Environment mode | `production` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `3001` |
| `CORS_ORIGINS` | Allowed CORS origins | `["http://localhost"]` |

### Database Configuration

The application uses PostgreSQL with the following default settings:
- **Database**: money_monitor
- **User**: money_user
- **Password**: money_password
- **Host**: db (Docker service name)
- **Port**: 5432

### Security Considerations

1. **Change Default Passwords**: Update database credentials in production
2. **Secure Secret Key**: Use a strong, random SECRET_KEY
3. **CORS Configuration**: Limit CORS origins to your actual domains
4. **Rate Limiting**: Adjust rate limits based on your needs
5. **HTTPS**: Use a reverse proxy (nginx, traefik) for HTTPS in production

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :3001
sudo netstat -tulpn | grep :5432

# Kill the process or change ports in docker-compose.yml
```

#### Database Connection Issues
```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection
docker-compose exec backend python -c "from app.core.config import settings; print(settings.DATABASE_URL)"
```

#### Frontend Not Loading
```bash
# Check if frontend container is running
docker-compose ps frontend

# Check frontend logs
docker-compose logs frontend

# Check nginx configuration
docker-compose exec frontend nginx -t
```

#### Backend API Issues
```bash
# Check backend logs
docker-compose logs backend

# Test API directly
curl http://localhost:3001/api/health

# Check if migrations ran
docker-compose exec backend alembic current
```

### Performance Optimization

1. **Database**: Consider using connection pooling
2. **Frontend**: Enable gzip compression (already configured)
3. **Caching**: Add Redis for session storage
4. **Load Balancing**: Use multiple backend instances

## 📊 Monitoring

### Health Checks

- **Backend**: `GET /api/health`
- **Frontend**: `GET /` (should return 200)
- **Database**: Check container status

### Logs

All services log to stdout and can be viewed with:
```bash
docker-compose logs -f
```

### Resource Usage

```bash
# Check resource usage
docker stats

# Check disk usage
docker system df
```

## 🔄 Updates and Maintenance

### Regular Maintenance

1. **Backup Database**:
   ```bash
   docker-compose exec db pg_dump -U money_user money_monitor > backup.sql
   ```

2. **Update Dependencies**:
   ```bash
   # Backend
   docker-compose exec backend pip list --outdated
   docker-compose exec backend pip install --upgrade package_name

   # Frontend
   docker-compose exec frontend npm outdated
   docker-compose exec frontend npm update
   ```

3. **Clean Up**:
   ```bash
   # Remove unused images
   docker image prune

   # Remove unused volumes
   docker volume prune
   ```

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify all services are running: `docker-compose ps`
3. Check the health endpoints
4. Review this documentation
5. Check the GitHub issues

## 📝 Notes

- The application uses Docker volumes for persistent data storage
- Database data is stored in the `postgres_data` volume
- All configuration is done through environment variables
- The frontend is built as a static site and served by nginx
- The backend runs as a FastAPI application with uvicorn
