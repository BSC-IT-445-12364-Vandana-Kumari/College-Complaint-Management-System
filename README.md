<div align="center">

  <h1>🎓 CIMAGE College Complaint Management System</h1>
  
  <p align="center">
    <strong>Empowering Students. Streamlining Resolutions. Enhancing Campus Life.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/OpenAI-Integrated-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  </p>

  <p align="center">
    <i>A highly scalable, secure, and modern web application built on the MERN stack designed exclusively for addressing and resolving college grievances.</i>
  </p>

</div>

---

## 📖 Project Overview

Managing operations in a large educational institution like **CIMAGE College** can be challenging. Often, student complaints about IT issues, infrastructure, or faculty miscommunications get lost in a sea of paperwork or prolonged email threads. 

The **College Complaint Management System (CCMS)** is engineered to solve this. It provides a centralized, transparent platform where students can seamlessly file their grievances and track them in real-time. Meanwhile, College Administrators gain access to a powerful, AI-assisted dashboard to categorize, monitor, and resolve these issues efficiently.

**Why this project stands out?**
- **Zero Paperwork:** 100% digital grievance filing process.
- **AI-Powered:** Utilizes OpenAI to analyze and prioritize critical complaints.
- **Real-Time Synchronisation:** Live status updates utilizing WebSocket technology.
- **Uncompromised Security:** Token-based authentication making the data completely secure.

---

## 🌟 Key Features

| 🧑‍🎓 Student Portal | 👨‍💼 Administrator Portal | ⚙️ System Capabilities |
| :--- | :--- | :--- |
| **Secure Login:** Dedicated student authentication routes. | **Analytics Dashboard:** Graphical representation of all pending and resolved tasks. | **Role-Based Access Control (RBAC):** Strict separation of privileges. |
| **Lodge Complaints:** Beautiful, multi-step forms with image/file upload support. | **Manage Tickets:** Change complaint statuses (Pending -> In Progress -> Resolved). | **Real-Time Sockets:** Pushes live notifications straight to user devices. |
| **Track Status:** Live progress tracking and history timeline of their lodged complaints. | **AI Categorization:** Automatically groups complaints using OpenAI NLP. | **Responsive Design:** Flawless experience on Mobile, Tablet & Desktop. |

---

## 💻 Tech Stack Deep Dive

Built entirely on the **MERN (MongoDB, Express, React, Node.js)** architecture with modern tooling:

### 🎨 Frontend
* **Core:** React.js (v18) via Vite for lightning-fast HMR and optimized builds.
* **Styling:** Tailwind CSS integrated with smooth Framer Motion animations.
* **Component Library:** Radix UI for headless, accessible, and robust UI elements.
* **State & Routing:** Context API and React Router DOM v6.

### ⚙️ Backend
* **Server:** Node.js environment powered by Express.js framework.
* **Database:** MongoDB configured using Mongoose ODM schemas.
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs for encrypted password hashing.
* **Storage:** Multer to securely parse and manage file uploads.
* **Services:** Socket.io for WebSockets, OpenAI API for language processing.

---

## 📸 System Showcase

> *Tip: Replace the placeholder images below with actual screenshots of your running project to make this section perfectly real!*

### 1. Student Dashboard
A clean, welcoming interface where students can instantly view their active tickets and submit new ones without friction.
![Student Dashboard Placeholder](https://via.placeholder.com/1000x450/0f172a/38bdf8?text=+-+Insert+Student+Dashboard+Screenshot+Here+-)

### 2. Lodge a Complaint Flow
An intuitive form supporting rich text and file attachments for thorough grievance explanations.
![Complaint Form Placeholder](https://via.placeholder.com/1000x450/0f172a/a855f7?text=+-+Insert+Complaint+Form+Screenshot+Here+-)

### 3. Administrator Operations
A powerful, feature-dense panel showing statistical graphs, pending requests, and AI insights.
![Admin Dashboard Placeholder](https://via.placeholder.com/1000x450/0f172a/10b981?text=+-+Insert+Admin+Dashboard+Screenshot+Here+-)

---

## 🚀 Installation & Setup

Want to run this project locally? Follow these steps!

### Prerequisites
- [Node.js](https://nodejs.org/en/) installed (v18.x recommended)
- [MongoDB](https://www.mongodb.com/) account (or local server running)

### Step-by-Step Guide

**1. Clone the repository**
```bash
git clone https://github.com/your-username/VANDANA-PROJECT.git
cd VANDANA-PROJECT
```

**2. Setup Backend Server**
```bash
cd backend
npm install
```
*Create a `.env` file in the backend root directory:*
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=your_openai_api_key
```
*Run the backend:*
```bash
npm run dev
```

**3. Setup Frontend Application**
```bash
cd ../frontend
npm install
```
*Run the frontend application:*
```bash
npm run dev
```

The application will forcefully boot up on [http://localhost:5173](http://localhost:5173).

---

## 📂 Project Structure

```text
VANDANA-PROJECT/
├── backend/
│   ├── index.js          # Entry point for Express Server
│   ├── routes/           # Express API Routes
│   ├── models/           # Mongoose Database Models
│   ├── controllers/      # Route logic & Database integrations
│   └── .env              # Backend Secrets
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components (Tailwind + Radix)
    │   ├── pages/        # Main route views (Dashboard, Login, etc.)
    │   ├── App.jsx       # React application root
    │   └── main.jsx      # Vite entry file
    ├── vite.config.js    # Vite bundler configuration
    └── package.json      # Frontend dependencies
```

---

<div align="center">
  <p>Crafted with absolute dedication and modern web technologies to serve <b>CIMAGE College</b>.</p>
</div>
