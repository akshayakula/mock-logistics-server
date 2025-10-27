# Mock Logistics Server - Deployment Guide

Complete deployment instructions for the Mock Logistics Server.

---

## Table of Contents

1. [Local Deployment](#local-deployment)
2. [Docker Deployment](#docker-deployment)
3. [fly.io Deployment](#flyio-deployment-recommended)
4. [Other Cloud Platforms](#other-cloud-platforms)
5. [Environment Variables](#environment-variables)
6. [Production Checklist](#production-checklist)

---

## Local Deployment

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/akshayakula/mock-logistics-server.git
cd mock-logistics-server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Edit `.env` and set your API key:**
```bash
# .env
API_KEY=your-secure-api-key-here
PORT=3000
```

5. **Run in development mode:**
```bash
npm run dev
```

6. **Or build and run production mode:**
```bash
npm run build
npm start
```

7. **Test the server:**
```bash
curl http://localhost:3000/health
```

**Server will be available at:** `http://localhost:3000`

---

## Docker Deployment

### Prerequisites
- Docker Desktop or Docker Engine installed
- Docker daemon running

### Build and Run

1. **Build the Docker image:**
```bash
docker build -t mock-logistics-server .
```

2. **Run the container with environment file:**
```bash
docker run -d \
  --name logistics-server \
  -p 3000:3000 \
  --env-file .env \
  mock-logistics-server
```

3. **Or run with inline environment variables:**
```bash
docker run -d \
  --name logistics-server \
  -p 3000:3000 \
  -e API_KEY=your-secure-api-key \
  -e PORT=3000 \
  mock-logistics-server
```

4. **View logs:**
```bash
docker logs logistics-server
```

5. **Check status:**
```bash
docker ps | grep logistics-server
```

6. **Test the server:**
```bash
curl http://localhost:3000/health
```

### Docker Management Commands

```bash
# Stop container
docker stop logistics-server

# Start container
docker start logistics-server

# Restart container
docker restart logistics-server

# Remove container
docker rm -f logistics-server

# View resource usage
docker stats logistics-server --no-stream

# Execute commands inside container
docker exec -it logistics-server sh
```

### Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  logistics-server:
    build: .
    container_name: logistics-server
    ports:
      - "3000:3000"
    environment:
      - API_KEY=${API_KEY}
      - PORT=3000
      - NODE_ENV=production
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

---

## fly.io Deployment (Recommended)

fly.io is perfect for serverless Node.js apps with automatic SSL, global edge network, and free tier.

### Prerequisites
- fly.io account (sign up at https://fly.io/app/sign-up)
- flyctl CLI installed

### Install flyctl

**macOS:**
```bash
brew install flyctl
```

**Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows:**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### Deploy Steps

1. **Login to fly.io:**
```bash
flyctl auth login
```

2. **Launch the app (first time only):**
```bash
flyctl launch
```

You'll be prompted with:
- **App name**: Accept suggestion or choose your own (e.g., `my-logistics-server`)
- **Region**: Choose closest to your users (e.g., `iad` for US East)
- **PostgreSQL database**: Select **No** (we use in-memory storage)
- **Redis**: Select **No**
- **Deploy now**: Select **No** (we need to set secrets first)

This creates a `fly.toml` configuration file (already included in repo).

3. **Set your API key as a secret:**
```bash
flyctl secrets set API_KEY=your-secure-production-api-key
```

**IMPORTANT:** Generate a strong API key for production:
```bash
# Generate a random secure key (macOS/Linux)
openssl rand -hex 32

# Or use this
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

4. **Deploy the application:**
```bash
flyctl deploy
```

This will:
- Build the Docker image
- Push to fly.io registry
- Deploy to your selected region
- Provide you with a URL

5. **View your deployment:**
```bash
flyctl open
```

Your API will be available at: `https://your-app-name.fly.dev`

6. **Test the deployment:**
```bash
# Health check (no auth)
curl https://your-app-name.fly.dev/health

# Get loads (with auth)
curl -H "X-API-Key: your-api-key" \
  https://your-app-name.fly.dev/api/loads
```

### fly.io Management Commands

```bash
# View logs
flyctl logs

# Check app status
flyctl status

# View current secrets
flyctl secrets list

# Update a secret
flyctl secrets set API_KEY=new-secure-key

# Scale the app
flyctl scale count 2  # Run 2 instances

# SSH into the app
flyctl ssh console

# View metrics
flyctl dashboard

# Stop the app
flyctl scale count 0

# Destroy the app (careful!)
flyctl apps destroy your-app-name
```

### Custom Domain (Optional)

1. **Add custom domain:**
```bash
flyctl certs add api.yourdomain.com
```

2. **Follow DNS instructions provided by fly.io**

3. **Test with your domain:**
```bash
curl https://api.yourdomain.com/health
```

### Auto-Scaling Configuration

Edit `fly.toml` to configure auto-scaling:

```toml
[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0  # Scale to zero when idle
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256  # Increase if needed
```

Then redeploy:
```bash
flyctl deploy
```

---

## Other Cloud Platforms

### AWS Elastic Container Service (ECS)

1. **Push image to ECR:**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL
docker tag mock-logistics-server:latest YOUR_ECR_URL/mock-logistics-server:latest
docker push YOUR_ECR_URL/mock-logistics-server:latest
```

2. **Create ECS task definition with environment variables**
3. **Deploy to ECS service**

### Google Cloud Run

1. **Build and push to Google Container Registry:**
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mock-logistics-server
```

2. **Deploy to Cloud Run:**
```bash
gcloud run deploy mock-logistics-server \
  --image gcr.io/YOUR_PROJECT_ID/mock-logistics-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars API_KEY=your-secure-key
```

### Azure Container Instances

1. **Build and push to Azure Container Registry:**
```bash
az acr build --registry YOUR_REGISTRY --image mock-logistics-server:latest .
```

2. **Deploy:**
```bash
az container create \
  --resource-group YOUR_RG \
  --name logistics-server \
  --image YOUR_REGISTRY.azurecr.io/mock-logistics-server:latest \
  --dns-name-label logistics-api \
  --ports 3000 \
  --environment-variables API_KEY=your-secure-key
```

### Heroku

1. **Install Heroku CLI and login:**
```bash
heroku login
```

2. **Create app:**
```bash
heroku create your-app-name
```

3. **Set environment variables:**
```bash
heroku config:set API_KEY=your-secure-key
```

4. **Deploy using Heroku's container registry:**
```bash
heroku container:login
heroku container:push web
heroku container:release web
```

### Railway

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login and initialize:**
```bash
railway login
railway init
```

3. **Set environment variables:**
```bash
railway variables set API_KEY=your-secure-key
```

4. **Deploy:**
```bash
railway up
```

### Render

1. **Create `render.yaml`:**
```yaml
services:
  - type: web
    name: mock-logistics-server
    env: docker
    plan: free
    envVars:
      - key: API_KEY
        generateValue: true
      - key: PORT
        value: 3000
```

2. **Connect your GitHub repo to Render**
3. **Render will auto-deploy**

---

## Environment Variables

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `API_KEY` | API authentication key | `demo-api-key-12345` | `acme_prod_9x7k2m` |
| `PORT` | Server port | `3000` | `8080` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |

### Setting Environment Variables

**Local (.env file):**
```bash
API_KEY=your-key-here
PORT=3000
NODE_ENV=production
```

**Docker:**
```bash
docker run -e API_KEY=your-key -e PORT=3000 mock-logistics-server
```

**fly.io:**
```bash
flyctl secrets set API_KEY=your-key
```

**Kubernetes:**
```yaml
env:
  - name: API_KEY
    valueFrom:
      secretKeyRef:
        name: logistics-secrets
        key: api-key
```

---

## Production Checklist

Before deploying to production, ensure:

### Security
- [ ] Generate a **strong, random API key** (32+ characters)
- [ ] **Never commit** `.env` file to version control
- [ ] Use secrets management (fly.io secrets, AWS Secrets Manager, etc.)
- [ ] Enable HTTPS (automatic with fly.io, Cloud Run, etc.)
- [ ] Consider rate limiting for production (not included in this mock)

### Configuration
- [ ] Set `NODE_ENV=production`
- [ ] Configure appropriate port for your platform
- [ ] Test all endpoints with production API key

### Monitoring
- [ ] Set up logging (fly.io has built-in logs)
- [ ] Monitor resource usage (CPU, memory)
- [ ] Set up health check monitoring
- [ ] Configure alerts for downtime

### Testing
- [ ] Test health endpoint: `GET /health`
- [ ] Test authentication with valid key
- [ ] Test authentication rejection with invalid key
- [ ] Test load search with various filters
- [ ] Test booking endpoint
- [ ] Verify CORS headers if calling from web apps

### Performance
- [ ] Configure auto-scaling if needed
- [ ] Set appropriate memory limits (256MB is sufficient)
- [ ] Consider CDN for global distribution
- [ ] Monitor response times

---

## Quick Reference

### Test Your Deployment

```bash
# Replace YOUR_URL with your deployment URL
export API_URL="https://your-app-name.fly.dev"
export API_KEY="your-api-key"

# Health check
curl $API_URL/health

# Get best load
curl -H "X-API-Key: $API_KEY" "$API_URL/api/loads"

# Get load with filters
curl -H "X-API-Key: $API_KEY" \
  "$API_URL/api/loads?origin_state=TX&equipment_type=Dry%20Van"

# Book a load
curl -X POST -H "X-API-Key: $API_KEY" \
  "$API_URL/api/loads/L-1001/book"
```

### Common Issues

**Issue**: API returns 401 Unauthorized
- **Solution**: Check your API key is correct and included in headers

**Issue**: Container exits immediately
- **Solution**: Check logs with `docker logs` or `flyctl logs`

**Issue**: Port already in use
- **Solution**: Stop other services on port 3000 or change PORT env var

**Issue**: fly.io deployment fails
- **Solution**: Ensure you've set secrets with `flyctl secrets set API_KEY=...`

---

## Support

For issues or questions:
- Check server logs first
- Review this deployment guide
- Open an issue on GitHub: https://github.com/akshayakula/mock-logistics-server/issues

---

## Cost Estimates

### fly.io (Recommended)
- **Free tier**: 3 shared VMs, 256MB RAM each
- **Paid**: ~$2-5/month for small production apps
- **Auto-scales to zero** when idle (no cost)

### Other Platforms
- **Google Cloud Run**: Free tier 2M requests/month, then $0.40/M requests
- **AWS ECS Fargate**: ~$15-30/month minimum
- **Heroku**: Free tier deprecated, starts at $7/month
- **Railway**: $5/month free credits
- **Render**: Free tier available

---

**Last Updated**: October 2025

