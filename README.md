# Locatra

Locatra is a full-stack web application for location-based routing and autosuggest using Mappls APIs. It features user authentication (including Google OAuth), address autosuggest, geocoding, and route visualization on a map.

## Project Structure

```
client/      # React frontend (Vite)
server/      # Node.js/Express backend
```

### Client

- React (Vite)
- Google OAuth login
- Mappls map integration
- Autosuggest and route display

### Server

- Express.js REST API
- MongoDB (via Mongoose)
- JWT authentication
- Mappls API integration

## Setup

### Prerequisites

- Node.js
- MongoDB
- Mappls API keys
- Google OAuth client ID

### Environment Variables

Create `.env` files in both `client/` and `server/` directories.

#### Example server/.env

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
MAPPLS_CLIENT_ID=your_mappls_client_id
MAPPLS_CLIENT_SECRET=your_mappls_client_secret
MAPPLS_STATIC_KEY=your_mappls_static_key
CLIENT_URL=http://localhost:5173
SERVER_PORT=5000
```

#### Example client/.env

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MAPPLS_REST_KEY=your_mappls_rest_key
```

## Running Locatra

### Backend

```sh
cd server
npm install
npm run dev
```

### Frontend

```sh
cd client
npm install
npm run dev
```

## Features

- User signup/login (email/password & Google OAuth)
- Address autosuggest
- Geocoding to eLoc
- Route calculation and map display

## License

MIT
