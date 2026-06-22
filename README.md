# Rotary Connect - Rotary Club Visnagar 🌟

Welcome to the **Rotary Connect** web application repository! This platform was built to serve the Rotary Club of Visnagar by streamlining community drive management, volunteer registration, and showcasing the club's amazing community impact.

## 🚀 Features

- **Dynamic Event Management:** Modern flip-card UI displaying upcoming community health and education drives, fetching live data directly from the database.
- **Volunteer & Patient Registration:** Seamless, one-click forms for users to register as volunteers or patients for specific events.
- **Admin Dashboard:** A secure, comprehensive control panel for the Rotary admin team to:
  - View all registered volunteers and patients.
  - Approve, reject, or manage community stories submitted by users.
  - Manage their team members.
- **Community Testimonials:** A "Share Your Story" feature where users can submit their experiences, which go live on the homepage once approved by an admin.
- **Modern UI/UX:** Built with a stunning, highly responsive design featuring smooth transitions, glassmorphism, and a vibrant Rotary-inspired color scheme.

## 💻 Tech Stack

- **Frontend framework:** Next.js (App Router) & React
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **ODM / Database Interfacing:** Mongoose
- **Icons & UI:** Heroicons & Custom SVG illustrations

## 🛠️ Getting Started

To run this project locally, follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory and add your MongoDB connection string.
```env
MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>/rotary?retryWrites=true&w=majority"
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the live application.

## 📁 Project Structure

- `app/` - Contains all Next.js page routes, including the main site and the secure `/admin` paths.
- `app/api/` - Next.js Route Handlers (API endpoints) for events, participants, stories, and admin login.
- `components/` - Reusable React components (Navbar, Footer, Modals, StatsCounter, Testimonials).
- `models/` - Mongoose schemas defining the structure of Events, Participants, Stories, and AdminUsers.
- `lib/` - Helper utilities, including the MongoDB connection script.
- `public/` - Static assets, including event photos, logos, and general images.

## 🤝 Contribution
Designed and developed for the Rotary Club of Visnagar to foster community service and volunteer engagement.
