# Cultural Events Agenda

A collaborative platform to discover and share free or open-access cultural events — street concerts, open exhibitions, public readings — organized by location and date.

## Associated SDG

**SDG 10 — Reduced Inequalities**

Free culture is often invisible to many people. This platform makes these events accessible to those who lack information about what is happening in their region, reducing inequality in access to culture.

---

## Stack

| Layer | Technology | Deploy |
|---|---|---|
| Frontend | Angular 19 + TypeScript | Vercel |
| Backend | Node.js + Express + TypeScript | Render.com |
| Database | Supabase (PostgreSQL) | Supabase Cloud |
| Authentication | Supabase Auth (JWT) | Supabase Cloud |
| CI/CD | GitHub Actions | GitHub Actions |

---

## Production URLs

- **Frontend:** https://cultural-agenda-frontend.vercel.app
- **Backend:** https://cultural-agenda.onrender.com

---

## How to Run Locally

**Backend:**
1. Clone the repository
2. `cd backend`
3. `npm install`
4. Create a `.env` file (see Environment Variables below)
5. `npm run dev`

**Frontend:**
1. `cd frontend`
2. `npm install`
3. Create `src/environments/environment.ts` (see Environment Variables below)
4. `npm start`

---

## Environment Variables

**Backend** — create a `.env` file in `/backend`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
PORT=3000
```

**Frontend** — create `src/environments/environment.ts` in `/frontend`:
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'your_supabase_url',
  supabaseKey: 'your_supabase_anon_key',
  apiUrl: 'http://localhost:3000'
};
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /events | No | List upcoming approved events |
| GET | /events/pending | Yes (admin) | List events pending moderation |
| GET | /events/:id | No | Get event details |
| POST | /events | Yes | Create event |
| PUT | /events/:id | Yes | Update event |
| DELETE | /events/:id | Yes | Delete event |
| PATCH | /events/:id/status | Yes (admin) | Approve or reject event |
| GET | /events/:id/attend | Yes | Check attendance |
| POST | /events/:id/attend | Yes | Register attendance |
| DELETE | /events/:id/attend | Yes | Cancel attendance |
| POST | /profiles | Yes | Create profile after signup |
| GET | /profiles/:id | No | View organizer profile |
| PUT | /profiles | Yes | Update own profile |

---

## Features

- Discover cultural events filtered by type, location and date
- Only future approved events shown in the main listing
- Authentication — register and login with email and password
- Attendance system — mark "I'm going" on any event
- Public organizer profiles with event history
- Admin moderation panel — approve or reject submitted events
- Role-based access control (user / admin)

---

## Design Decision

The moderation system uses a `status` field (`pending`, `approved`, `rejected`) directly on the `events` table instead of a separate moderation table. This keeps the data model simple while still allowing admins to control what appears publicly — sufficient for an MVP and easy to extend later if audit history becomes necessary.

---

## Tests

8 unit tests covering the event service layer, mocking Supabase with Vitest:
```bash
cd backend
npm test
```

---

## Screenshot
<img width="1903" height="942" alt="image" src="https://github.com/user-attachments/assets/b2cbad09-5d36-40ff-9e8e-6588b959660e" />
