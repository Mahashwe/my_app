# 📱 Where Tonight - React Native Mobile App

React Native mobile app (iOS & Android) for the "Where Tonight" group restaurant voting application.

## Features

- 🎯 Create voting sessions with unique codes
- 👥 Join sessions and invite friends  
- 📍 Automatic geolocation for nearby restaurants
- 🗳️ Vote yes/no on restaurants from Google Places
- 📊 View real-time voting results
- 🚀 Works on Android & iOS

## Tech Stack

- **React Native** - iOS & Android native development
- **Expo** - Development platform & build service
- **React Navigation** - Mobile navigation
- **Axios** - HTTP client
- **Expo Location** - Geolocation services

## Prerequisites

- Node.js 16+ and npm
- iOS device/simulator (Mac required for iOS)
- Android device/emulator (optional)
- Expo CLI: `npm install -g expo-cli`

## Installation

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Backend URL

Edit `.env` if your backend is not on `http://localhost:8000`:
```
REACT_APP_API_URL=http://YOUR_BACKEND_URL/api
```

## Running the App

### Start Development Server
```bash
npm run dev
# or
npm start
```

This opens the Expo dev menu with options to:
- Run on iOS simulator (Mac only)
- Run on Android emulator  
- Run on physical device (install Expo Go app first)

### Option 1: Physical Device
1. Install **Expo Go** app from App Store or Google Play
2. Run `npm start`
3. Scan the QR code with your phone

### Option 2: iOS Simulator (Mac)
```bash
npm run ios
```

### Option 3: Android Emulator
```bash
npm run android
```

## Project Structure

```
frontend/
├── App.js                          # Main app entry
├── index.js                        # React Native entry point
├── app.json                        # Expo configuration
├── app/
│   ├── navigation/
│   │   └── RootNavigator.js       # Stack navigation setup
│   ├── screens/
│   │   ├── HomeScreen.js          # Landing page
│   │   ├── CreateSessionScreen.js # Create voting session
│   │   ├── JoinSessionScreen.js   # Join voting session
│   │   └── VotingSessionScreen.js # Main voting interface
│   ├── components/
│   │   ├── Button.js              # Reusable button
│   │   └── RestaurantCard.js      # Restaurant voting card
│   ├── services/
│   │   └── api.js                 # Backend API client
│   └── context/
│       └── SessionContext.js      # Global session state
├── package.json                   # Dependencies
├── .env                           # Environment config
└── README.md                      # This file
```

## Permissions

The app requests:
- **Location** - To find nearby restaurants (iOS & Android)

Grant permissions when prompted for best experience.

## API Connection

The app connects to backend at `http://localhost:8000/api` by default.

### Required Backend Endpoints

- `POST /api/sessions/create/` - Create session
- `GET /api/sessions/<code>/` - Get session details
- `POST /api/sessions/<code>/join/` - Join session
- `POST /api/sessions/<code>/fetch-restaurants/` - Fetch restaurants
- `POST /api/sessions/<code>/vote/` - Submit vote
- `GET /api/sessions/<code>/result/` - Get results

## Usage Flow

1. **Home** - Choose to create or join a session
2. **Create** - Enter your name to start a new voting session
3. **Session Code** - Share the unique code with friends
4. **Join** - Friends enter code and their name
5. **Find Restaurants** - App fetches nearby restaurants
6. **Vote** - Tap Yes/No on each restaurant
7. **Results** - View voting rankings

## Troubleshooting

### Can't Connect to Backend
- Ensure Django backend is running: `python manage.py runserver`
- Check backend is accessible: `http://localhost:8000/admin`
- Update `.env` with correct backend URL
- On physical device, use your computer's IP instead of localhost

### Location Permission Denied
- Go to app permissions in Settings
- Enable Location Access for Expo Go or the app

### App Won't Start
- Clear cache: `expo start --clear`
- Clear node_modules: `rm -rf node_modules && npm install`
- Restart development server

### Can't See Android Emulator Option
- Install Android emulator via Android Studio
- Start emulator before running `npm start`

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

Requires Expo account: `expo login`

## Deployment

For production deployment, see [Expo Documentation](https://docs.expo.dev/distribute/publish-links/)

## Performance Tips

- Use pull-to-refresh to update session data
- Results load in modal without blocking voting
- Images are lazy-loaded with caching
- Minimal re-renders using React hooks

## Browser Testing

Test the web version with:
```bash
npm run web
```

Works in modern browsers but mobile native apps recommended.

## Support

For issues:
1. Check backend logs: Terminal running Django
2. Check Expo logs: Terminal output
3. Enable debug logs: `expo log` in separate terminal
