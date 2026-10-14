# FyerX Community Events Board

A community events platform for discovering upcoming events, managing event listings as an admin, saving reminders, and personalizing a user feed based on category interests.

## Tech Stack

- Next.js 16 (App Router) and React 19
- TypeScript
- PostgreSQL with Drizzle ORM and the `postgres` driver
- Zod for request validation
- JWT auth with `jsonwebtoken`
- Password hashing with `bcryptjs`
- Tailwind CSS 4
- Shared UI primitives in `src/components/ui` use `radix-ui`, `class-variance-authority`, and `cn`

## Features

- Admin event creation and editing
- Public event discovery for upcoming active events
- Search, category filtering, city filtering, and client-side pagination
- JWT-based sign-in, sign-up, logout, and auth status checks
- Category preference management
- Personalized event feed based on saved categories
- Reminder toggling for upcoming events
- Event card customization with preset backgrounds and stickers

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with these variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `SEED_ADMIN_EMAIL` (required only for seeding)
   - `SEED_ADMIN_PASSWORD` (required only for seeding)

3. Apply database migrations:

   ```bash
   npm run db:migrate
   ```

   If you change the schema later, generate a new migration first:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. Optional seed data:

   ```bash
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Architecture

- `users`: application accounts with an `ADMIN` or `USER` role.
- `categories`: master list of event categories.
- `events`: event records linked to `categories.id` and `users.id` via `category_id` and `created_by`.
- `user_favourites`: many-to-many join table between users and preferred categories.
- `event_reminders`: many-to-many join table between users and saved events.
- `event_card_designs`: one customization row per user/event pair with a background and sticker list.

Notable constraints:

- `users.email` and `categories.name` are unique.
- `events.price` is constrained to be non-negative.
- `event_card_designs` enforces one design per user/event pair.

## API Documentation

Most endpoints use the shared `apiHandler`, which returns JSON in the shape `{ success, data }` on success and `{ success, error }` on failure.

| Method | Endpoint                       | Purpose                                                 | Auth                |
| ------ | ------------------------------ | ------------------------------------------------------- | ------------------- |
| POST   | `/api/auth/signup`             | Create a user account                                   | None                |
| POST   | `/api/auth/signin`             | Sign in a regular user and set the auth cookie          | None                |
| GET    | `/api/auth/me`                 | Check whether the current cookie is authenticated       | None                |
| POST   | `/api/auth/logout`             | Clear the auth cookie                                   | Uses current cookie |
| POST   | `/api/admin/login`             | Sign in an admin and set the auth cookie                | None                |
| GET    | `/api/categories`              | List categories for filters and preferences             | None                |
| GET    | `/api/events`                  | List upcoming active events                             | None                |
| GET    | `/api/events/[id]`             | Read a single upcoming active event                     | None                |
| PUT    | `/api/events/[id]/reminder`    | Toggle a reminder for the signed-in user                | Authenticated user  |
| GET    | `/api/events/[id]/card-design` | Read the current user’s card design for an event        | Authenticated user  |
| PUT    | `/api/events/[id]/card-design` | Save the current user’s card design for an event        | Authenticated user  |
| GET    | `/api/me/preferences`          | Read saved category preferences                         | Authenticated user  |
| PUT    | `/api/me/preferences`          | Replace saved category preferences                      | Authenticated user  |
| GET    | `/api/me/feed`                 | Return upcoming active events matching saved categories | Authenticated user  |
| GET    | `/api/me/reminders`            | Return upcoming active events with reminders enabled    | Authenticated user  |
| GET    | `/api/admin/events`            | List all events for the admin dashboard                 | Admin only          |
| POST   | `/api/admin/events`            | Create an event                                         | Admin only          |
| GET    | `/api/admin/events/[id]`       | Read a single event for editing                         | Admin only          |
| PATCH  | `/api/admin/events/[id]`       | Update an event                                         | Admin only          |

## Project Structure

```text
.
├── drizzle/
├── drizzle.config.ts
├── package.json
└── src/
    ├── app/
    │   ├── api/
    │   └── (protected)/
    ├── components/
    │   ├── admin/
    │   ├── auth/
    │   ├── events/
    │   └── preferences/
    ├── db/
    │   └── schemas/
    ├── lib/
    │   ├── utils/
    │   └── validations/
    └── types/
```

## Design Decisions

- Route groups under `src/app/(protected)` enforce authentication at the layout level for user and admin pages.
- JWTs are stored in an `httpOnly` cookie and verified server-side through `verifyToken`; admin-only routes use `requireAdmin`.
- `apiHandler` and `ApiError` keep API responses consistent and predictable.
- The public events view loads active upcoming events once, then applies search, filters, and pagination on the client.

## AI Assistance Disclosure

I used ChatGPT extensively throughout the development of this assignment for code generation, implementation guidance, debugging, and UI design.

- **Frontend:** Most frontend components, layouts, and Tailwind CSS styling were generated with AI assistance, then integrated and tested by me.
- **Card Designer:** The background selection, sticker customization, animations, and API integration were primarily AI-generated.
- **Backend:** I personally implemented several API routes, database queries, validation logic, and authentication-related functionality with AI guidance and code examples.
- **Database Queries:** AI assisted with the `LEFT JOIN` query used to retrieve user-specific card designs in the personalized feed.
- **Testing and Integration:** I manually tested the application, identified and fixed integration issues, and verified the main user workflows.

AI-generated code was reviewed and integrated into the application, although my level of understanding varies across different parts of the implementation.

## Technical Explanations

### Database Design

I separated users, events, categories, preferences, reminders, and card designs into individual tables to avoid unnecessary duplication. Join tables manage user-category preferences and event reminders. A unique user/event constraint ensures each user has only one saved design per event.

### Event Filtering and Indexing

The application retrieves active upcoming events and applies search, category, city filtering, and pagination on the client. For a larger dataset, I would move filtering to PostgreSQL and add a composite index on `(is_active, event_date)` to improve upcoming event retrieval.

### Authentication and Admin Security

Passwords are hashed using bcryptjs before storage. JWTs are stored in HTTP-only cookies and verified on the server. Protected layouts restrict access to authenticated pages, while admin-only API routes verify authorization using `requireAdmin`.

## Known Limitations

- Search, filtering, and pagination are client-side only; the public events API does not accept query parameters.
- Admin event management currently supports create and edit only. There is no delete endpoint or delete UI.
- Card customization is limited to three preset backgrounds and up to three stickers from a fixed sticker set.
