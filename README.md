# Full-Stack E-Commerce Platform

A production-ready full-stack e-commerce application built using Spring Boot, React, and MySQL, featuring OTP-based authentication, role-based access (Admin, Seller, Customer), real payment integration, and complete order lifecycle management.

## 🔗 Live Demo & Source Code

- 🌐 Frontend Live Demo: https://anjali-cart.netlify.app/
- ⚙️ Backend API: https://anjalicart-backend.onrender.com/
- 📦 GitHub Repository: https://github.com/anjalivs1176/AnjaliCartEcommerce

## 🛠️ Tech Stack

**Frontend**
- React
- Redux
- Material UI
- Tailwind CSS

**Backend**
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- REST APIs

**Database**
- MySQL

**Payments**
- Razorpay

**Tools & Platforms**
- Git & GitHub
- Postman
- Maven
- Render / Netlify

## ✨ Key Features

### 🔐 Authentication & Security
- OTP-based login and signup
- JWT authentication with role-based authorization
- Secure API access using Spring Security

### 🛍️ Customer Features
- Browse products with filters and pagination
- Wishlist and cart management
- Apply coupons and view dynamic pricing
- Secure checkout with Razorpay payment integration
- Order history and order tracking

### 🧑‍💼 Seller Features
- Seller onboarding and authentication
- Product management (add, update, delete products)
- View and process customer orders
- Seller dashboard with sales overview

### 🛠️ Admin Features
- Manage sellers and platform users
- Create and manage coupons
- Configure homepage categories and deals
- Monitor overall platform activity

## 📸 Screenshots

### Customer Panel
- Home Page
- Product Listing with Filters
- Product Details Page
- Cart & Checkout
- Order Tracking

### Seller Panel
- Seller Dashboard
- Product Management
- Order Processing

### Admin Panel
- Seller Management
- Coupon Management
- Homepage Configuration

![Home Page]  <img width="1366" height="768" alt="homepage1" src="https://github.com/user-attachments/assets/3b871ca5-1bc0-4c00-962a-a011f8760f4b" />
              <img width="1366" height="768" alt="homepage2" src="https://github.com/user-attachments/assets/de6c6193-684d-49e7-b70f-4881fe2e8b1e" />
              <img width="1366" height="768" alt="homepage3" src="https://github.com/user-attachments/assets/126f7ec3-3156-44b3-967f-3cdcad80d22c" />
              <img width="1366" height="768" alt="homepage4" src="https://github.com/user-attachments/assets/68e3d987-0ded-4bfe-b115-a288b27b4991" />






## 🏗️ Application Architecture

- Frontend built using React communicates with backend via REST APIs
- Backend developed with Spring Boot follows layered architecture (Controller, Service, Repository)
- MySQL used for persistent storage
- JWT tokens used for authentication and authorization
- Role-based access enforced at API level using Spring Security

## 🚧 Challenges Faced & Solutions

- Handled foreign key constraint issues while deleting related entities by redesigning entity relationships
- Fixed authentication and authorization mismatches in JWT handling
- Resolved CORS issues during frontend-backend deployment
- Ensured transactional consistency using @Transactional where required
- Debugged OTP flow edge cases for login vs signup scenarios

## ▶️ Run Locally

### Backend
1. Clone the repository
2. Configure MySQL database credentials
3. Run the Spring Boot application

### Frontend
1. Navigate to frontend folder
2. Install dependencies using `npm install`
3. Start the app using `npm start`

## 🚀 Future Enhancements

- Add product recommendations
- Improve analytics dashboards
- Enhance UI performance and accessibility

  ## 🙌 Acknowledgements

This project was built to gain real-world full-stack experience and to understand production-level challenges in building scalable applications.



