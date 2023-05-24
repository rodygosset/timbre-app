
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@screens/home';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// this component serves as the kernel of the app

// nav conf

const Stack = createNativeStackNavigator()

export default function App() {

	// implement navigation

	// render

	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator 
					screenOptions={{  headerShown: false }}>
					<Stack.Screen 
						name="Home" 
						component={Home}
						options={{  }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
			<StatusBar style="auto" />
		</SafeAreaProvider>
	)
}

