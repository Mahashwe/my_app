# Where Tonight - Full Stack Setup Guide

## Overview
This is a complete Django REST Framework backend + React Native mobile app application for group restaurant voting.

## Project Structure
```
my_app/
├── base/                    # Django project configuration
├── restaurant_options/      # Restaurant app
├── voting_sessions/         # Voting sessions app
├── frontend/               # React Native/Expo mobile app
├── db.sqlite3              # SQLite database
├── manage.py               # Django management
├── requirements.txt        # Python dependencies
└── README.md               # This file
```

## Prerequisites
- Python 3.8+
- Node.js 14+ and npm
- Git

## Backend Setup

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Migrations
```bash
python manage.py migrate
```

### 5. Create Admin User (Optional)
```bash
python manage.py createsuperuser
```

### 6. Start Backend Server
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### 7. Access Django Admin
```
http://localhost:8000/admin
```

## Frontend Setup (React Native / Expo Mobile App)

### 1. Prerequisites
- Install Expo CLI: `npm install -g expo-cli`
- Install Expo Go app on your phone (iOS App Store or Google Play)

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Backend Connection
The `.env` file is already set up to connect to `http://localhost:8000/api`

For physical devices, update the IP address instead of localhost:
```
REACT_APP_API_URL=http://{YOUR_COMPUTER_IP}:8000/api
```

### 5. Start Expo Development Server
```bash
npm run dev
# or
npm start
```

### 6. Run On Device
- **Physical Device**: Scan QR code with Expo Go app
- **iOS Simulator** (Mac): Press `i`
- **Android Emulator**: Press `a`
- **Web**: Press `w` (for testing only)

## Running Backend & Mobile Together

To see the full application working:

1. **Terminal 1 - Backend:**
```bash
cd my_app
venv\Scripts\activate  # Windows
python manage.py runserver
```2. **Terminal 2 - Mobile Frontend:**
```bash
cd my_app\frontend
npm start
```

3. **On Your Phone:**
- Open Expo Go app
- Scan QR code from Terminal 2
- App connects to backend automatically

## API Documentation

The backend provides the following endpoints:

### Sessions
- `POST /api/sessions/create/` - Create new session
- `GET /api/sessions/<code>/` - Get session details
- `POST /api/sessions/<code>/join/` - Join a session
- `POST /api/sessions/<code>/fetch-restaurants/` - Fetch nearby restaurants
- `POST /api/sessions/<code>/vote/` - Submit a vote
- `GET /api/sessions/<code>/result/` - Get voting results

### Restaurants
- `GET /api/restaurants/` - List all restaurants
- `POST /api/restaurants/` - Create restaurant (admin)

## Usage Flow

1. **Create Session**: Open app, tap "Create New Session", enter your name
2. **Get Share Code**: You'll get a unique 6-character code
3. **Share with Friends**: Send code via text/email
4. **Friends Join**: Tap "Join Existing Session", enter code and name
5. **Enable Location**: Allow app to access your location
6. **Find Restaurants**: Tap "Find Nearby Restaurants"
7. **Vote**: Tap Yes/No on each restaurant
8. **View Results**: Tap "View Results" to see rankings

## Troubleshooting

### CORS Issues
If you get CORS errors in the browser console:
- Ensure Django CORS headers are properly configured
- Check `base/settings.py` has `CORS_ALLOWED_ORIGINS`

### API Connection Error
- Verify backend is running on http://localhost:8000
- Check frontend `.env` file has correct API URL
- Clear browser cache

### Restaurants Not Loading
- Ensure Google Places API key is configured in backend
- Check backend logs for API errors: `python manage.py runserver`

### Port Already In Use
If ports 3000 or 8000 are already in use:
```bash
# Frontend on different port
PORT=3001 npm start

# Backend on different port
python manage.py runserver 8001
```

## Development

### Backend
- Located in: `restaurant_options/`, `voting_sessions/` apps
- API Views: `views.py` files in each app
- Database Models: `models.py` files
- Admin: `admin.py` files

### Frontend
- Located in: `frontend/src/`
- Components in: `frontend/src/components/`
- Pages in: `frontend/src/pages/`
- API Service: `frontend/src/services/api.js`
- Styling: Plain CSS files

## Database

The application uses SQLite for development. The database file is created automatically:
```
db.sqlite3
```

### Database Migrations
```bash
# Create migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migration status
python manage.py showmigrations
```

## Production Deployment

### Backend
1. Set `DEBUG = False` in `base/settings.py`
2. Configure allowed hosts
3. Use a production database (PostgreSQL recommended)
4. Use gunicorn: `gunicorn base.wsgi`

### Frontend
1. Build production bundle: `npm run build`
2. Deploy `build/` folder to static host
3. Update `REACT_APP_API_URL` to production backend URL

## Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Features

✅ Create and join voting sessions
✅ Unique session codes (6-character alphanumeric)
✅ Google Places API integration
✅ Real-time vote tracking
✅ Results aggregation
✅ Django admin interface
✅ React frontend with routing
✅ Clean, responsive UI

## Future Enhancements

- [ ] User authentication & profiles
- [ ] Ranking/preference voting
- [ ] Restaurant filtering options
- [ ] Geolocation support
- [ ] Session history
- [ ] Notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics

## Support

For issues or questions:
1. Check backend logs: Terminal running Django
2. Check browser console: Browser Dev Tools (F12)
3. Check network tab: See API requests/responses
