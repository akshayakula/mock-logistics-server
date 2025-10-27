# Quick Start Guide

Get the Mock Logistics Server running in under 5 minutes!

---

## 🚀 Deploy to fly.io (Fastest - Production Ready)

```bash
# 1. Install flyctl
brew install flyctl  # macOS
# OR: curl -L https://fly.io/install.sh | sh  # Linux/WSL

# 2. Login
flyctl auth login

# 3. Launch app
flyctl launch

# 4. Set API key secret
flyctl secrets set API_KEY=$(openssl rand -hex 32)

# 5. Deploy
flyctl deploy

# 6. Test it
flyctl open
```

**Your API is live!** 🎉

URL: `https://your-app-name.fly.dev`

---

## 🐳 Docker (Local or Any Server)

```bash
# 1. Clone and navigate
git clone https://github.com/akshayakula/mock-logistics-server.git
cd mock-logistics-server

# 2. Create .env file
echo "API_KEY=$(openssl rand -hex 16)" > .env

# 3. Build and run
docker build -t mock-logistics-server .
docker run -d -p 3000:3000 --env-file .env --name logistics-server mock-logistics-server

# 4. Test it
curl http://localhost:3000/health
```

**Server running at:** `http://localhost:3000`

---

## 💻 Local Development

```bash
# 1. Clone and install
git clone https://github.com/akshayakula/mock-logistics-server.git
cd mock-logistics-server
npm install

# 2. Create .env
echo "API_KEY=dev-key-12345" > .env
echo "PORT=3000" >> .env

# 3. Run
npm run dev

# 4. Test
curl http://localhost:3000/health
```

**Dev server running at:** `http://localhost:3000`

---

## 📡 Test Your API

```bash
# Set your variables
export API_URL="http://localhost:3000"  # or your fly.io URL
export API_KEY="your-api-key"

# Health check (no auth)
curl $API_URL/health

# Get best available load
curl -H "X-API-Key: $API_KEY" $API_URL/api/loads

# Filter by state and equipment
curl -H "X-API-Key: $API_KEY" \
  "$API_URL/api/loads?origin_state=TX&equipment_type=Dry%20Van"

# Book a load
curl -X POST -H "X-API-Key: $API_KEY" \
  $API_URL/api/loads/L-1001/book
```

---

## 📚 Full Documentation

- **API Reference**: See [README.md](README.md)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🔑 Your API Key

**Development:** Use any string (e.g., `demo-api-key-12345`)

**Production:** Generate a secure key:
```bash
# macOS/Linux
openssl rand -hex 32

# Or
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Then set it:
- **Local**: Add to `.env` file
- **Docker**: Use `--env-file .env` or `-e API_KEY=...`
- **fly.io**: Use `flyctl secrets set API_KEY=...`

---

## ⚡ One-Line Deployments

**Fly.io:**
```bash
flyctl launch && flyctl secrets set API_KEY=$(openssl rand -hex 32) && flyctl deploy
```

**Docker:**
```bash
docker build -t logistics . && docker run -d -p 3000:3000 -e API_KEY=$(openssl rand -hex 16) logistics
```

**Local:**
```bash
npm i && echo "API_KEY=dev-key" > .env && npm run dev
```

---

## 🆘 Troubleshooting

**401 Unauthorized**: Check your API key in the request headers
```bash
curl -H "X-API-Key: YOUR_KEY" ...
```

**Port in use**: Change the port
```bash
PORT=8080 npm run dev
```

**Docker container exits**: Check logs
```bash
docker logs logistics-server
```

**fly.io fails**: Ensure secrets are set
```bash
flyctl secrets list
flyctl secrets set API_KEY=your-key
```

---

## 💡 Next Steps

1. ✅ Deploy your server
2. ✅ Test all endpoints
3. ✅ Integrate with your app
4. 📖 Read full [API documentation](README.md)
5. 🚀 Review [deployment options](DEPLOYMENT.md)

---

**Need help?** Open an issue on [GitHub](https://github.com/akshayakula/mock-logistics-server/issues)

