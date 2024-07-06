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

3. Create a `.env` file in the root of the project and add the following environment variables. Update the values as needed:
    ```env
    PORT=3000
    DATABASE_URL=mongodb://127.0.0.1:27017/MasarAcademy
    JWT_SECRET=my_secret_key_for_jwt_and_ultra_long_secret
    JWT_EXPIRES_IN=7d
    EMAIL_USERNAME=your_email@example.com
    EMAIL_PASSWORD=your_email_password
    ```

### Running the Application

To start the application, run:
```sh
npm start
