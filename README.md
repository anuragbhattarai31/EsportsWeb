# SEMO Esports Web

A full-stack web application for managing Southeast Missouri State University Esports clubs, equipment bookings, teams, events, and news.

---

## 🔍 Overview

* **User features**

  * Register & login with SEMO email (`@semo.edu`) via JWT authentication
  * View and cancel equipment bookings
  * Check availability of devices
  * Club membership registration, status tracking
  * View Teams, Team rosters, News, and Events

* **Admin features**

  * Approve or reject club membership requests
  * Manage equipment (add, update, toggle status, delete)
  * View and cancel any booking
  * Create, edit, delete News & Events
  * View dashboard stats (users, reservations, requests)
  * Manage team rosters (add/remove players)

* **Tech stack**

  * **Backend**: Node.js, Express, PostgreSQL
  * **Database**: Amazon RDS for PostgreSQL
  * **Deployment**: AWS Elastic Beanstalk (API), Netlify (frontend)
  * **Frontend**: React & Vite, Tailwind CSS, Radix UI

---

## 🚀 Getting Started

These instructions will get you a copy up and running on your local machine for development and deployment.

### 1. Prerequisites

* [Node.js 18+](https://nodejs.org/) & npm or yarn
* [PostgreSQL client](https://www.postgresql.org/download/) (`psql`, `pg_dump`, `pg_restore`)
* AWS account
* AWS CLI v2 & EB CLI (or use AWS console)

  ```bash
  # AWS CLI v2
  brew install awscli      # macOS
  sudo apt-get install awscli -y  # Ubuntu
  # EB CLI
  pip install --user awsebcli
  ```
* GitHub repository (e.g. `https://github.com/anuragbhattarai31/EsportsWeb`)

### 2. Clone the repo

```bash
git clone https://github.com/anuragbhattarai31/EsportsWeb.git
cd EsportsWeb
```

---

## 🛠 Local Development

### 3. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file (or use your preferred method) with:

```ini
DB_HOST=localhost
DB_PORT=5432
DB_NAME=usersinfo
DB_USER=<your_local_db_user>
DB_PASSWORD=<your_local_db_password>
JWT_SECRET=<your_jwt_secret>
DB_SSL=false    # `true` in production RDS setup
```

Run database migrations or seed scripts if you have them. To test quick schema creation:

```bash
psql -U $DB_USER -h $DB_HOST -d $DB_NAME -f sql/schema.sql
```

Start the API server:

```bash
npm run dev
# listens on http://localhost:5000
```

### 4. Frontend setup

```bash
cd ../frontend
npm install
```

Create `.env` (Vite) in `frontend/`:

```ini
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
# opens at http://localhost:5173
```

---

## 📦 Production Deployment

### 5. Provision RDS PostgreSQL

1. **RDS Console** → Create database → PostgreSQL 15 (Free Tier)
2. Master user = `master`, choose a strong password
3. Public access = **No** → create new SG `rds-sg`
4. Wait until **Available**, copy endpoint (e.g. `mydb.abc123.us-east-1.rds.amazonaws.com`)

#### 5.1 Import existing data

```bash
# Dump your local DB
pg_dump -U local_user -h localhost -Fc -d local_db -f ~/db.dump

# Temporarily open port ➔ RDS SG inbound 5432 from YOUR IP

# Restore into RDS
pg_restore -U master -h <endpoint> -d postgres --create --no-owner ~/db.dump

# Remove your IP from SG
```

### 6. Deploy API on Elastic Beanstalk

```bash
cd backend
# 1) init
eb init -p node.js semo-esports-api --region us-east-1

# 2) add env vars (via .ebextensions or EB console)
#    DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET

# 3) create
eb create prod-env --instance_type t3.micro --single
```

Open the EB URL once health is OK. Then allow the EB instance SG to connect to `rds-sg` on port 5432.

### 7. Configure Netlify for frontend

1. Commit and push your frontend code to GitHub
2. In Netlify dashboard, create a new site from GitHub, select `frontend/` directory
3. In \_redirects file (frontend/public/*redirects)*:

   ```text
   /*    /index.html   200
   ```
4. Set environment var `VITE_API_URL=https://prod-env.eba-xyz.elasticbeanstalk.com`
5. Deploy → note your Netlify URL (e.g. `https://your-site.netlify.app`)

---

## 🔧 Common Issues

* **404 on reload or logout** → missing `_redirects` fallback → add `/* /index.html 200`
* **CORS errors** → ensure your EB `corsOptions.origin` includes Netlify URL
* **Database errors** → verify SG inbound for RDS from EB SG; check `sslmode=require`

---

## 🤝 Contributing

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/XYZ`)
3. Commit your changes (`git commit -m "feat: ..."`)
4. Push to branch (`git push origin feature/XYZ`)
5. Open a Pull Request

## Contact Me
Email: anuragbhattarai31@gmail.com
---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
