# MasarAcademy

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/masaracademy.git
    cd masaracademy
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Update the values ​​in the `.env` file in the project root and modify the following environment variables as needed:
    ```env
    PORT=3000
    DATABASE_URL=mongodb://127.0.0.1:27017/your_DB
    JWT_SECRET=your_secret_key_for_jwt
    JWT_EXPIRES_IN=7d
    EMAIL_USERNAME=your_email@example.com
    EMAIL_PASSWORD=your_email_password
    ```

### Running the Application

To start the application, run:
```sh
npm start
```

### API Documentation

The server should now be running on the port specified in the .env file. If no port is specified, it defaults to 3000.

### Swagger Documentation

Swagger is integrated with MasarAcademy to provide interactive documentation for the API endpoints. Follow these steps to utilize Swagger:

- **Access Swagger UI**: Open your web browser and navigate to:
    ```swager UI
    http://localhost:3000/api-docs
    ```
- **Explore Endpoints**: Explore the available endpoints, request parameters, request bodies, and responses directly from Swagger UI.

- **Testing Endpoints**: Use Swagger UI to test the endpoints by providing required parameters and request bodies.

- You can interact with the API directly from your browser using Swagger UI.
