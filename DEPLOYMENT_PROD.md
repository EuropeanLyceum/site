# Production Deployment Guide

## Prerequisites

1. **SSL Certificates**: Place your SSL certificates in the `./ssl/` directory:
   - `origin.pem` - SSL certificate
   - `origin.key` - SSL private key

   For Cloudflare Origin Certificates:
   ```bash
   mkdir -p ssl
   # Copy your Cloudflare origin certificate and key to:
   # ssl/origin.pem
   # ssl/origin.key
   ```

2. **Environment Variables**: Create a `.env.production` file based on `.env.production.example`:
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with your actual values
   ```

## Required Environment Variables

All environment variables must be set in `.env.production`:

- `POSTGRES_PASSWORD` - Strong password for PostgreSQL
- `DATABASE_URL` - Full PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret (minimum 32 characters)
- `NEXTAUTH_URL` - Full URL to admin panel (e.g., `https://site.european-lyceum.pp.ua/admin`)
- `JWT_SECRET` - Random secret for JWT tokens (minimum 32 characters)
- `NEXT_PUBLIC_API_URL` - Leave empty for relative URLs through nginx

## Deployment Steps

1. **Prepare SSL Certificates**:
   ```bash
   mkdir -p ssl
   # Copy your SSL certificates here
   ```

2. **Set Environment Variables**:
   ```bash
   cp .env.production.example .env.production
   nano .env.production  # Edit with your values
   ```

3. **Build and Start Services**:
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
   ```

4. **Initialize Database**:
   ```bash
   # Push Prisma schema
   docker exec admin-panel sh -c "cd /app && npx prisma db push --schema=prisma/schema.prisma"
   
   # Create admin user
   docker exec admin-panel sh -c "cd /app && node scripts/auth/init-admin.js"
   ```

5. **Verify Deployment**:
   ```bash
   # Check all services are running
   docker-compose -f docker-compose.prod.yml ps
   
   # Check nginx logs
   docker logs nginx
   
   # Check admin panel logs
   docker logs admin-panel
   ```

## Access URLs

- **Frontend**: `https://site.european-lyceum.pp.ua`
- **Admin Panel**: `https://site.european-lyceum.pp.ua/admin`

## Security Notes

1. **Database Port**: PostgreSQL port (5432) is NOT exposed externally in production
2. **Application Ports**: Admin panel (3001) and frontend (3000) are NOT exposed - only accessible through nginx
3. **SSL Only**: HTTP (port 80) automatically redirects to HTTPS (port 443)
4. **Strong Secrets**: Use strong, randomly generated secrets for `NEXTAUTH_SECRET` and `JWT_SECRET`

## Updating the Application

1. **Pull latest code**:
   ```bash
   git pull
   ```

2. **Rebuild and restart**:
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
   ```

3. **Run database migrations** (if needed):
   ```bash
   docker exec admin-panel sh -c "cd /app && npx prisma migrate deploy --schema=prisma/schema.prisma"
   ```

## Monitoring

- **View logs**: `docker-compose -f docker-compose.prod.yml logs -f [service-name]`
- **Check status**: `docker-compose -f docker-compose.prod.yml ps`
- **Restart service**: `docker-compose -f docker-compose.prod.yml restart [service-name]`

## Backup

1. **Database Backup**:
   ```bash
   docker exec postgres_db pg_dump -U postgres liceum > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Uploads Backup**:
   ```bash
   docker run --rm -v site_admin-uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
   ```

