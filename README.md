# BudgetBuddy Backend

The backend of **BudgetBuddy**, a powerful application to track and manage your expenses. BudgetBuddy offers visual insights, detailed tracking, and collaborative features to make budgeting easier and more intuitive.

## Features

- **Store Expenses**: Securely save your expense data in the database.
- **Manage Your Spendings**: Easily add, update, or delete your spending records.
- **Visual Insights**: View your spending breakdown in a pie chart.
  - Click on a pie slice to see detailed information about spending in a specific category.
- **Email Summaries**: Receive detailed summaries of your expenses via email.
- **Export Data**: Download your spending data in CSV format.
- **Custom Date Filters**: Select specific date ranges to analyze your expenses.
- **Collaborative Splitting**: Split expenses with other users to track shared spending.
- **Access Financial Advice**: Watch helpful financial advice videos to improve your budgeting skills.

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
   git clone https://github.com/BH-webdev-devops/budget-buddy-backend.git
   cd budget-buddy-backend
   ```
2. Install dependencies
    ```bash
    npm install --legacy-peer-deps

    ```

3. Start the Redis server
    ```bash
    redis-server
    ```

4. Run the backend server
    ```bash
    npm start
    ```
5. Access the application at:
    ```ardunio
    http://localhost:3000/
    ```

## Deployment

The backend is deployed and accessible at:
[https://budget-buddy-backend-630243095989.europe-west1.run.app](https://budget-buddy-backend-630243095989.europe-west1.run.app)

---

## Environment Variables

Set the following environment variables in a `.env` file:

```plaintext
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=
DB_TYPE=
DB_USER=
GCP_REGION=
GCP_SA_KEY=
GOOGLE_APP_PASSWORD= # the youtube API key
JWT_SECRET=
PROJECT_ID=
REDIS_HOST=
REDIS_PASSWORD=
REDIS_PORT=
SENDER_EMAIL=
```

## Contribution Guidelines

1. Fork the repository and create a new branch for your feature or bug fix.
2. Ensure your code is clean and adheres to the project's coding standards.
3. Submit a pull request with a detailed explanation of your changes.

---

## License

This project is licensed under the **ISC License**.

---

## Support

If you encounter any issues or have questions, feel free to [open an issue](https://github.com/BH-webdev-devops/budget-buddy-backend/issues) or contact the project maintainers.


