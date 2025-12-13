# DevPortfolio

A modern, dynamic portfolio website built with **Next.js 16** and **React 19**, featuring a **Google Sheets Headless CMS** for easy content management.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 16 (App Router) and React 19.
- **Dynamic Content**: Projects, Profile details, and Skills are fetched directly from a Google Sheet.
- **Stunning UI**: styled with **Tailwind CSS 4** and animated with **Framer Motion** (including interactive star backgrounds).
- **Admin Authentication**: Secure admin area to manage content via the Google Sheets integration.
- **Image Optimization**: Images are hosted and optimized via **Cloudinary**.
- **Responsive**: Fully responsive design for all devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **CMS / Database**: [Google Sheets API](https://developers.google.com/sheets/api)
- **Image Hosting**: [Cloudinary](https://cloudinary.com/)
- **Auth**: `jose` (JWT) & `bcryptjs`

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud Platform project with Sheets API enabled
- A Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # Google Sheets API
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email
   GOOGLE_PRIVATE_KEY="your-private-key"
   GOOGLE_SHEET_ID=your-spreadsheet-id

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Authentication
   JWT_SECRET=your-secure-jwt-secret
   ADMIN_PASSWORD=your-admin-password
   ```

4. **Setup Google Sheets**
   - Create a new Google Sheet.
   - Share the sheet with your Service Account Email (Editor access).
   - Run the setup script to initialize the sheet structure and seed data:
     ```bash
     npm run setup:sheets
     ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and API clients (Google Sheets, Cloudinary).
- `scripts/`: Maintenance and setup scripts.
- `types/`: TypeScript type definitions.

## 📄 License

This project is licensed under the MIT License.
