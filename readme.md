```markdown
# Stock Management System (Gesstock)

## Overview

Gesstock is a Stock Management System designed to efficiently manage purchasing, selling, and tracking of inventory quantities. This application utilizes modern web technologies to provide a seamless and interactive user experience.

## Features

- **Purchase Management**: Add and track stock purchases.
- **Sales Management**: Process and monitor sales orders.
- **Inventory Tracking**: Real-time updates on stock levels and quantities.
- **User-Friendly Interface**: Built with React and Vite for a dynamic frontend.

## Technologies Used

- **Frontend**: 
  - React
  - Vite

- **Backend**: 
  - Express.js
  - Prisma

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nassimrahari/gesstock.git
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd gesstock/frontend
   ```

3. **Install frontend dependencies:**
   ```bash
   npm install
   ```

4. **Run the frontend development server:**
   ```bash
   npm run dev
   ```

5. **Navigate to the backend directory:**
   ```bash
   cd ../backend
   ```

6. **Install backend dependencies:**
   ```bash
   npm install
   ```

7. **Set up the database:**
   - Configure your database connection in the `.env` file (create one if it doesn’t exist).
   - Make sure to follow Prisma setup instructions to initialize your database.

8. **Run the backend server:**
   ```bash
   npm start
   ```

## Usage

- Access the application through your web browser at `http://localhost:3000` for the frontend.
- The backend API will typically run on `http://localhost:5000` (or the specified port).
- Use the provided functionalities to manage your stock effectively.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests with your suggestions and improvements.

## License

This project is licensed under the MIT License.

## Contact

For questions or inquiries, please reach out:
- **Name**: Nassim Rahari
- **GitHub**: [nassimrahari]
```