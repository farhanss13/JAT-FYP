# JAT (Job Application Tracker) - Backend Documentation

This document provides a comprehensive overview of the JAT Backend application, including system architecture, database models, middleware, cron jobs, and API routes.

---

## Tech Stack
*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB via Mongoose ODM
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs (password hashing)
*   **File Uploads:** Multer & Cloudinary (via `multer-storage-cloudinary`)
*   **Notifications & Mail:** Nodemailer & Brevo
*   **Scheduler:** `node-cron` (for automated reminders)

---

## Folder Structure
```text
backend/
├── config/             # Database connection configuration
├── controllers/        # Request controllers containing business logic
├── cron/               # Cron jobs (e.g., daily reminder emails)
├── middleware/         # Custom Express middleware (auth, uploads)
├── models/             # Mongoose schemas/models
├── routes/             # Express route definitions
├── services/           # External integration services (email, etc.)
├── utils/              # Helper utilities
├── server.js           # Server entry point
└── createAdmin.js      # Script to seed the initial Administrator user
```

---

## Database Models

### 1. User (`models/User.js`)
Stores user profiles and credential information for authentication and role-based access control.
*   `fullName` (String, Required): Full name of the user.
*   `email` (String, Required, Unique): Email address (used as login username).
*   `password` (String, Required): Hashed password.
*   `careerPreferences` (String, Default: `""`): Career objectives or preferred jobs.
*   `role` (String, Enum: `["user", "admin"]`, Default: `"user"`): Access level role.
*   `loginAttempts` (Number, Default: `0`): Lockout control mechanism helper.
*   `lockUntil` (Date): Account lockout expiration date.
*   `resetPasswordToken` (String): Temporary reset token.
*   `resetPasswordExpire` (Date): Expiry timestamp for the reset token.
*   *Timestamps enabled* (`createdAt`, `updatedAt`).

### 2. JobApplication (`models/jobApplication.js`)
Tracks the job application details for each user.
*   `userId` (ObjectId, Ref: `User`, Required): Owner of the application.
*   `positionTitle` (String, Required): Target position.
*   `company` (String, Default: `""`): Company name.
*   `jobLink` (String): URL linking to the job posting.
*   `dateApplied` (Date, Default: `Date.now`): Application submission date.
*   `contact` (String): Contact person information.
*   `status` (String, Enum: `["Applied", "Screening", "Interview", "Offer", "Rejected"]`, Default: `"Applied"`): Status tracker.
*   *Timestamps enabled* (`createdAt`, `updatedAt`).

### 3. Document (`models/Document.js`)
Manages resume and cover letter uploads.
*   `userId` (ObjectId, Ref: `User`): Uploader.
*   `jobApplicationId` (ObjectId, Ref: `JobApplication`): Associated job application.
*   `documentType` (String, Enum: `["resume", "coverLetter", "other"]`): Type of document.
*   `filePath` (String): Cloudinary secure URL/File path.
*   `publicId` (String): Cloudinary resource public identifier.
*   `originalName` (String): Original file name.
*   `storageProvider` (String, Default: `"cloudinary"`): Storage system.
*   `uploadedAt` (Date, Default: `Date.now`).

### 4. Reminder (`models/Reminder.js`)
Stores event or follow-up triggers for user job applications.
*   `userId` (ObjectId, Ref: `User`, Required): Target recipient.
*   `jobApplicationId` (ObjectId, Ref: `JobApplication`, Required): Linked application.
*   `reminderDate` (Date, Required): Scheduled date/time of the event.
*   `reminderType` (String, Enum: `["Follow-up", "Interview", "Deadline", "Other"]`, Default: `"Follow-up"`).
*   `isRead` (Boolean, Default: `false`): Notification read status.
*   `status` (String, Enum: `["Pending", "Triggered"]`, Default: `"Pending"`).
*   *Timestamps enabled* (`createdAt`, `updatedAt`).

### 5. Settings (`models/Settings.js`)
Stores application configuration settings.
*   `emailNotifications` (Boolean, Default: `true`): Global notification toggles.
*   `defaultJobStatus` (String, Default: `"Applied"`): Fallback job state when creating applications.

### 6. Log (`models/Log.js`)
Audit trails detailing system and user events.
*   `userId` (ObjectId, Ref: `User`): Performed-by user indicator.
*   `action` (String): Performed action description.
*   `message` (String): Diagnostic message log.
*   `createdAt` (Date, Default: `Date.now`).

---

## API Routes & Endpoints

All endpoints are prefixed with `/api`.

### 1. Authentication Routes (`/api/auth`)
Defined in `routes/authRoutes.js`.
*   **POST** `/register`
    *   *Access:* Public
    *   *Description:* Registers a new user.
*   **POST** `/login`
    *   *Access:* Public
    *   *Description:* Authenticates credentials, returns JWT token and user info.
*   **POST** `/forgot-password`
    *   *Access:* Public
    *   *Description:* Sends a password reset link to user's email.
*   **POST** `/reset-password/:token`
    *   *Access:* Public
    *   *Description:* Resets the user's password using the token sent via email.

### 2. User Routes (`/api/user`)
Defined in `routes/userRoutes.js`.
*   **GET** `/me`
    *   *Access:* Protected (User Token)
    *   *Description:* Fetches the current logged-in user profile.
*   **PUT** `/me`
    *   *Access:* Protected (User Token)
    *   *Description:* Updates user profile (name, career preferences, etc.).

### 3. Job Application Routes (`/api/jobs`)
Defined in `routes/jobRoutes.js`.
*   **POST** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Adds a new job application.
*   **GET** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Lists all job applications for the logged-in user.
*   **GET** `/:id`
    *   *Access:* Protected (User Token)
    *   *Description:* Gets details of a specific job application.
*   **PUT** `/:id`
    *   *Access:* Protected (User Token)
    *   *Description:* Updates a job application details (status, contact, etc.).
*   **DELETE** `/:id`
    *   *Access:* Protected (User Token)
    *   *Description:* Deletes a job application.

### 4. Dashboard Stats Routes (`/api/dashboard`)
Defined in `routes/dashboardRoutes.js`.
*   **GET** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Fetches analytics dashboard metrics (total applied, interviews, status breakdowns, etc.).

### 5. Document Routes (`/api/documents`)
Defined in `routes/documentRoutes.js`.
*   **POST** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Uploads a file (multipart/form-data) under `file` field and stores it on Cloudinary.
*   **GET** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Lists documents uploaded by the user.
*   **GET** `/job/:jobId`
    *   *Access:* Protected (User Token)
    *   *Description:* Gets all documents associated with a specific job application.
*   **DELETE** `/:id`
    *   *Access:* Protected (User Token)
    *   *Description:* Deletes a document record and removes it from storage.

### 6. Reminder Routes (`/api/reminders`)
Defined in `routes/reminderRoutes.js`.
*   **POST** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Schedules a new reminder.
*   **GET** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Retrieves all reminders belonging to the user.
*   **PUT** `/:id`
    *   *Access:* Protected (User Token)
    *   *Description:* Modifies a reminder date or type.
*   **PUT** `/read/:id`
    *   *Access:* Protected (User Token)
    *   *Description:* Marks a reminder as read/seen.
*   **DELETE** `/:id`
    *   *Access:* Protected (User Token)
    *   *Description:* Cancels/Deletes a reminder.

### 7. Settings Routes (`/api/settings`)
Defined in `routes/settingsRoutes.js`.
*   **GET** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Gets user setting preferences.
*   **PUT** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Updates application settings.

### 8. System Log Routes (`/api/logs`)
Defined in `routes/logRoutes.js`.
*   **GET** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Fetches action logs (mostly used by admin).
*   **DELETE** `/`
    *   *Access:* Protected (User Token)
    *   *Description:* Clears all application action logs.

### 9. Admin Routes (`/api/admin`)
Defined in `routes/adminRoutes.js`.
Requires both user validation and checking if `req.user.role === 'admin'`.
*   **GET** `/users`
    *   *Access:* Protected (Admin Only)
    *   *Description:* Retrieves lists of all registered users in the platform.
*   **DELETE** `/users/:id`
    *   *Access:* Protected (Admin Only)
    *   *Description:* Deletes a user profile and all their associated records.
*   **GET** `/stats`
    *   *Access:* Protected (Admin Only)
    *   *Description:* Aggregates platform-wide system performance stats.
*   **GET** `/jobs`
    *   *Access:* Protected (Admin Only)
    *   *Description:* Lists all job applications submitted across the system.
*   **GET** `/users/:id/jobs`
    *   *Access:* Protected (Admin Only)
    *   *Description:* Retreives all job applications submitted by a specific user.
*   **DELETE** `/jobs/:id`
    *   *Access:* Protected (Admin Only)
    *   *Description:* Deletes any job application in the system.
*   **GET** `/settings`
    *   *Access:* Protected (Admin Only)
    *   *Description:* Retreives system-wide settings.
*   **PUT** `/settings`
    *   *Access:* Protected (Admin Only)
    *   *Description:* Modifies system-wide configurations.

---

## Background Schedulers & Services

### Email Notification Cron (`cron/reminderCron.js`)
*   Runs daily tasks to check for reminders that match today's date.
*   If found, compiles emails using templates and sends notifications through nodemailer to notify candidates of upcoming Interviews, Deadlines, or Follow-up tasks.
