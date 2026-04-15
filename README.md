# 🏎️ GoWheelo - Premium Peer-to-Peer Car Rental Platform

![GoWheelo Banner](https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3)

> The next-generation peer-to-peer car rental ecosystem. Rent premium vehicles locally or monetize your own fleet as a host with our advanced management dashboard.

## ✨ Key Features

* **Premium UI/UX:** A glassmorphism-inspired, high-fidelity user interface built with Tailwind CSS, featuring subtle micro-animations and a custom GSAP high-performance cursor.
* **OTP Email Verification:** Ironclad user authentication powered by NodeMailer. Accounts must verify a timed, auto-expiring 6-digit PIN to ensure high-quality user acquisition.
* **Hybrid Payment Gateway:** A built-in checkout flow simulating a multi-channel payment experience. Includes dynamically generated real-world UPI QR codes (`qrcode.react`), Multi-Currency toggles (USD/INR), and standard card inputs.
* **Smart Availability Engine:** Live collision-detection for booking dates. The system blocks conflicted dates automatically and visualizes calendar availability for users.
* **Owner's Command Center:** A specialized `/owner` portal allowing car hosts to securely upload vehicle details, track active rentals, visualize revenue (soon), and approve/deny pending booking requests.
* **Real-time Notifications:** In-app notification infrastructure (polling/socket-ready) keeping users updated on booking confirmations and message alerts.

## 🛠️ Technology Stack

**Frontend (Client)**
* **React 18** (Vite)
* **Tailwind CSS** (Utility-first styling & Dark Mode adaptation)
* **Framer Motion & GSAP** (For premium animations and custom cursors)
* **React Router DOM** (Client-side routing)
* **Axios** (HTTP Client)

**Backend (Server)**
* **Node.js & Express.js**
* **MongoDB & Mongoose** (Database & ODM)
* **JSON Web Tokens (JWT)** (Stateless Authentication)
* **NodeMailer** (Secure email delivery)
* **Socket.io** (Ready for real-time chat expansion)

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB URI (Local or Atlas)
* Gmail with App Password (for NodeMailer)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gowheelo.git
   cd gowheelo
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=8001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_app_password
   ```
   Start the server:
   ```bash
   npm run server
   ```

3. **Setup the Frontend**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=https://go-wheelo.onrender.com
   VITE_CURRENCY=$
   ```
   Start the client:
   ```bash
   npm run dev
   ```

## 🔐 Security & Operations
* Passwords are irreversibly hashed using **Bcrypt**.
* Uploaded assets (Cars/Avatars) should be handled via Cloudinary/AWS (extendable).
* Passwords and tokens are strictly kept out of VC via robust `gitignore` configs.

## 📄 License
This project is licensed under the MIT License.
