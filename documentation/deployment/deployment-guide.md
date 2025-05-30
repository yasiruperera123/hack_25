# Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [Deployment Process](#deployment-process)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- Node.js v18 or higher
- npm v9 or higher
- Git
- PostgreSQL (production database)
- SSL certificate
- Domain name

### Access Requirements
- Cloud platform access credentials
- Database credentials
- Domain registrar access
- SSL certificate

## Environment Setup

### Environment Variables

#### Frontend (.env)
```plaintext
VITE_API_URL=https://api.yourdomain.com
VITE_APP_ENV=production
```

#### Backend (.env)
```plaintext
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://yourdomain.com
```

### Database Setup
1. Create production database
2. Set up database user
3. Configure connection pool
4. Set up backups

## Deployment Options

### Option 1: Traditional VPS/Dedicated Server

#### Server Requirements
- Ubuntu 20.04 LTS or higher
- 2 CPU cores minimum
- 4GB RAM minimum
- 20GB SSD storage

#### Setup Steps
1. Update system
   ```bash
   sudo apt update && sudo apt upgrade
   ```

2. Install Node.js
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Install PostgreSQL
   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

### Option 2: Cloud Platform (e.g., AWS, Heroku)

#### AWS Setup
1. Create EC2 instance
2. Configure Security Groups
3. Set up RDS for PostgreSQL
4. Configure Route 53 for DNS
5. Set up S3 for static files

#### Heroku Setup
1. Create new Heroku apps
   ```bash
   heroku create smartcart-frontend
   heroku create smartcart-backend
   ```

2. Set up add-ons
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

## Deployment Process

### Frontend Deployment

1. Build the application
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Configure web server (Nginx)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           root /var/www/html;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. Deploy static files
   ```bash
   sudo cp -r dist/* /var/www/html/
   ```

### Backend Deployment

1. Build the application
   ```bash
   cd backend
   npm install
   npm run build
   ```

2. Set up process manager (PM2)
   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name app-backend
   pm2 save
   pm2 startup
   ```

3. Configure reverse proxy
   ```nginx
   location /api {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   ```

### SSL Configuration

1. Install Certbot
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Obtain SSL certificate
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

## Monitoring & Maintenance

### Monitoring Setup

1. Application Monitoring
   - Install monitoring tools
     ```bash
     npm install -g clinic
     ```
   
2. Server Monitoring
   - Set up Prometheus & Grafana
   - Configure alerting

3. Log Management
   - Configure log rotation
   - Set up log aggregation

### Backup Strategy

1. Database Backups
   ```bash
   # Automated daily backups
   pg_dump -U username dbname > backup.sql
   ```

2. Application Backups
   - Regular configuration backups
   - Static files backup

### Update Process

1. Frontend Updates
   ```bash
   git pull
   npm install
   npm run build
   # Deploy new build
   ```

2. Backend Updates
   ```bash
   git pull
   npm install
   npm run build
   pm2 restart app-backend
   ```

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if backend service is running
   - Verify Nginx configuration
   - Check PM2 logs

2. **Database Connection Issues**
   - Verify database credentials
   - Check network connectivity
   - Review connection pool settings

3. **Memory Issues**
   - Monitor memory usage
   - Adjust Node.js heap size
   - Review PM2 configuration

### Recovery Procedures

1. **Database Recovery**
   ```bash
   # Restore from backup
   psql dbname < backup.sql
   ```

2. **Application Rollback**
   ```bash
   # Using Git
   git reset --hard previous_commit
   # Rebuild and redeploy
   ```

### Health Checks

1. **Backend Health**
   ```bash
   curl https://api.yourdomain.com/health
   ```

2. **Database Health**
   ```bash
   pg_isready -h hostname -p 5432
   ```

## Security Considerations

1. **Firewall Configuration**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   ```

2. **Security Headers**
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-XSS-Protection "1; mode=block";
   add_header X-Content-Type-Options "nosniff";
   ```

3. **Regular Updates**
   ```bash
   # System updates
   sudo apt update && sudo apt upgrade
   
   # npm packages
   npm audit fix
   ```

## Performance Optimization

1. **Nginx Optimization**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Cache Configuration**
   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
       expires 7d;
       add_header Cache-Control "public, no-transform";
   }
   ```

## Support

### Contact Information
- DevOps Team: devops@example.com
- Emergency: +1-800-EMERGENCY

### Documentation
- [Architecture Overview](../architecture/architecture-overview.md)
- [API Documentation](../api/api-documentation.md)
- [Developer Guide](../developer/developer-guide.md) 