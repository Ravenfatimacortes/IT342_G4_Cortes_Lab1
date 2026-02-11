# Authentication System

A secure user authentication system with Web and Mobile applications connecting to the same backend API.

## Features

✅ **Both Web and Mobile connect to the SAME backend API**  
✅ **Backend connects to MySQL database**  
✅ **Passwords are encrypted (bcrypt)**  
✅ **Protected pages are blocked when logged out**  
✅ **Logout clears authentication state**  
✅ **/me endpoint works ONLY when authenticated**  
✅ **All endpoints behave consistently for Web and Mobile**

## Project Structure

```
├── Backend/          # Node.js Express API with MySQL
├── Web/             # React frontend application
├── Mobile/          # Command-line mobile application
└── Docs/            # Project documentation
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up MySQL database:
- Create a database named `auth_db`
- Copy `.env.example` to `.env` and update with your MySQL credentials

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Web Application Setup

1. Navigate to the Web directory:
```bash
cd Web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The web app will run on `http://localhost:5173` (or similar Vite port)

### 3. Mobile Application Setup

1. Navigate to the Mobile directory:
```bash
cd Mobile
```

2. Install dependencies:
```bash
npm install
```

3. Run the mobile app:
```bash
npm start
```

This provides a command-line interface to test the same API endpoints.

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login (returns JWT token)
- `GET /api/profile` - Get user profile (protected)
- `GET /api/me` - Get current user info (protected)

## Security Features

- **Password Encryption**: Uses bcrypt with salt rounds (12)
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Authentication required for profile endpoints
- **Input Validation**: Proper error handling and validation
- **MySQL Integration**: Secure database storage

## Testing

1. Register a new user via Web or Mobile app
2. Login to receive JWT token
3. Access protected endpoints (/api/profile, /api/me)
4. Verify logout clears authentication state
5. Try accessing protected pages without authentication

## Environment Variables

Copy `.env.example` to `.env` in the Backend directory and configure:

- `PORT`: Backend server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT signing
- `DB_HOST`: MySQL host
- `DB_USER`: MySQL username
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: MySQL database name
