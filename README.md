# JAT: Job Application Tracker (Final Year Project)

JAT (Job Application Tracker) is a web application designed to help job seekers log, organize, track, and manage their job applications in one place. It also includes automated email reminder notifications for critical tasks (interviews, deadlines, follow-ups) and a dedicated Admin Dashboard to monitor user activity and manage system configurations.

---

## 🚀 Features

### For Job Seekers (Users)
*   **Job Tracking Dashboard:** Visualize application statistics (total applications, interview counts, current application statuses) with beautiful interactive charts.
*   **Application Logs:** Create, update, read, and delete job applications (incorporating position, company, contact info, job links, and progress statuses).
*   **Document Management:** Upload resumes, cover letters, and transcripts directly to the cloud.
*   **Task & Interview Reminders:** Set notifications for deadlines, interviews, or follow-ups.
*   **Automatic Email Alerts:** Receive timely emails for scheduled reminders through a background cron service.
*   **Profile Configuration:** Edit user settings and professional career preferences.

### For Administrators (Admins)
*   **Admin Dashboard:** Platform-wide metrics including total users, active applications, and system logs.
*   **User Management:** Audit registered candidates and manage or delete user profiles.
*   **Job & Data Supervision:** Track and delete any job postings or applications.
*   **System Controls & Audits:** Update global configuration profiles and view/clear system logs.

---

## 🛠️ Tech Stack

### Frontend
*   **Core Library:** React (v19)
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (v4)
*   **Routing:** React Router DOM (v7)
*   **Charts:** Recharts
*   **Icons:** Lucide React
*   **HTTP Client:** Axios (with automatic Bearer token injection and inactivity auto-logout interceptor)

### Backend
*   **Runtime:** Node.js / Express
*   **Database:** MongoDB (via Mongoose ODM)
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs
*   **Storage Service:** Cloudinary (via Multer)
*   **Mailing System:** Nodemailer & Brevo
*   **Scheduler:** Node-cron (daily/semi-hourly background reminder processor)

The project is designed to be easily deployed on:
1.  **Frontend:** Vercel / Netlify
2.  **Backend:** Render / Heroku
3.  **Database:** MongoDB Atlas (Free Tier)
