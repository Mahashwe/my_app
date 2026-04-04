import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Session APIs
export const createSession = (creatorName) => {
  return api.post('/sessions/create/', { creator_name: creatorName });
};

export const getSession = (code) => {
  return api.get(`/sessions/${code}/`);
};

export const joinSession = (code, participantName) => {
  return api.post(`/sessions/${code}/join/`, { name: participantName });
};

export const fetchRestaurants = (code, latitude, longitude, cuisineType = 'restaurant', radius = 5000) => {
  return api.post(`/sessions/${code}/fetch-restaurants/`, {
    latitude,
    longitude,
    cuisine_type: cuisineType,
    radius,
  });
};

export const submitVote = (code, restaurantId, liked) => {
  return api.post(`/sessions/${code}/vote/`, {
    restaurant_id: restaurantId,
    liked,
  });
};

export const getResults = (code) => {
  return api.get(`/sessions/${code}/result/`);
};

// Restaurant APIs
export const getAllRestaurants = () => {
  return api.get('/restaurants/');
};

export default api;
