# TrendWise Backend

The backend of TrendWise is a Node.js and Express application that provides RESTful APIs for managing articles, user authentication, and content generation using AI models.

## Features

- MongoDB database with Mongoose ODM
- User authentication with NextAuth.js (Google OAuth and Credentials)
- AI-powered content generation using Google Gemini or OpenAI
- REST API endpoints for articles and user management
- Secure and scalable architecture

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- NextAuth.js for authentication
- Google Gemini / OpenAI for AI content generation

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**
    ```
    git clone <backend-repo-url>
    cd trendwise-backend
    ```
2. **Install dependencies**
    ```
    npm install
    ```
3. **Create a `.env` file in the root with the following variables:**
    ```
    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_google_gemini_api_key
    OPENAI_API_KEY=your_openai_api_key (optional)
    NEXTAUTH_SECRET=your_nextauth_secret
    ```
4. **Run the development server**
    ```
    npm run dev
    ```
5. **The API will be available at [http://localhost:5000](http://localhost:5000)**

## Project Structure

- `models/` - Mongoose models
- `routes/` - Express routes
- `services/` - Business logic and AI content generation
- `controllers/` - Request handlers (if used)
- `middlewares/` - Express middlewares
- `server.js` - Entry point

## Authentication

Uses NextAuth.js with Google OAuth and Credentials provider for email/password.

## Deployment

Deployed on any Render.
