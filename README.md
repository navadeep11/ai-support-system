# 🤖 AI Multi-Agent Support System

An intelligent customer support system powered by AI-based intent routing and a multi-agent architecture.

This system dynamically routes user queries to specialized agents (Order, Billing, Support) using Groq LLaMA-3 for intelligent reasoning while maintaining conversation memory in a PostgreSQL database.

---

## 🏗 System Architecture

![System Architecture](./AI_Support_Multi-Agent_System.png)

The architecture follows a clean separation of concerns:

- Frontend (React + Vite)
- RPC Layer (Hono)
- Service Layer
- AI Router Agent
- Specialized Agents
- Prisma ORM
- PostgreSQL (Supabase)
- Groq AI API

---

## 🚀 Features

- 🧠 AI Intent Classification (Router Agent using Groq LLaMA-3)
- 📦 Order Agent (status + creation date)
- 🧾 Billing Agent (payment status + invoice date)
- 💬 Support Agent (general conversation)
- 🗂 Conversation Memory (last 10 messages stored in DB)
- 🔄 Context-aware agent switching
- 🛡 Global middleware-based error handling
- 🏗 Clean Controller → Service → Agent architecture
- 🌍 Production-ready deployment structure

---

# 🖥 Backend (Hono + Prisma + Groq)

Location:
apps/backend

Tech Stack:
- Hono
- Prisma ORM
- PostgreSQL (Supabase)
- Groq AI (LLaMA-3)
- TypeScript
- Node.js

 Environment Variables (.env inside apps/backend):

```DATABASE_URL="postgresql://user:password@host:5432/db"```
```GROQ_API_KEY="your_groq_key"```
``` NODE_ENV=development```

Database Setup:

cd apps/backend
npm install
npx prisma generate
npx prisma db push

Optional seed:
npm run seed

Run Backend:
npm run dev

Server runs on:
http://localhost:4000

---

# 🎨 Frontend (React + Vite)

Location:
apps/frontend

Tech Stack:
- React
- Vite
- CSS
- Hono RPC Client

Run Frontend:

cd apps/frontend
npm install
npm run dev

Runs on:
http://localhost:5173

---

# 🧠 AI Routing Logic

1. User sends message
2. Chat Service fetches last 10 messages
3. Router Agent determines intent:
   - order
   - billing
   - support
4. Appropriate specialized agent handles request
5. Data fetched via Prisma from PostgreSQL
6. Response returned to frontend

Memory fields stored in Conversation table:
- lastIntent
- activeOrderId
- activeInvoiceId

---

# 🌍 Deployment Architecture

Recommended deployment setup:

Frontend → Vercel  
Backend → Render  
Database → Supabase  
AI Provider → Groq  

Backend Deployment (Render):

Root Directory → apps/backend
Build Command:
npm install && npm run build
Start Command:
npm run start

Add environment variables in dashboard.

Frontend Deployment (Vercel):

Root Directory → apps/frontend
Build Command:
npm run build



# 🛡 Error Handling

Global middleware handles:
- Prisma errors
- Invalid conversation IDs
- AI API failures
- Unhandled exceptions

Ensures consistent JSON error responses.

---



