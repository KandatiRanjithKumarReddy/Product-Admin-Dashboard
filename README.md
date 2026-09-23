# Product Admin Dashboard

A simple, fast, and responsive web application for viewing, searching, and managing product inventory. Built with React and designed with a clean light blue theme.

---

## 🌟 Features

- **User Authentication**: Log in with demo credentials to access the dashboard.
- **Product Management**: Add new products, update existing product details, or delete items from the catalog.
- **Product Catalog View**: View products in a clear table on desktop screens or responsive cards on mobile devices.
- **Product Details Page**: Click any product to see image galleries, pricing, stock levels, full specifications, and customer reviews.
- **Search & Filtering**: Search products by name, filter by category, and sort by price or customer rating.
- **Simulated Speed Testing**: Test how the app handles network delays with built-in speed options.
- **Clean Light Theme**: A light blue visual design with clear indicators for stock levels and alerts.

---

## 🔑 Login Credentials

You can use the built-in demo credentials to log in:

- **Username**: `emilys`
- **Password**: `emilyspass`

*(A "Fill Credentials" button is also available on the login page for quick testing.)*

---

## 🚀 How to Run the Project Locally

Follow these steps to run the application on your computer:

### 1. Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 2. Start the Development Server
Run the following command to start the app:
```bash
npm run dev
```

### 3. Open in Browser
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🛠️ Built With

- **React**: For building the user interface and components.
- **React Router**: For handling navigation between pages.
- **Axios**: For fetching product data from the API.
- **Lucide React**: For clean, modern UI icons.
- **Custom CSS**: For responsive layout and light blue styling.
- **DummyJSON API**: Free mock API source for product data and user login.

---

## 📂 Project Structure

```text
src/
├── api/          # Functions for communicating with the server
├── components/   # Reusable UI elements (Buttons, Modals, Tables, Navbar)
├── context/      # Shared state for user login and local product changes
├── hooks/        # Helper functions for filters and input handling
├── pages/        # Main application screens (Login, Products, Details, 404)
├── utils/        # Formatting helper functions (currency, stock badges)
├── App.jsx       # Main router setup
└── index.css     # Global styles and color themes
```

---

## 🧪 Building for Production

To create an optimized production build, run:
```bash
npm run build
```
The output files will be created in the `dist` folder.
