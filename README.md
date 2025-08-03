git clone https://github.com/Jibin258/fullstack-movie-app.git

cd fullstack-movie-app

Frontend Setup (Client):
  cd client
  Install Dependencies: npm install
  Run the client side: npm run dev

Backend Setup (Server):
  cd server
  Install Dependencies: npm install
  Create .env File:
    PORT=5000 (Server running Port)
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME" (Replace USER, PASSWORD, HOST, PORT, and DATABASE_NAME with your actual PostgreSQL credentials.)
    JWT_SECRET=your_jwt_secret

Database Setup:
  Generate the Prisma client: npx prisma generate
  If it's the first time, also run the migration: npx prisma migrate dev --name init
  Run the server side: npx nodemon src/server.ts
