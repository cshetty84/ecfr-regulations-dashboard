# Environment Setup Instructions

1. Install Node.js and npm if not already installed: https://nodejs.org/en/
2. Backend Setup:
   - Navigate to backend folder.
   - Run `npm install` to install dependencies.
   - Start server: `node server.js`
   - The backend should now be running at:
http://localhost:3001
3. Frontend Setup:
   - Navigate to frontend folder.
   - Run `npm install` to install dependencies.
   - Start frontend: `npm run dev` (for Vite) or `npm start` (for React-scripts).
   - The frontend should now be available at:
      http://localhost:5173 (Vite default)
      or
      http://localhost:3000 (React-scripts default)
4. Fetch eCFR Data
   -Use the "Fetch eCFR Data" button in the UI to fetch data.
   - Alternatively, you can hit the backend directly:
GET http://localhost:3001/api/fetch-ecfr
