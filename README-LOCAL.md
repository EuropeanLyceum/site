# Local Development Setup

This guide explains how to run the application locally using Docker Compose.

## Quick Start

```bash
# Start all services
docker compose -f docker-compose.local.yml up -d

# View logs
docker compose -f docker-compose.local.yml logs -f

# Stop all services
docker compose -f docker-compose.local.yml down

# Stop and remove volumes (clean slate)
docker compose -f docker-compose.local.yml down -v
```

## Access Points

Once started, you can access:

- **Frontend**: http://localhost:8080
- **Admin Panel**: http://localhost:8080/admin
- **Admin Panel (direct)**: http://localhost:3001/admin
- **Frontend (direct)**: http://localhost:3000
- **PostgreSQL**: localhost:5432
  - User: `postgres`
  - Password: `postgres` (default, or set `DATABASE_PASSWORD` env var)
  - Database: `liceum`

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@postgres_db:5432/liceum

# Admin Panel
NEXTAUTH_SECRET=local-secret-key-change-in-production
NEXTAUTH_URL=http://localhost/admin
JWT_SECRET=local-jwt-secret-change-in-production

# Frontend (optional)
NEXT_PUBLIC_API_URL=
```

**Note**: Default values are provided in `docker-compose.local.yml`, so you can start without a `.env` file for quick testing.

## Differences from Production

### Local Configuration (`docker-compose.local.yml`)

1. **Exposed Ports**:
   - PostgreSQL: `5432` (for database tools)
   - Admin Panel: `3001` (direct access)
   - Frontend: `3000` (direct access)
   - Nginx: `8080` (to avoid conflicts with other services)

2. **No SSL**: HTTP only (no HTTPS/SSL certificates)

3. **No IP Restrictions**: Admin login is accessible from any IP

4. **Relaxed Security**:
   - More permissive CSP headers
   - Higher rate limits
   - No Cloudflare IP restrictions

5. **Development Mode**: Services run in development mode

6. **Separate Volumes**: Uses `*_local` volumes to avoid conflicts with production

### Production Configuration (`docker-compose.yml`)

1. **No Exposed Ports**: Only Nginx exposed (ports 80/443)
2. **SSL/HTTPS**: Full SSL with Cloudflare certificates
3. **IP Restrictions**: Admin login restricted to whitelisted IPs
4. **Strict Security**: Production-grade security headers and limits
5. **Production Mode**: Services run in production mode

## Database Setup

After starting the services, initialize the database:

```bash
# Run Prisma migrations
docker exec admin-panel-local sh -c "cd /app && npx prisma db push"

# Generate Prisma client
docker exec admin-panel-local sh -c "cd /app && npx prisma generate"

# Initialize admin user
docker exec admin-panel-local sh -c "cd /app && node scripts/auth/init-admin.js"
```

## Troubleshooting

### Port Already in Use

If port 8080 is already in use, change it in `docker-compose.local.yml`:

```yaml
nginx:
  ports:
    - "8081:80"  # Change 8080 to 8081 or any available port
```

### Database Connection Issues

1. Check if PostgreSQL is running:
   ```bash
   docker compose -f docker-compose.local.yml ps postgres_db
   ```

2. Verify DATABASE_URL:
   ```bash
   docker exec admin-panel-local printenv | grep DATABASE_URL
   ```

3. Test database connection:
   ```bash
   docker exec -it postgres_db_local psql -U postgres -d liceum
   ```

### Services Not Starting

1. Check logs:
   ```bash
   docker compose -f docker-compose.local.yml logs
   ```

2. Rebuild containers:
   ```bash
   docker compose -f docker-compose.local.yml up -d --build
   ```

### Nginx Configuration Issues

1. Test nginx config:
   ```bash
   docker exec nginx-local nginx -t
   ```

2. Reload nginx:
   ```bash
   docker exec nginx-local nginx -s reload
   ```

## Development Workflow

### Making Changes

1. **Code Changes**: Edit files in `admin_panel/` or `frontend/`
2. **Rebuild**: `docker compose -f docker-compose.local.yml up -d --build <service-name>`
3. **View Logs**: `docker compose -f docker-compose.local.yml logs -f <service-name>`

### Hot Reload

For hot reload during development, you might want to:
- Mount source code as volumes (not included in current setup)
- Use `npm run dev` instead of production builds
- Consider using docker-compose override files

## Cleanup

```bash
# Stop and remove containers
docker compose -f docker-compose.local.yml down

# Stop, remove containers, and volumes
docker compose -f docker-compose.local.yml down -v

# Remove images (optional)
docker compose -f docker-compose.local.yml down --rmi all
```

## Switching Between Local and Production

To switch between local and production configurations:

```bash
# Local development
docker compose -f docker-compose.local.yml up -d

# Production
docker compose -f docker-compose.yml up -d
```

**Important**: Don't run both at the same time as they use different container names but may conflict on ports.

