# Production Deployment

This project uses Docker Compose for production deployment with SSL support.

## Quick Start

1. **Set up SSL certificates**:
   ```bash
   mkdir -p ssl
   # Place your SSL certificates:
   # ssl/origin.pem - SSL certificate
   # ssl/origin.key - SSL private key
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with your actual values
   ```

3. **Deploy**:
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
   ```

4. **Initialize database**:
   ```bash
   docker exec admin-panel sh -c "cd /app && npx prisma db push --schema=prisma/schema.prisma"
   docker exec admin-panel sh -c "cd /app && node scripts/auth/init-admin.js"
   ```

## Key Differences from Local Development

### docker-compose.prod.yml vs docker-compose.yml

**Production (`docker-compose.prod.yml`)**:
- ✅ No localhost references
- ✅ SSL/HTTPS enabled
- ✅ Internal ports not exposed (security)
- ✅ Uses production nginx.conf
- ✅ Requires environment variables
- ✅ Production domains configured

**Local (`docker-compose.yml`)**:
- ✅ Uses localhost URLs
- ✅ HTTP only (port 80)
- ✅ Exposes internal ports for debugging
- ✅ Uses nginx.localhost.conf
- ✅ Has default fallback values

### Port Exposure

**Production**:
- Port 80: HTTP → redirects to HTTPS
- Port 443: HTTPS (SSL)
- Ports 3000, 3001, 5432: **NOT exposed** (internal only)

**Local**:
- Port 80: HTTP
- Ports 3000, 3001, 5432: Exposed for direct access

### SSL Configuration

Production nginx.conf expects SSL certificates at:
- `/etc/ssl/cloudflare/origin.pem` (mapped from `./ssl/origin.pem`)
- `/etc/ssl/cloudflare/origin.key` (mapped from `./ssl/origin.key`)

For Cloudflare Origin Certificates, download them from Cloudflare dashboard and place in the `ssl/` directory.

## Environment Variables

See `.env.production.example` for required variables. Key variables:

- `NEXTAUTH_URL`: Must be full HTTPS URL (e.g., `https://site.european-lyceum.pp.ua/admin`)
- `DATABASE_URL`: Full PostgreSQL connection string
- `NEXTAUTH_SECRET`: Strong random secret (32+ characters)
- `JWT_SECRET`: Strong random secret (32+ characters)

## Security Checklist

- [ ] Strong PostgreSQL password set
- [ ] Strong NEXTAUTH_SECRET (32+ characters)
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] SSL certificates properly configured
- [ ] Database port not exposed
- [ ] Application ports not exposed
- [ ] Environment variables secured
- [ ] Admin password changed after first login

## Troubleshooting

### SSL Certificate Issues

If nginx fails to start:
```bash
# Check SSL certificate paths
docker exec nginx ls -la /etc/ssl/cloudflare/

# Check nginx configuration
docker exec nginx nginx -t
```

### Database Connection Issues

```bash
# Check database is running
docker exec postgres_db pg_isready -U postgres

# Test connection from admin-panel
docker exec admin-panel sh -c "cd /app && npx prisma db push --schema=prisma/schema.prisma"
```

### Admin Panel Not Accessible

```bash
# Check admin-panel logs
docker logs admin-panel

# Verify NEXTAUTH_URL is correct
docker exec admin-panel printenv | grep NEXTAUTH_URL
```

For detailed deployment instructions, see [DEPLOYMENT_PROD.md](./DEPLOYMENT_PROD.md).

