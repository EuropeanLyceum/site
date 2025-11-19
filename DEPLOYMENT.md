# School Website Deployment Guide

This guide will help you deploy the school website to a self-hosted server using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 2GB of available RAM
- At least 10GB of available disk space

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd school
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file** with your configuration:
   ```bash
   # Generate secure secrets
   # For NEXTAUTH_SECRET and JWT_SECRET, you can generate random strings:
   # openssl rand -base64 32
   
   # Update these values:
   POSTGRES_PASSWORD=your_secure_password_here
   NEXTAUTH_SECRET=your_generated_secret_here
   JWT_SECRET=your_generated_jwt_secret_here
   ```

4. **Start all services**:
   ```bash
   docker-compose up -d
   ```

5. **Wait for services to be ready** (about 1-2 minutes):
   ```bash
   docker-compose logs -f
   ```

6. **Access the website**:
   - Frontend: http://localhost
   - Admin Panel: http://localhost/admin

## Initial Setup

### Database Migrations

The database migrations will run automatically when the admin-panel container starts. If you need to run them manually:

```bash
docker-compose exec admin-panel npx prisma migrate deploy
```

### Create Admin User

To create an admin user, you can use the init script:

```bash
docker-compose exec admin-panel npm run init-admin
```

Or manually create a user by connecting to the database:

```bash
docker-compose exec postgres psql -U school_user -d school_db
```

## Configuration

### Environment Variables

All environment variables are defined in `.env.example`. Key variables:

- **POSTGRES_USER**: PostgreSQL username (default: `school_user`)
- **POSTGRES_PASSWORD**: PostgreSQL password (**change this!**)
- **POSTGRES_DB**: Database name (default: `school_db`)
- **NEXTAUTH_SECRET**: Secret for NextAuth.js (**generate a random string**)
- **NEXTAUTH_URL**: Base URL for the admin panel (default: `http://localhost`)
- **JWT_SECRET**: Secret for JWT tokens (**generate a random string**)
- **NEXT_PUBLIC_API_URL**: API URL for frontend (leave empty for same-origin)

### Generating Secure Secrets

To generate secure random secrets:

```bash
# For NEXTAUTH_SECRET
openssl rand -base64 32

# For JWT_SECRET
openssl rand -base64 32
```

## Service Architecture

The deployment consists of 4 main services:

1. **PostgreSQL** (port 5432): Database server
2. **Admin Panel** (port 3001): Next.js application for content management
3. **Frontend** (port 3000): Next.js public-facing website
4. **Nginx** (port 80): Reverse proxy and static file server

### Network Routing

- `/` → Frontend (port 3000)
- `/admin` → Admin Panel (port 3001)
- `/api/*` → Admin Panel API (port 3001)
- `/uploads/*` → Static files from admin panel

## Common Operations

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f admin-panel
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f nginx
```

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U school_user school_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U school_user school_db < backup_file.sql
```

## Troubleshooting

### Services Won't Start

1. Check if ports are already in use:
   ```bash
   # Check port 80
   netstat -tuln | grep :80
   
   # Check port 5432
   netstat -tuln | grep :5432
   ```

2. Check Docker logs:
   ```bash
   docker-compose logs
   ```

3. Verify environment variables:
   ```bash
   docker-compose config
   ```

### Database Connection Issues

1. Check if PostgreSQL is healthy:
   ```bash
   docker-compose ps postgres
   ```

2. Test database connection:
   ```bash
   docker-compose exec admin-panel npx prisma db pull
   ```

### Frontend Can't Connect to API

1. Check `NEXT_PUBLIC_API_URL` in `.env`:
   - Leave empty for same-origin (recommended)
   - Or set to full URL if needed

2. Check nginx logs:
   ```bash
   docker-compose logs nginx
   ```

### Migration Errors

If migrations fail:

1. Check database connection:
   ```bash
   docker-compose exec postgres psql -U school_user -d school_db -c "SELECT 1;"
   ```

2. Run migrations manually:
   ```bash
   docker-compose exec admin-panel npx prisma migrate deploy
   ```

### Upload Directory Issues

1. Check volume permissions:
   ```bash
   docker-compose exec admin-panel ls -la /app/public/uploads
   ```

2. Fix permissions if needed:
   ```bash
   docker-compose exec admin-panel chown -R nextjs:nodejs /app/public/uploads
   ```

## Production Considerations

### Security

1. **Change all default passwords** in `.env`
2. **Use strong secrets** for NEXTAUTH_SECRET and JWT_SECRET
3. **Set up SSL/TLS** (HTTPS) using Let's Encrypt or similar
4. **Configure firewall** to only allow necessary ports
5. **Regular backups** of the database

### Performance

1. **Enable gzip compression** (already configured in nginx)
2. **Set up caching** for static assets
3. **Monitor resource usage**:
   ```bash
   docker stats
   ```

### Monitoring

Consider setting up:
- Log aggregation (e.g., ELK stack)
- Health check monitoring
- Database backup automation
- Resource usage alerts

## Maintenance

### Regular Tasks

1. **Update dependencies**:
   ```bash
   # In admin_panel and frontend directories
   npm update
   docker-compose up -d --build
   ```

2. **Database maintenance**:
   ```bash
   docker-compose exec postgres psql -U school_user -d school_db -c "VACUUM ANALYZE;"
   ```

3. **Clean up old Docker images**:
   ```bash
   docker system prune -a
   ```

## Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Review this documentation
3. Check the application logs in the containers

## Next Steps

After successful deployment:
1. Create an admin user
2. Configure content in the admin panel
3. Test all functionality
4. Set up regular backups
5. Configure monitoring and alerts

