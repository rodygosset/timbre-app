
import TabBar from '@components/layout/tab-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from '@screens/home';
import Records from '@screens/records';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import styles from "@styles/components/screen-container.scss";
import { LinearGradient } from 'expo-linear-gradient';

// this component serves as the kernel of the app

// nav conf

const Tab = createMaterialTopTabNavigator()

export default function App() {

	// implement navigation

	// render

	return (
		<SafeAreaProvider style={{ backgroundColor: "#191919" }}>
			<LinearGradient
				colors={['#039BE5', '#E91E63']}
				style={styles.appBackground}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			/>
			<NavigationContainer>
				<Tab.Navigator 
					tabBarPosition='bottom'
					tabBar={TabBar}
					sceneContainerStyle={{ backgroundColor: "transparent" }}>
					<Tab.Screen 
						name="Home" 
						component={Home}
					/>
					<Tab.Screen 
						name="Records" 
						component={Records}
					/>
				</Tab.Navigator>
			</NavigationContainer>
			<StatusBar style="auto" />
		</SafeAreaProvider>
	)
}

