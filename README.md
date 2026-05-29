# Pharma 24/7
 
Pharma 24/7 is a comprehensive pharmacy management platform designed for seamless inventory, sales, purchase, and reporting operations. Built with modern web technologies, it supports multi-user roles, real-time stock management, and regulatory compliance, making it ideal for pharmacies of all sizes.
 
---
 
## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Main Modules](#main-modules)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Environment & Configuration](#environment--configuration)
- [Key Features](#key-features)
- [Contributing](#contributing)
- [Contact](#contact)
 
---
 
## Project Overview
Pharma 24/7 streamlines pharmacy operations by integrating inventory, sales, purchase, and reporting into a single, user-friendly platform. It supports role-based access, e-prescriptions, real-time analytics, and is optimized for both single and chain pharmacies.
 
---
 
## Architecture
- **Frontend:** React.js (with Tailwind CSS & MUI for UI)
- **Backend:** Laravel (PHP) [external, not in this repo]

 
The frontend communicates with the backend via RESTful APIs. Authentication tokens are stored in localStorage and attached to all API requests.
 
---
 
## Main Modules
- **Authentication:** Signup, login, OTP, password reset, and role-based access (Owner/Admin, Staff)
- **Dashboard:** Real-time overview of sales, purchases, inventory, and key metrics
- **Inventory Management:** Add/edit/delete items, stock tracking, reorder alerts, barcode support
- **Purchase Management:** Supplier management, purchase bills, returns, and payment tracking
- **Sales Management:** Customer management, sales bills, returns, and prescription handling
- **Order Processing:** Online/offline order management, status tracking, notifications
- **Reports & Analytics:** GST, margin, stock, accounting, and intelligent sales reports (PDF/Excel/CSV export)
- **Profile & Settings:** User profile, password, pharmacy settings, notification preferences
- **Role & Permission Management:** Staff roles, permissions, and activity logs
 
---
 
## Technology Stack
| Layer         | Technology                |
|--------------|---------------------------|
| Frontend     | React.js, Tailwind CSS, MUI|
| Backend      | Laravel (PHP)             |

 
---
 
## Folder Structure
```
Pharma247/
├── public/                # Static assets (images, icons, sample data)
├── src/
│   ├── App.js             # Main app entry, routing
│   ├── componets/         # Reusable UI components (buttons, loaders, popups, auth, permissions)
│   ├── dashboard/         # Main business modules (Inventory, Sales, Purchase, Reports, etc.)
│   ├── OnlineOrders/      # Online order management
│   ├── protected/         # Route protection (Admin, Auth)
│   ├── assets/            # App-specific images
│   ├── theme.js           # MUI/Tailwind theme customization
│   └── index.js           # React entry point
├── package.json           # Project dependencies & scripts
├── tailwind.config.js     # Tailwind CSS config
└── README.md              # Project documentation
```
 
---
 
## Installation & Setup
 
### Prerequisites
- Node.js (LTS recommended)
- npm (comes with Node.js)
- Code editor (e.g., VSCode)
 
### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yogeshShopno/Pharma24-7.git
   cd Pharma24-7
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
   The app will run at [http://localhost:3000](http://localhost:3000) by default.
 
> **Note:** The frontend expects the backend API to be available at `https://testadmin.pharma247.in/api` (see `src/index.js`).
 
---
 
## Environment & Configuration
- **API Endpoint:** Set in `src/index.js` via `axios.defaults.baseURL`.
- **Authentication:** JWT token is stored in `localStorage` and attached to all requests.
- **Environment Variables:** (If needed, create a `.env` file for custom configs.)
 
---
 
## Key Features
- **User Authentication & Role-Based Access**
- **Inventory & Stock Management**
- **Sales & Billing System**
- **Purchase & Supplier Management**
- **Order & Prescription Handling**
- **Reports & Analytics Dashboard**
- **Customer & Vendor Management**
- **Barcode Scanning for Quick Billing**
- **Multi-User & Multi-Store Support**
- **Real-Time Stock Alerts**
- **Accounting Integration**
- **E-Prescription Support**
- **Automatic Tax Calculation (GST, VAT, etc.)**
- **Dark Mode UI**
 
---
 
## Contributing
1. **Fork the repository** and create your feature branch:
   ```sh
   git checkout -b feature/YourFeature
   ```
2. **Commit your changes** with clear messages.
3. **Push to your fork** and submit a pull request.
4. For major changes, open an issue first to discuss your proposal.
 
---
 
## Contact
- **Email:** inquiry@pharma247.in
- **Website:** [Pharma247.in](https://pharma247.in)
- **Twitter:** [@Pharma247](https://twitter.com/Pharma247)
- **Production:** [https://medical.pharma247.in/](https://medical.pharma247.in/)
- **Beta:** [https://pharma24-7.vercel.app/](https://pharma24-7.vercel.app/)
 
---
 
*For any queries, suggestions, or support, feel free to reach out!*