# 🍽️ Savora

### Smart Dining. Simplified.

Savora is a modern cloud-based Restaurant Management System (RMS) designed to simplify and digitize restaurant operations. It provides restaurant owners and staff with an intuitive platform to manage menus, orders, billing, inventory, employees, reservations, analytics, and customer data—all from a single dashboard.

Built with scalability in mind, Savora supports role-based access, allowing Owners, Managers, Chefs, Cashiers, and Waiters to securely access features relevant to their responsibilities.

---

## ✨ Features

### 🔐 Authentication & User Management
- Secure Email Authentication
- Role-Based Access Control (Owner, Manager, Chef, Cashier, Waiter)
- Staff Invitation via Email
- Restaurant Owner Onboarding

### 🏢 Restaurant Management
- Create and manage restaurant profile
- Restaurant logo & business information
- Indian localization (INR, GST, UPI support)

### 🍴 Menu Management
- Add, edit and delete menu items
- Categorize dishes
- Upload food images
- Mark items as available/unavailable
- Search & filter menu

### 🧾 Point of Sale (POS)
- Create customer orders
- Table-wise billing
- Split bills
- Discount & GST calculation
- Multiple payment methods

### 🍽️ Table Management
- Interactive restaurant floor map
- Live table status
- Table reservations
- Occupancy management

### 👨‍🍳 Kitchen Display System (KDS)
- Live kitchen orders
- Order preparation tracking
- Ready & completed order management

### 📦 Inventory Management
- Ingredient tracking
- Low-stock alerts
- Supplier management
- AI-assisted inventory generation from menu

### 👥 Employee Management
- Invite staff members
- Assign roles & permissions
- Manage employee profiles

### 📊 Analytics & Reports
- Daily revenue
- Sales trends
- Best-selling dishes
- Customer insights
- Peak business hours
- Downloadable reports

### 🤖 AI Insights (Planned)
- Sales forecasting
- Inventory recommendations
- Business insights
- Smart menu suggestions

### 👤 Customer Management
- Customer database
- Visit history
- Loyalty tracking

### 📅 Reservation Management
- Table reservations
- Booking calendar
- Reservation status tracking

### ⚙️ Settings
- Restaurant information
- Theme preferences
- Tax configuration
- Receipt customization

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Context API

### Backend
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

### UI & Design
- Lucide React Icons
- Framer Motion
- Recharts
- Shadcn/UI

---

## 📂 Project Structure

```
src
│
├── assets/
├── components/
├── context/
├── layouts/
├── pages/
├── services/
├── hooks/
├── types/
├── utils/
├── firebase.ts
├── App.tsx
└── main.tsx
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/<your-username>/Savora.git
```

### Navigate to the Project

```bash
cd Savora
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## 📌 Current Status

🚧 This project is currently under active development.

Upcoming features include:

- QR Code Ordering
- AI-powered Inventory Generation
- Multi-branch Restaurant Support
- Customer Mobile Ordering
- Notification System
- Cloud Reports
- Advanced Analytics
- Receipt Printing
- Offline Support

---

## 🎯 Project Goals

Savora aims to provide restaurants with a centralized platform to:

- Improve operational efficiency
- Simplify billing & order management
- Reduce inventory wastage
- Enhance customer experience
- Provide actionable business insights
- Digitize restaurant workflows

---

## 🌏 Localization

Designed specifically for Indian restaurants:

- 🇮🇳 Indian Rupee (₹)
- GST Support
- UPI Payments
- DD/MM/YYYY Date Format
- 24-Hour Time Format

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
---

## 📖 License

This project is developed for educational and portfolio purposes.

---

## 👨‍💻 Author

**Likhitha**

Made with ❤️ using React, TypeScript & Firebase.
