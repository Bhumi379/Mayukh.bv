# MongoDB & Authentication Setup Guide

## Prerequisites
- Node.js (v14+) and npm installed
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas)

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and sign in
3. Create a new cluster (free tier available)
4. Go to Database Access → Create a Database User
   - Username: `mayukh_user`
   - Password: Generate a secure password
5. Go to Network Access → Whitelist your IP
   - Click "Allow Access from Anywhere" for development (change for production)
6. Go to Databases → Connect → Copy your connection string
   - Should look like: `mongodb+srv://username:password@cluster.mongodb.net/mayukh?retryWrites=true&w=majority`

## Step 2: Configure Backend

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://mayukh_user:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/mayukh?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   
   You should see: `MongoDB connected successfully` and `Server running on port 5000`

## Step 3: Use Authentication in Frontend

Add the following to your HTML login/signup forms:

### Example Login Form:
```html
<form id="loginForm">
  <input type="email" id="email" placeholder="Email" required />
  <input type="password" id="password" placeholder="Password" required />
  <button type="submit">Login</button>
</form>

<script src="auth.js"></script>
<script>
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await login(email, password);
    
    if (result.success) {
      alert('Login successful! Welcome ' + result.data.user.name);
      // Redirect to dashboard or protected page
    } else {
      alert('Login failed: ' + result.error);
    }
  });
</script>
```

### Example Signup Form:
```html
<form id="signupForm">
  <input type="text" id="name" placeholder="Full Name" required />
  <input type="email" id="email" placeholder="Email" required />
  <input type="password" id="password" placeholder="Password" required />
  <button type="submit">Sign Up</button>
</form>

<script src="auth.js"></script>
<script>
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await signup(name, email, password);
    
    if (result.success) {
      alert('Signup successful! Welcome ' + result.data.user.name);
      // Redirect to dashboard
    } else {
      alert('Signup failed: ' + result.error);
    }
  });
</script>
```

## API Endpoints

### POST /api/auth/signup
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### GET /api/auth/profile
Get current user profile (requires token)

## Frontend Helper Functions

```javascript
// Sign up
await signup(name, email, password);

// Login
await login(email, password);

// Logout
logout();

// Check if logged in
isLoggedIn();

// Get current user
getCurrentUser();

// Get user profile
await getProfile();
```

## Project Structure
```
mayukh.bv/
├── index.html (your frontend)
├── auth.js (frontend authentication helper)
├── server/
│   ├── package.json
│   ├── server.js (main server file)
│   ├── .env (configuration)
│   ├── models/
│   │   └── User.js (MongoDB user schema)
│   ├── routes/
│   │   └── auth.js (authentication endpoints)
│   └── middleware/
│       └── auth.js (JWT authentication)
```

## Important Security Notes

1. **HTTPS Only**: Use HTTPS in production
2. **JWT_SECRET**: Change the JWT_SECRET to a strong random string
3. **CORS**: Update CORS settings for your production domain
4. **Password**: Never commit your MongoDB credentials - keep .env safe
5. **Environment Variables**: Use environment variables for all sensitive data

## Troubleshooting

- **MongoDB connection error**: Check your connection string and whitelist your IP
- **CORS error**: Make sure the frontend is calling `http://localhost:5000`
- **Token invalid**: Tokens expire in 7 days, user needs to login again
- **Email already exists**: User with that email already has an account

## Next Steps

- Add email verification
- Implement password reset
- Add user profile update endpoint
- Implement refresh token mechanism
- Add rate limiting for authentication endpoints
