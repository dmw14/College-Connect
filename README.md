# 🎓 Campus Connect — Modern College Communication Platform

Campus Connect is a modern web platform designed to simplify communication and information access within a college ecosystem.  
It enables **students**, **faculty**, and **admins** to share notices, resolve queries, and access academic updates seamlessly — all in one centralized system.

---

## 📋 Table of Contents
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [Getting Started](#-getting-started)

---

## ✨ Features

### 🎯 For Students
- **📢 Notice Board**: View all college notices with real-time updates
  - Categorized notices (Urgent, Exam, Academic, Event, General)
  - Color-coded badges for easy identification
  - Search functionality to find specific notices
  - Chronologically sorted with timestamps
  
- **❓ Query System**: Submit questions and track responses
  - Easy-to-use query submission form
  - Real-time status tracking (Pending, Responded, Resolved)
  - View all submitted queries in one place
  - Timestamped responses from admin team
  
- **🔍 Search & Filter**: Quickly find relevant information
  - Search across all notices
  - Filter by category
  - Responsive design for mobile and desktop

### 👨‍💼 For Administrators
- **📝 Notice Management**: Create and publish announcements
  - Rich text editor for detailed notices
  - Category selection for better organization
  - Instant publishing to all students
  - Edit and delete capabilities
  
- **💬 Query Management**: Respond to student queries
  - View all pending queries in one dashboard
  - Mark queries as responded or resolved
  - Track response history
  - Efficient workflow for handling multiple queries

### 🔐 Authentication & Authorization
- **Secure Login System**: Email/password authentication
- **Role-Based Access Control**: Separate dashboards for students and admins
- **Session Management**: Auto-login with persistent sessions
- **Profile Management**: User profiles with role information

---

## 🔄 How It Works

### System Architecture

```
┌─────────────────┐
│   React App     │
│  (Frontend UI)  │
└────────┬────────┘
         │
         │ HTTP/WebSocket
         │
┌────────▼────────┐
│ Lovable Cloud   │
│  (Supabase)     │
├─────────────────┤
│ • PostgreSQL DB │
│ • Auth Service  │
│ • RLS Policies  │
│ • Real-time API │
└─────────────────┘
```

### User Flow

#### Student Journey
1. **Sign Up/Login** → Student registers with email and optional student ID
2. **Dashboard** → Views latest notices and can submit queries
3. **Submit Query** → Fills form with question, submits to admin
4. **Track Status** → Monitors query status (Pending → Responded → Resolved)
5. **Search** → Uses search bar to find specific notices

#### Admin Journey
1. **Login** → Admin logs in with admin credentials
2. **Dashboard** → Views notice creation form and query management panel
3. **Post Notice** → Creates notice with title, content, and category
4. **Manage Queries** → Reviews pending student queries
5. **Respond** → Provides answer to student query and marks as responded

### Data Flow Example

**Posting a Notice:**
```
Admin → Create Notice Form → Validates Input → 
Supabase Auth Check → RLS Policy Verification → 
Insert into Database → Real-time Update → 
Student Dashboards Refresh Automatically
```

**Submitting a Query:**
```
Student → Query Form → Auth Check → 
Insert with student_id → Database Storage → 
Admin Dashboard Shows New Query → 
Admin Responds → Database Update → 
Student Dashboard Shows Response
```

---

## 🚀 Tech Stack

### 🖥️ Frontend
- ⚛️ **React 18** – UI library for building interactive user interfaces  
- 🔷 **TypeScript** – Adds type safety and better developer experience  
- ⚡ **Vite** – Lightning-fast build tool and dev server  
- 🎨 **Tailwind CSS** – Utility-first CSS framework for modern styling  
- 🧩 **shadcn/ui** – Pre-built UI components (buttons, cards, forms, modals, etc.)  
- 🔔 **Lucide React** – Open-source icon library for clean, consistent icons  

### 🗄️ Backend & Database
- ☁️ **Lovable Cloud (powered by Supabase)** – Managed backend platform  
- 🧮 **PostgreSQL** – Relational database  
- 🔒 **Row Level Security (RLS)** – Enforces database-level access control  
- 🔄 **Real-time Subscriptions** – Live data updates across clients

### 🔐 Authentication
- 🧾 **Supabase Auth** – Built-in user authentication system  
- ✉️ Email/Password authentication  
- 🔁 Auto session management  
- 🪪 JWT token-based authorization  

### ⚙️ State Management & Data Fetching
- 🔄 **TanStack Query (React Query)** – Server state management and caching  
- 🧠 **React Hook Form** – Form state management  
- ✅ **Zod** – Schema validation for forms and API data  

### 🧭 Routing
- 🛣️ **React Router v6** – Client-side navigation and protected routes  

---

## 🗃️ Database Schema

### Tables

#### `profiles`
Stores user profile information and roles
```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- full_name (text)
- role (enum: 'student' | 'admin')
- student_id (text, optional)
- created_at (timestamp)
```

#### `notices`
Stores all college notices and announcements
```sql
- id (uuid, primary key)
- title (text)
- content (text)
- category (enum: 'urgent' | 'exam' | 'academic' | 'event' | 'general')
- created_by (uuid, references profiles)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `queries`
Stores student queries and admin responses
```sql
- id (uuid, primary key)
- student_id (uuid, references profiles)
- question (text)
- response (text, optional)
- status (enum: 'pending' | 'responded' | 'resolved')
- responded_by (uuid, optional)
- responded_at (timestamp, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## 🔒 Security Features

### Row-Level Security (RLS) Policies

**Notices Table:**
- ✅ Everyone can view notices
- ✅ Only admins can create, update, and delete notices

**Queries Table:**
- ✅ Students can view only their own queries
- ✅ Students can create queries
- ✅ Admins can view all queries
- ✅ Admins can update queries (add responses)

**Profiles Table:**
- ✅ Users can view all profiles (for name display)
- ✅ Users can only update their own profile
- ✅ Auto-created on user signup via database trigger

### Authentication Flow
1. User signs up with email/password
2. Supabase creates auth record
3. Database trigger creates profile record
4. Role assigned (student/admin)
5. JWT token issued for API requests
6. RLS policies enforce data access rules

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd campus-connect
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# .env file is auto-configured with Lovable Cloud
# Contains VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
```

4. Start development server
```bash
npm run dev
```

5. Open browser to `http://localhost:5173`

### First-Time Setup

1. **Create Admin Account:**
   - Sign up with email/password
   - Select "Admin" role during registration
   
2. **Create Student Account:**
   - Sign up with email/password
   - Select "Student" role
   - Optionally provide student ID

3. **Test the System:**
   - Login as admin, post a notice
   - Login as student, view notice and submit query
   - Admin responds to query
   - Student sees response

---

## 📱 Pages & Routes

- `/` - Landing page with feature overview
- `/auth` - Login/Signup page
- `/dashboard` - Role-based dashboard (redirects to student or admin view)
  - Student view: Notices + Query submission
  - Admin view: Notice creation + Query management

---

## 🎨 Design System

- **Color Palette:** Deep blue primary with amber accents
- **Typography:** Clean, modern sans-serif fonts
- **Components:** Card-based layouts with hover effects
- **Responsive:** Mobile-first design approach
- **Dark Mode:** (Future enhancement)

---

## 🔮 Future Enhancements

- 📅 Academic calendar integration
- 📊 Analytics dashboard for admins
- 🔔 Push notifications for new notices
- 📁 File attachments for notices
- 🏷️ Tags and advanced filtering
- 💬 Real-time chat between students and faculty
- 📱 Mobile app (React Native)

---

## 📄 License

This project is built with [Lovable](https://lovable.dev) - The AI-powered web development platform.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

**Built with ❤️ for better college communication**
