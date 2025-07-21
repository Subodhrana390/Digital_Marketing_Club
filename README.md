# DMC: Digital Marketing Club Platform

DMC is a comprehensive, feature-rich web platform built for the **Digital Marketing Club** at GNDEC, Ludhiana. It serves as a central hub for members, students, and the public to engage with the club's activities, resources, and content. The platform includes a public-facing website and a powerful, secure admin panel for managing all aspects of the club's digital marketing operations.

![MarketVerse Homepage](/public/home.png)

## ✨ Key Features

### Public-Facing Website
- **Homepage:** A stunning, animated landing page introducing the club and its mission in the world of digital marketing.
- **Events Showcase:** View upcoming and past digital marketing workshops and events with a clean, modern UI and session-based filtering.
- **Event Details & Registration:** Detailed event pages with banners, photo galleries, and a seamless on-page registration pop-up form for marketing events.
- **Blog Platform:** A fully-featured blog with search functionality, beautifully rendered articles on digital marketing topics with a dynamic table of contents, and an optimized reading experience.
- **Resource Library:** A curated collection of digital marketing tools, templates, and learning resources, categorized for easy access.
- **Team Pages:** Separate, dedicated pages for the **Core Team** (with detailed profiles) and the **Active Team** (with member lists), including session-based filtering.
- **Public Analytics:** A transparent reports page showcasing club statistics like event attendance and content engagement, highlighting our marketing impact.
- **Contact Form:** A functional contact page that stores submissions for admin review.
- **AI Ideation Tool:** A public tool for generating blog post ideas using Genkit, focused on digital marketing keywords.
- **Responsive Design:** A fully responsive and mobile-friendly experience across all public pages.

### Admin Panel
- **Secure Authentication:** Admin login via Email/Password, protected by an authentication guard.
- **Dashboard:** An at-a-glance overview of key club metrics (total members, upcoming events, etc.).
- **Content Management (CRUD):**
  - **Blogs:** Create, edit, and delete blog posts. Features AI-powered content and title generation for digital marketing articles.
  - **Events:** Create, edit, and delete digital marketing events.
  - **Members:** Manage the Core and Active team members list.
  - **Resources:** Manage the digital marketing resource library.
- **Event & Attendee Management:**
  - View, add, and manage student registrations for each event.
  - Track student attendance.
  - Upload and manage event reports (e.g., PDFs), which are also deleted from cloud storage when an event is deleted.
  - **Certificate Generation:** Upload a certificate template, and automatically generate and email participation certificates to attendees using Cloudinary for image overlays and an email service.
- **Member Application Management:**
  - View and review new member applications submitted through the public site.
  - **Approve or Reject** applications directly from the admin panel. Approved applicants are automatically added to the "Active Team".
- **Contact Submission Management:**
  - View and delete messages submitted through the public contact form.
- **Reporting:**
  - View analytics charts for event attendance and platform engagement.
  - Access a centralized list of all event reports.


## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with Radix UI primitives.
- **UI Components:** ShadCN UI
- **Generative AI:** Google AI with Genkit for AI flows (content generation).
- **Backend & Database:** Firebase (Firestore, Authentication, Storage).
- **Image & Asset Management:** Cloudinary for certificate generation and transformations.
- **Transactional Emails:** Nodemailer
- **Form Management:** React Hook Form with Zod for validation.
- **Icons:** Lucide React

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/market-verse.git
cd market-verse
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of the project and add the following environment variables. These are required for Firebase, Cloudinary, and your email service to function correctly.

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Cloudinary Configuration (for certificate generation)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Nodemailer Configuration (for sending emails)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
```

### 4. Run the Development Server
You can run the application in development mode with:

```bash
npm run dev
```
The application will be available at `http://localhost:9002`.

### 5. Run the Genkit AI Flows (Optional)
To test and run the AI flows locally, you'll need to run the Genkit development server in a separate terminal:

```bash
npm run genkit:dev
```
This starts the Genkit developer UI, where you can inspect and test your AI flows.

## 📁 Project Structure

```
src
├── app/
│   ├── (admin)/          # Admin panel routes & layout
│   ├── (auth)/           # Authentication routes (login)
│   ├── (public)/         # Wrapper for all public-facing pages
│   │   ├── blog/         # Public blog routes
│   │   ├── events/       # Public event routes
│   │   ├── members/      # Public member pages (core, active)
│   │   └── ...           # Other public pages (home, contact, etc.)
│   └── api/              # API routes (not heavily used due to Server Actions)
├── components/
│   ├── admin/            # Components specific to the admin panel
│   ├── layout/           # Header, Footer, Sidebar
│   └── ui/               # Reusable UI components from ShadCN
├── ai/
│   ├── flows/            # Genkit AI flows (e.g., generateBlogContent)
│   └── genkit.ts         # Genkit configuration
├── hooks/
│   └── use-auth.tsx      # Authentication context and guard
├── services/
│   ├── auth.ts           # Firebase auth services
│   ├── blogs.ts          # Firestore services for blogs
│   ├── events.ts         # Firestore services for events
│   ├── members.ts        # Firestore services for members
│   ├── email.ts          # Email service (Nodemailer)
│   ├── storage.ts        # Cloudinary services
│   └── ...               # Other data services
└── lib/
    ├── firebase.ts       # Firebase initialization
    ├── types.ts          # TypeScript type definitions
    └── utils.ts          # Utility functions (e.g., cn for classnames)
```
