# Where Tonight - Frontend

React-based frontend for the "Where Tonight" group restaurant voting application.

## Features

- 🎯 Create voting sessions with unique codes
- 👥 Join sessions and invite friends
- 🍽️ Vote yes/no on restaurants from Google Places
- 📊 View real-time voting results
- 💻 Clean, responsive UI

## Tech Stack

- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS** - Styling

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` if needed:
```
REACT_APP_API_URL=http://localhost:8000/api
```

### Running the App

Development mode:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── public/              # Static assets
│   ├── index.html      # HTML template
│   └── index.css       # Global styles
├── src/
│   ├── components/     # Reusable components
│   │   └── RestaurantCard.js
│   ├── pages/          # Page components
│   │   ├── Home.js
│   │   ├── CreateSession.js
│   │   ├── JoinSession.js
│   │   └── VotingPage.js
│   ├── services/       # API services
│   │   └── api.js      # Backend API client
│   ├── App.js          # Main app component
│   ├── App.css         # App styles
│   └── index.js        # React entry point
├── package.json        # Dependencies
└── .env.example        # Environment variables template
```

## API Integration

The frontend communicates with the Django REST Framework backend. 

### Backend Requirements

Ensure the backend is running at `http://localhost:8000` with these endpoints:

- `POST /api/sessions/create/` - Create session
- `GET /api/sessions/<code>/` - Get session details
- `POST /api/sessions/<code>/join/` - Join session
- `POST /api/sessions/<code>/fetch-restaurants/` - Fetch restaurants
- `POST /api/sessions/<code>/vote/` - Submit vote
- `GET /api/sessions/<code>/result/` - Get results

## Usage

1. **Create Session**: Click "Create New Session" on home page, enter your name
2. **Share Code**: Share the session code with friends
3. **Join Session**: Friends click "Join Existing Session", enter code and their name
4. **Find Restaurants**: Click "Find Nearby Restaurants"
5. **Vote**: Vote yes/no on each restaurant
6. **View Results**: Click "View Results" to see rankings

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run dev` - Alias for start

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Error
- Ensure Django backend is running: `python manage.py runserver`
- Check `.env` has correct API URL
- Verify CORS is enabled in Django settings

### Restaurants Not Loading
- Backend may not have Google Places API key configured
- Check backend logs for API errors

## Development Notes

- The app uses plain CSS for styling (no build tool needed)
- State management is handled with React hooks
- API calls use Axios with a centralized service
- Routing uses React Router v6

## Future Enhancements

- User authentication
- Session history and analytics
- Advanced filtering options
- Geolocation for automatic restaurant discovery
- Notification system
