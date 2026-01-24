# Sync Social Media Platform

A full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js). It features secure authentication, image uploads, real-time-like interactions, and a responsive design with dark mode support.

## 🚀 Features

* **Authentication:** Secure Login, Registration, and Email OTP Verification.
* **Posts:** Create and delete posts with multiple image uploads (hosted on Cloudinary).
* **Interactions:** Like posts and comment on them.
* **Messageing system** Fully end-end messaging system.
* **Profile Management:** Edit profile details, change profile pictures, and view user activity.
* **Search:** Search for other users and explore content.
* **Theme:** Toggle between Dark and Light mode.
* **Responsive:** Mobile-optimized UI with specific mobile actions.

## 🛠️ Tech Stack

* **Frontend:** React, Redux Toolkit, React Bootstrap, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Services:**
    * **Cloudinary:** Image storage
    * **Nodemailer:** Sending verification emails
    * **Vercel:** Deployment

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` files.

### Server (`server/.env`)

- PORT=3000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret_key
- CLIENT_ORIGIN=http://localhost:5173

#### Cloudinary (Images)
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret

#### Nodemailer (Email)
- EMAIL_SERVICE=gmail
- EMAIL_USER=your_email@gmail.com
- EMAIL_PASS=your_email_app_password

### Client (`client/.env`)

- VITE_SERVER_URL=http://localhost:3000
- VITE_API_URL=http://localhost:3000/api/v1
- VITE_PF=

