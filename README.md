<div align="center">
  <br />
    <img src="public/globe.svg" alt="Brua Logo" width="80" height="80" />
  <br />
  
  # Brua: Enterprise URL Shortener
  
  **A highly scalable, multi-tenant B2B URL shortener built for modern marketing teams.**
  
  *Next.js 15 • Clerk Workspaces • Upstash Redis • MongoDB • Framer Motion*
</div>

---

## ⚡ Overview

**Brua** is not just another URL shortener. It is a full-fledged enterprise marketing intelligence platform. Designed to handle massive traffic spikes with edge caching, Brua provides robust B2B organizational workspaces, deep geographical analytics, and real-time asynchronous webhooks—all wrapped in a premium, highly fluid user interface.

## ✨ Key Features

- **Multi-Tenant Workspaces:** Powered by Clerk, enabling users to switch seamlessly between personal projects and organizational team workspaces with strict data isolation.
- **Sub-10ms Edge Caching:** Integrated with Upstash Redis (write-through cache) to ensure shortened URLs redirect globally in milliseconds without hitting the primary database.
- **Real-Time Webhooks:** Fire asynchronous POST requests the exact millisecond a user clicks a link, perfect for updating external CRMs or triggering Zapier workflows.
- **GA4 Measurement Protocol:** Natively pushes server-side click events directly into Google Analytics 4.
- **Deep Analytics Dashboard:** A beautiful, responsive dashboard to track total clicks, geographic distribution, and device metrics, complete with 1-click CSV data exports.
- **Premium UI/UX:** Built with Framer Motion and Tailwind CSS to deliver a sleek, dark-mode-first aesthetic inspired by top-tier developer tools.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Backend:** Next.js Serverless Route Handlers (`/api/*`).
- **Database:** MongoDB (via Mongoose) for unstructured analytics data storage.
- **Caching:** Upstash Redis for global edge resolution.
- **Authentication:** Clerk `@clerk/nextjs` (Core 3) with Organization/Workspace support.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js 18+ installed. You will also need accounts for [MongoDB Atlas](https://www.mongodb.com/atlas), [Upstash](https://upstash.com/), and [Clerk](https://clerk.com/).

### 1. Clone the repository
```bash
git clone https://github.com/your-username/brua.git
cd brua/url-shortener
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# MongoDB Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/brua?retryWrites=true&w=majority

# Upstash Redis (Optional but recommended for speed)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### 4. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application!

---

## 🔒 Security & Data Isolation
Brua is built with enterprise security in mind. Every shortened URL is strictly bound to an `ownerId` (either a User ID or an Organization ID). Next.js Middleware and server-side `auth()` checks ensure that a user can never view, edit, or access analytics for a link they do not explicitly own.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/brua/issues).

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
