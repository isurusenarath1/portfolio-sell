# Full-Stack Portfolio Application

This is a comprehensive full-stack portfolio application built with a Next.js frontend and a Node.js/Express.js backend. It features a dynamic public-facing portfolio and a full-featured admin panel for easy content management, along with modern UI effects to provide a premium user experience.

## Key Features

### Admin Panel
- **Secure Authentication:** Protects admin routes and functionality.
- **Contact Message Management:**
  - View, filter, and manage messages from the public contact form.
  - Update message status (read/unread).
  - Get quick statistics on message counts.
- **Global Site Settings:**
  - Customize the website title, favicon, and text-based logo.
  - Update contact information (email, phone, address).
  - Manage social media links (GitHub, LinkedIn).
- **CV Management:** Easily update the portfolio's "My CV" link by providing a shareable URL (e.g., from Google Drive).

### Public Portfolio
- **Dynamic Content:** All portfolio content, including personal information and links, is fetched dynamically from the backend and updated instantly from the admin panel.
- **Functional Contact Form:** Allows visitors to send messages directly to the admin.
- **CV Download:** A "My CV" button that links to the URL provided in the admin settings, which is disabled if no URL is present.

### Advanced UI/UX Enhancements
- **Interactive Animated Background:** A stunning animated gradient background with large, blurred spheres that react to mouse movement with a parallax effect.
- **Cursor "Comet" Effect:** A sleek trailing effect that follows the user's cursor.
- **3D Hero Image:** A 3D tilt effect on the main profile image that responds to mouse position, creating a floating illusion.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend:** Node.js, Express.js, TypeScript, Mongoose
- **Database:** MongoDB
- **Image & File Hosting:** Cloudinary

## Getting Started

### Prerequisites
- Node.js and npm/pnpm/yarn
- MongoDB instance (local or cloud)
- A Cloudinary account for image hosting

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd portfolio-sell
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    ```
    - Create a `.env` file in the `backend` directory and add the following variables:
      ```
      MONGO_URI=your_mongodb_connection_string
      PORT=your_preferred_port (e.g., 5000)
      CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
      CLOUDINARY_API_KEY=your_cloudinary_api_key
      CLOUDINARY_API_SECRET=your_cloudinary_api_secret
      ```

3.  **Setup Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
    - Create a `.env.local` file in the `frontend` directory and add the backend API URL:
      ```
      NEXT_PUBLIC_API_URL=http://localhost:5000/api 
      ```
      *(Adjust the port if you used a different one for the backend)*


### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the Frontend Development Server:**
    ```bash
    cd frontend
    npm run dev
    ```

The application should now be running, with the frontend accessible at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Folder Structure

```
.
├── backend/         # Node.js/Express.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   └── ...
└── frontend/        # Next.js Frontend
    ├── app/         # App Router
    │   ├── (admin)/ # Admin Panel routes
    │   └── page.tsx # Public portfolio page
    ├── components/  # Reusable React components
    ├── public/      # Static assets
    └── ...
```