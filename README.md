<<<<<<< HEAD
=======

>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
# ⚡ TaskFlow — Team Task Manager

Full-stack team task management with role-based access control.  
**Stack:** React + Vite + Tailwind CSS · Node.js + Express · PostgreSQL + Prisma · JWT

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- Git
- PostgreSQL database (Railway free tier works great)

### 1. Clone / unzip the project
```bash
# If from zip:
cd taskflow
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env       # then fill in DATABASE_URL and JWT_SECRET
npm install
npx prisma generate
npx prisma migrate dev --name init
node src/db/seed.js        # optional demo data
npm run dev                # starts on port 5000
```

### 3. Frontend setup (new terminal)
```bash
cd frontend
cp .env.example .env       # keep defaults for local dev
npm install
npm run dev                # starts on port 5173
```

Open **http://localhost:5173**

### Demo accounts (after seeding)
| Role   | Email                    | Password   |
|--------|--------------------------|------------|
| Admin  | admin@taskflow.dev       | admin123   |
| Member | priya@taskflow.dev       | member123  |
| Member | james@taskflow.dev       | member123  |

---

## 🗂️ Project Structure

```
taskflow/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # DB schema (User, Project, Task, ProjectMember)
│   │   └── migrations/            # SQL migrations
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── projects.controller.js
│   │   │   ├── tasks.controller.js
│   │   │   └── users.controller.js
│   │   ├── db/
│   │   │   ├── client.js          # Prisma singleton
│   │   │   └── seed.js            # Demo data
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT guard + role guards
│   │   │   └── validate.js        # express-validator helper
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── projects.routes.js
│   │   │   └── other.routes.js    # tasks / users / dashboard
│   │   └── index.js               # Express entry point
│   ├── .env.example
│   ├── package.json
│   └── railway.toml
│
├── frontend/
│   ├── src/
│   │   ├── api/index.js           # Axios client + all API functions
│   │   ├── components/
│   │   │   ├── Layout.jsx         # Sidebar + topbar shell
│   │   │   └── Modal.jsx          # Reusable modal
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx    # JWT auth state
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx       # Login / Signup
│   │   │   ├── Dashboard.jsx      # Stats overview
│   │   │   ├── Projects.jsx       # Project CRUD
│   │   │   ├── Tasks.jsx          # Task CRUD + filters
│   │   │   └── Team.jsx           # User management
│   │   ├── App.jsx                # Router
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Tailwind base + component classes
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── railway.toml
│
└── README.md
```

---

## 🌐 Deploy on Railway

### Step 1 — Push to GitHub
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/taskflow
git push -u origin main
```

### Step 2 — Deploy backend
1. railway.app → New Project → Deploy from GitHub → select repo → **root: backend**
2. Add a PostgreSQL service from Railway dashboard
3. Set environment variables:

| Variable       | Value                                       |
|----------------|---------------------------------------------|
| DATABASE_URL   | Auto-filled by Railway when you link PG     |
| JWT_SECRET     | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| JWT_EXPIRES_IN | 7d                                          |
| NODE_ENV       | production                                  |
| FRONTEND_URL   | Your Railway frontend URL (set after step 3)|

Railway auto-runs: `npx prisma migrate deploy && node src/index.js`

### Step 3 — Deploy frontend
1. New service → same repo → **root: frontend**
2. Set environment variables:

| Variable      | Value                                         |
|---------------|-----------------------------------------------|
| VITE_API_URL  | https://taskflow-backend.up.railway.app       |

3. Update backend's `FRONTEND_URL` to match the frontend Railway URL.

---

## 📡 API Reference

### Auth
| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| POST   | /api/auth/signup | Register new user    |
| POST   | /api/auth/login  | Login, returns JWT   |
| GET    | /api/auth/me     | Get current user     |

### Projects
| Method | Endpoint                          | Role         |
|--------|-----------------------------------|--------------|
| GET    | /api/projects                     | Any          |
| POST   | /api/projects                     | Admin        |
| PATCH  | /api/projects/:id                 | Owner/Admin  |
| DELETE | /api/projects/:id                 | Owner/Admin  |
| POST   | /api/projects/:id/members         | Owner/Admin  |
| DELETE | /api/projects/:id/members/:userId | Owner/Admin  |

### Tasks
| Method | Endpoint                     | Role              |
|--------|------------------------------|-------------------|
| GET    | /api/tasks                   | Any (scoped)      |
| POST   | /api/projects/:id/tasks      | Project member    |
| PATCH  | /api/tasks/:id               | Assignee/Admin    |
| DELETE | /api/tasks/:id               | Creator/Admin     |

### Users & Dashboard
| Method | Endpoint              | Role  |
|--------|-----------------------|-------|
| GET    | /api/dashboard        | Any   |
| GET    | /api/users            | Admin |
| PATCH  | /api/users/:id/role   | Admin |
| DELETE | /api/users/:id        | Admin |

---

## 🔒 Role Permissions

| Action                        | Admin | Member |
|-------------------------------|-------|--------|
| Create / delete projects      | ✅    | ❌     |
| Add / remove project members  | ✅    | ❌     |
| Create tasks in their projects| ✅    | ✅     |
| Edit their own tasks          | ✅    | ✅     |
| Delete any task               | ✅    | ❌     |
| View all projects & tasks     | ✅    | Own only |
| Manage user roles             | ✅    | ❌     |

---

## 🧰 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS v3     |
| Routing   | React Router v6                     |
| HTTP      | Axios with interceptors             |
| Backend   | Node.js, Express                    |
| Database  | PostgreSQL via Prisma ORM           |
| Auth      | JWT (jsonwebtoken) + bcryptjs       |
| Validation| express-validator                   |
| Security  | Helmet, CORS, rate-limiter          |
| Deploy    | Railway                             |
<<<<<<< HEAD
=======
=======
# team-task-manager
Full Stack Team Task Manager Application
>>>>>>> 6ad85a031ab39ba96a90dbc58ecae00e6dc63248
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
