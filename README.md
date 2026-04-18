# Restaurant QR Ordering App

Production-ready QR ordering web app inspired by ONEZO POS.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB (Mongoose)
- Real-time: Socket.io

## Project Structure

- `client` - customer menu + admin dashboard
- `server` - REST APIs, socket server, Mongo models, seed script

## Features

- QR table URL flow: `/menu?table=1`
- Category-based customer menu (Pizza, Burgers, Drinks, Desserts)
- Cart with quantity updates, remove, total, and localStorage persistence
- Place order with table number, timestamp, status, and item payload
- Admin dashboard (`/admin`) with live incoming orders
- Status pipeline: `Pending -> Preparing -> Completed`
- Real-time order and status updates via Socket.io
- Mobile-first UI with sticky cart CTA, card layout, animations
- Dark mode support
- Order confirmation screen
- Call waiter from table with real-time admin alert + sound
- Estimated prep time is included in backend order records

## Backend Setup (`server`)

1. Install dependencies:
   - `npm install`
2. Copy env:
   - `cp .env.example .env` (or create `.env` manually on Windows)
3. Set values in `.env`:
   - `PORT=5000`
   - `MONGODB_URI=your_mongodb_connection_string`
   - `CLIENT_URL=http://localhost:5173`
4. Seed products:
   - `npm run seed`
5. Start backend:
   - `npm run dev`

## Frontend Setup (`client`)

1. Install dependencies:
   - `npm install`
2. Copy env:
   - `cp .env.example .env` (or create `.env` manually)
3. Set API URL:
   - `VITE_API_BASE_URL=http://localhost:5000`
4. Start frontend:
   - `npm run dev`

## Root Shortcuts

From project root:

- `npm run dev:server` - start backend
- `npm run dev:client` - start frontend
- `npm run seed` - seed sample products
- `npm run build` - build frontend

## API Endpoints

- `GET /api/products` - fetch menu items
- `POST /api/orders` - create order
- `GET /api/orders` - fetch all orders
- `PUT /api/orders/:id` - update order status
- `POST /api/waiter-calls` - create waiter call
- `GET /api/waiter-calls` - fetch waiter calls
- `PUT /api/waiter-calls/:id/resolve` - resolve waiter call

## Deployment

### Backend on Render

- Set root directory to `server`
- Build command: `npm install`
- Start command: `npm start`
- Add env vars:
  - `PORT`
  - `MONGODB_URI`
  - `CLIENT_URL` (your Vercel URL)

### Frontend on Vercel

- Set root directory to `client`
- Build command: `npm run build`
- Output directory: `dist`
- Add env var:
  - `VITE_API_BASE_URL=https://your-render-backend-url`

## Optional Enhancements

- Razorpay integration is intentionally left as optional to avoid shipping test keys in source.
- You can add payment intent and checkout endpoints under `server/src/routes`.
