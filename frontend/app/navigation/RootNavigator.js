import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CreateSessionScreen from '../screens/CreateSessionScreen';
import JoinSessionScreen from '../screens/JoinSessionScreen';
import VotingSessionScreen from '../screens/VotingSessionScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#667eea',
            borderBottomWidth: 0,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Where Tonight?',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateSession"
          component={CreateSessionScreen}
          options={{
            title: 'Create Session',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="JoinSession"
          component={JoinSessionScreen}
          options={{
            title: 'Join Session',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="VotingSession"
          component={VotingSessionScreen}
          options={{
            title: 'Voting',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
