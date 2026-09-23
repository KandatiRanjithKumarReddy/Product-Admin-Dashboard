# Product Admin Dashboard

A simple, fast website for viewing, searching, and managing products. Built with React and custom styling in a light blue theme.

---

## 📌 Project Overview

### What It Is
**Product Admin Dashboard** is a web app where store managers can easily keep track of their products, stock levels, and prices.

### What It Does
This dashboard lets you handle your product list with ease:
- View all your products in a table on desktop or cards on mobile phones.
- Search for products by name and filter them by category.
- Sort products by price, rating, or name.
- Click any product to see photos, details, specs, and customer reviews.
- Easily add new products, edit details, or delete items.

### What Problem It Solves
Managing inventory can often be slow, confusing, or hard to use on phones. This app makes it simple:
- **Instant Search**: Finds products quickly as you type without slowing down the site.
- **Works on Any Screen**: Automatically fits large desktop screens as well as small phone screens.
- **Easy Product Updates**: Simple pop-up screens let you add, edit, or delete items in seconds.

---

## ✅ Completed Features Checklist

- [x] **User Sign-In**
  - [x] Login page with username and password checking.
  - [x] Remembers when you are logged in so you don't have to sign in every time.
  - [x] Automatically sends users to the login screen if they are not signed in.
  - [x] One-click "Fill Credentials" button for easy testing.
  - [x] Working Logout button that signs you out safely.

- [x] **Product Views**
  - [x] Clean table view for computer screens (shows pictures, titles, categories, prices, ratings, and stock).
  - [x] Friendly card view for mobile phones.
  - [x] Page numbers with options to show 10, 20, or 50 items per page.
  - [x] Smooth loading placeholders while product data is loading.

- [x] **Search, Filter & Sort**
  - [x] Smart search bar (waits until you finish typing before searching).
  - [x] Category dropdown menu to filter products by category.
  - [x] Works smoothly when searching and filtering at the same time.
  - [x] Sort products by price (low to high, high to low), rating, or name (A-Z, Z-A).
  - [x] Test option to simulate slow internet connections (1s, 2s, 3s delay).

- [x] **Adding, Editing & Deleting Items**
  - [x] Pop-up form to add new products.
  - [x] Pop-up form to edit existing products with saved info pre-filled.
  - [x] Confirmation pop-up before deleting a product so nothing is deleted by mistake.
  - [x] Remembers your changes immediately while browsing.

- [x] **Product Details Page**
  - [x] Separate product details page with a Back button.
  - [x] Clickable photo gallery to view product images.
  - [x] Clear stock status labels (*In Stock*, *Low Stock*, *Out of Stock*).
  - [x] Full list of details (product code, size, weight, warranty, shipping, and returns).
  - [x] Customer reviews section with ratings and dates.
  - [x] Friendly "Page Not Found" message if a product ID doesn't exist.

- [x] **Design & Interface**
  - [x] Clean light blue color theme throughout the app.
  - [x] Pop-up message alerts when actions succeed or fail.
  - [x] Simple, easy-to-read code comments throughout the project.

---

## 📂 Project Folder Structure

```text
Product-Admin-Dashboard/
├── src/
│   ├── api/                  # Code for sending and getting data from the web server
│   ├── components/
│   │   ├── common/           # Reusable parts like buttons, labels, pop-ups, and navbar
│   │   ├── layout/           # Page layouts and login protection
│   │   └── products/         # Product tables, cards, search filters, and forms
│   ├── context/              # Code for keeping track of user login and changes
│   ├── hooks/                # Helper functions for search delays and page filters
│   ├── pages/                # Main web pages (Login, Products list, Details, 404)
│   ├── utils/                # Helper code for formatting money and stock badges
│   ├── App.jsx               # Main routing setup connecting all pages
│   ├── main.jsx              # Starts the React application
│   └── index.css             # Light blue theme styles and page colors
├── index.html                # Web page layout file
├── package.json              # List of tools and packages used in the project
└── README.md                 # Project guide
```

---

## ⚡ Quick Setup & How to Run

Follow these simple steps to run the application on your computer:

### 1. Install Dependencies
Open your terminal in the project folder and type:
```bash
npm install
```

### 2. Start the App
Run this command to start the app:
```bash
npm run dev
```

### 3. Open in Browser
Open your internet browser and go to:
```text
http://localhost:5173
```

### 🔑 Demo Login Details
Use these details to sign in (or click the **Fill Credentials** button on the login screen):
- **Username:** `emilys`
- **Password:** `emilyspass`

---

