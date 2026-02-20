# 🎓 Campus Connect — Modern College Communication Platform

Campus Connect is a modern web platform designed to simplify communication and information access within a college ecosystem.  
It enables **students**, **faculty**, and **admins** to share notices, resolve queries, and access academic updates seamlessly — all in one centralized system.

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
│      Cloud      │
│    (Supabase)   │
├─────────────────┤
│ • PostgreSQL DB │
│ • Auth Service  │
│ • RLS Policies  │
│ • Real-time API │
└─────────────────┘
```

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
