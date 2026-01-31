# **Full-Stack Task Management Application**

A professional **Full-Stack** application built to demonstrate proficiency in **React**, **Node.js**, **Express**, and **MySQL**. This project features a secure **JWT-based Authentication** system and a complete **CRUD** workflow for task management.

---

## **Key Features**

- **Secure Authentication**: Includes **Signup** and **Login** functionality with **JSON Web Tokens (JWT)** for session management and **Bcrypt** for password hashing.
- **Full CRUD Workflow**:
  - **Create**: Add tasks with a **Title** and **Description**.
  - **Read**: Real-time display of tasks fetched from a **MySQL** database.
  - **Update**: Toggle task status between **Pending** and **Completed**.
  - **Delete**: Remove tasks permanently from the database.
- **Dynamic Filtering**: High-performance filtering system to sort tasks by **All**, **Pending**, or **Completed** status.
- **Responsive Design**: A clean, modern UI built with **Tailwind CSS**, optimized for all screen sizes.

---

## **Tech Stack**

| Layer        | Technology                                |
| :----------- | :---------------------------------------- |
| **Frontend** | **React.js**, **Tailwind CSS**, **Axios** |
| **Backend**  | **Node.js**, **Express.js**               |
| **Database** | **MySQL** (Relational)                    |
| **Security** | **JWT**, **Bcryptjs**                     |

---

## **Setup Instructions**

### **1. Database Configuration**

Ensure you have **MySQL** installed. Open **MySQL Workbench** and execute the following script to initialize the tables:

```sql
-- Create Database
CREATE DATABASE task_db;
USE task_db;

-- Create Users Table for Authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Tasks Table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
2. Backend Setup
Navigate to the /backend directory.

Install required packages:

Bash
npm install
Configure db.js with your MySQL credentials.

Start the server:

Bash
node server.js
The server will run on http://localhost:5000.

3. Frontend Setup
Navigate to the /frontend directory.

Install dependencies:

Bash
npm install
Launch the development server:

Bash
npm run dev
The app will be available at http://localhost:5173.

 Project Structure
Plaintext
├── backend/
│   ├── server.js      # Express API & JWT Logic
│   ├── db.js          # MySQL Connection Pool
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── services/  # API Axios calls
│   │   └── App.jsx    # Main UI & Logic
│   └── package.json
└── README.md          # Documentation
```
