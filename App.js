import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import Settings from './Settings';
import Goals from './Goals';
import JournalPage from './JournalPage';

import PositiveReinforcementScreen from './PositiveReinforcement';
import InsideLayout from './InsideLayout';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log(user);
      setUser(user);
      setUserId(user?.uid); 
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="InsideLayout"
              component={InsideLayout}
              options={{ title: 'Main Page' }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              initialParams={{ userId }}
              options={{ title: 'Settings' }}
            />
            <Stack.Screen
              name="Goals"
              component={Goals}
              initialParams={{ userId }}
              options={{ title: 'Goals' }}
            />
            <Stack.Screen name="Journal Page" component={JournalPage} initialParams={{ userId }}/>
            <Stack.Screen
              name="Positive Reinforcement"
              component={PositiveReinforcementScreen}
              options={{ title: 'Positive Reinforcement' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Welcome' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
