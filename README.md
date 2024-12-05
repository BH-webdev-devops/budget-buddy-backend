# BudgetBuddy Backend

The backend of **BudgetBuddy**, a powerful application to track and manage your expenses. BudgetBuddy offers visual insights, detailed tracking, and collaborative features to make budgeting easier and more intuitive.

## Features

- **Store Expenses**: Securely save your expense data in the database.
- **Visual Insights**: View your spending breakdown in a pie chart.
  - Click on a pie slice to see detailed information about spending in a specific category.
- **Email Summaries**: Receive detailed summaries of your expenses via email.
- **Export Data**: Download your spending data in CSV format.
- **Custom Date Filters**: Select specific date ranges to analyze your expenses.
- **Collaborative Splitting**: Split expenses with other users to track shared spending.

---

## Technologies Used

### Core Backend Technologies
- **Node.js**: JavaScript runtime for building scalable server applications.
- **TypeScript**: Strongly typed superset of JavaScript for safer and cleaner code.
- **Express.js**: Minimalist web framework for building APIs.
- **PostgreSQL**: Relational database for storing user and expense data.
- **Redis**: In-memory data store for caching and session management.

### Other Libraries and Tools
- **bcryptjs**: For secure password hashing.
- **cors**: To enable secure cross-origin resource sharing.
- **dotenv**: For managing environment variables.
- **jsonwebtoken**: For authentication using JSON Web Tokens (JWT).
- **nodemailer**: To send email reports to users.
- **json2csv**: For exporting data to CSV format.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/budget-buddy-backend.git
   cd budget-buddy-backend
   ```
