# 💰 Expense Tracker App (MERN Stack)

A modern and user-friendly Expense & Income Tracking application built using the **MERN Stack** (MongoDB, Express, React, Node.js). It allows users to track day-to-day financial transactions categorized by type, view summaries, and gain insights through charts — all in a clean and responsive interface.

---

## ✨ Features

- ✅ Add both **income** and **expense** transactions  
- 📅 Select transaction date via **calendar**  
- 🗃️ Use predefined or **custom categories**  
- 🔄 **Edit** or **delete** transactions  
- 🧮 View **daily** entries and **monthly summaries**  
- 📊 See **category-wise monthly expense charts**  
- 🧱 Responsive layout: Calendar, Form, Lists & Charts  
- 🦾 Clean dashboard UI with header and footer  
- 🔐 Login/Register authentication with token-based access  

---

## 🛠 Tech Stack

| Tech             | Description                        |
|------------------|------------------------------------|
| React            | Frontend framework                 |
| Node.js          | JavaScript runtime                 |
| Express.js       | Backend framework                  |
| MongoDB          | NoSQL database                     |
| Axios            | HTTP requests                      |
| Recharts         | Chart rendering                    |
| React Calendar   | Calendar component                 |
| React Router DOM | Routing between pages              |
| Bcrypt + JWT     | Secure authentication              |
| CSS Flexbox/Grid | Layout styling                     |

---

## 📁 Folder Structure

```
Expense-Tracker/
├── expense-tracker-backend/             # Node + Express Backend
│   ├── controllers/
│   │   └── authControllers.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── Expense.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── expenses.js
│   ├── server.js
│   └── .env
│
│
├── expense-tracker-frontend/            # React Frontend
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── api.js
│       ├── components/
│       │   ├── CalendarSelector.js
│       │   ├── ExpenseForm.js
│       │   ├── ExpenseList.js
│       │   ├── IncomeList.js
│       │   └── ExpenseChart.js
│       ├── pages/
│       │   ├── Dashboard.js
│       │   ├── Landing.js
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Landing.css
│       │   ├── Login.css
│       │   └── Register.css
│       ├── App.js
│       └── App.css
│
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js & npm
- MongoDB Atlas or Local MongoDB

---

### 📥 Clone the Repository

```bash
git clone https://github.com/nakulpatel18/Expense-Tracker.git
cd expense-tracker
```

---

### ⚙️ Backend Setup

```bash
cd expense-tracker-backend
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
```

Create a `.env` file in the `expense-tracker-backend` directory:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
```

Start the backend server:

```bash
npm start
```

---

### 🎨 Frontend Setup

```bash
cd expense-tracker-frontend
npm install react-router-dom axios react-icons react-calendar recharts
npm start
```

Frontend runs at `http://localhost:3000`  
Backend runs at `http://localhost:5000`

---

🧑‍💻 Usage Instructions

- Start both **backend** and **frontend** servers.
- Open the app at `/` to explore the **Landing Page** features.
- Click on the **Register** link to create a new account.
- Log in using your registered **email** and **password**.

### On the Dashboard:

- 📅 Use the **calendar** to select a specific date.
- 📝 Fill out the **form** to add an income or expense entry.
- 🗃️ Choose a category or enter a **custom category**.
- 📆 View **daily transactions** filtered by the selected date.
- 📈 See **monthly summaries** for income and expenses.
- ✏️ Use the **Edit** button to update a transaction.
- ❌ Use the **Delete** button to remove a transaction.
- 📊 Analyze your spending using the **monthly expense bar chart**.



## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint             | Description           |
|--------|----------------------|-----------------------|
| POST   | /api/auth/register   | Register a new user   |
| POST   | /api/auth/login      | Login and get token   |

### 💵 Expense/Income

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /api/expenses         | Fetch all transactions   |
| POST   | /api/expenses         | Add a new transaction    |
| PUT    | /api/expenses/:id     | Update a transaction     |
| DELETE | /api/expenses/:id     | Delete a transaction     |

