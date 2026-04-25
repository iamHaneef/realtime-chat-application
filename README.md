# REALTIME CHAT APPLICATION

## 🚀 Live Demo
https://chat-cafe.netlify.app

---

## 📸 Screenshots

### 🔐 Authentication
![Register](./public/screenshots/register.jpeg)
![Login](./public/screenshots/login.jpeg)

### 💬 Chat Interface
![Sender](./public/screenshots/chat-sender.png)
![Receiver](./public/screenshots/chat-receiver.jpeg)

### 👥 User Search
![Search](./public/screenshots/user-search.jpeg)

---

## ⚡ Features

- Secure user authentication (register/login)
- Real-time messaging using WebSockets
- User search and conversation selection
- Support for emojis and media messages
- Instant UI updates without page reload

---

## 🛠️ Tech Stack

Frontend:
- React.js
- CSS / SCSS

Backend:
- Node.js
- Express.js

Realtime:
- Socket.io

Database:
- MongoDB

---


## ⚙️ How to Run

# Clone repo
git clone <repo-url>

# Install dependencies
npm install

# Run frontend
npm start

# Run backend
npm run server

---

## 📂 Project Structure

```
realtime-chat-application/
├── client/                   # Frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── contexts/         # Context API
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   ├── App.jsx           # Main application
│   │   ├── index.js          # Entry point
│   │   └── ...
│   └── package.json
├── server/                   # Backend application
│   ├── controllers/          # Request handlers
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── server.js             # Server entry point
│   └── ...
├── .env.example              # Environment variables
├── README.md                 # Project documentation
└── screenshots/              # Screenshots
    ├── login.png
    ├── register.png
    ├── chat-sender.png
    ├── chat-receiver.png
    └── user-search.png
```