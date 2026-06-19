# JAT (Job Application Tracker) - Frontend Documentation

This document describes the structure, architecture, styling, and application routing of the JAT Frontend application.

---

## Tech Stack
*   **Library:** React (v19)
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (v4)
*   **Routing:** React Router DOM (v7)
*   **State & HTTP Client:** Axios
*   **Charts & Visualization:** Recharts
*   **Icons:** Lucide React
*   **Toast Notifications:** React Toastify

---

## Folder Structure
```text
frontend/
├── public/             # Static public assets
├── src/
│   ├── assets/         # App asset images/icons
│   ├── components/     # Reusable layout and helper UI components
│   │   ├── Layout.jsx  # Main container page template (sidebar/layout wrapper)
│   │   ├── Navbar.jsx  # Header navigation and authentication actions
│   │   └── Charts.jsx  # Statistics charts powered by Recharts
│   ├── pages/          # Individual screen/page views
│   │   ├── admin/      # Administrator-exclusive pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── systemLogs.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Jobs.jsx
│   │   ├── Reminders.jsx
│   │   ├── Documents.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   └── applicationDetails.jsx
│   ├── services/       # Network request services
│   │   └── api.js      # Axios instance & interceptors
│   ├── App.css         # Global component override styles
│   ├── index.css       # Core Tailwind CSS directives and theme settings
│   ├── main.jsx        # React DOM entry mounting file
│   └── App.jsx         # Root app layout router configuration
```

---

## Navigation & Page Routes (`App.jsx`)

The routing uses role-based access control based on user authentication status (`token` and `role` saved in `localStorage`).

### Public Routes
*   `/login` -> `Login.jsx` (Redirects to `/dashboard` if already authenticated)
*   `/register` -> `Register.jsx` (Redirects to `/dashboard` if already authenticated)
*   `/forgot-password` -> `ForgotPassword.jsx`
*   `/reset-password/:token` -> `ResetPassword.jsx`

### Authenticated User Routes (Role: `"user"`)
*   `/dashboard` -> `Dashboard.jsx` (Core dashboard view with application statistics and statuses)
*   `/profile` -> `Profile.jsx` (Updates profile details and career preferences)
*   `/jobs` -> `Jobs.jsx` (Interactive Job Application log interface for adding, editing, and deleting applications)
*   `/job/:id` -> `applicationDetails.jsx` (Details page showing contact info, attachments, and reminders of a specific job)
*   `/documents` -> `Documents.jsx` (Upload center for resumes, cover letters, and transcripts)
*   `/reminders` -> `Reminders.jsx` (Lists and schedules future application event reminders)

### Authenticated Admin Routes (Role: `"admin"`)
*   `/dashboard` -> `AdminDashboard.jsx` (Platform diagnostics and activity analytics)
*   `/admin/users` -> `ManageUsers.jsx` (Allows deleting profiles, listing details)
*   `/admin/settings` -> `Settings.jsx` (Global administrative system toggle controllers)
*   `/admin/logs` -> `systemLogs.jsx` (Interactive viewer for system audit logs)

---

## Network Layer & Session Management (`services/api.js`)

All network requests flow through the Axios `API` instance which does the following:

1.  **Bearer Authentication:** Request interceptor injects the stored JWT token:
    ```javascript
    req.headers.Authorization = `Bearer ${token}`;
    ```
2.  **Inactivity Auto-Logout:**
    *   Tracks the user's last interaction by writing to `localStorage` under `lastActivity` on every request.
    *   A background timer runs every 60 seconds checking if the last activity exceeds **30 minutes** (`30 * 60 * 1000` ms).
    *   If the session expires, it clears storage and routes the user back to `/login`.
