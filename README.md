# Cultural Events Agenda

A collaborative platform to discover and share free or open-access cultural events — street concerts, open exhibitions, public readings — organized by location and date.

## Associated SDG

SDG 10 — Reduced Inequalities

Free culture is often invisible to many people. This platform makes these events accessible to those who lack information about what is happening in their region, reducing inequality in access to culture.

## Stack

| Layer | Technology | Deploy |
|---|---|---|
| Frontend | Angular 21+ | Vercel |
| Backend | Node.js 24+ + Express + TypeScript | Render.com |
| Database | Supabase (PostgreSQL) | Supabase Cloud |
| Authentication | Supabase Auth (JWT) | Supabase Cloud |
| CI/CD | GitHub Actions | GitHub Actions |

## Production URLs

- Frontend: (coming soon)
- Backend: https://cultural-agenda.onrender.com


## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /events | No | List upcoming events |
| GET | /events/:id | No | Get event details |
| POST | /events | Yes | Create event |
| PUT | /events/:id | Yes | Update event |
| DELETE | /events/:id | Yes | Delete event |
| POST | /events/:id/attend | Yes | Register attendance |
| DELETE | /events/:id/attend | Yes | Cancel attendance |

## How to run locally

1. Clone the repository
2. `cd backend`
3. `npm install`
4. Create `.env` with your Supabase credentials
5. `npm run dev`
