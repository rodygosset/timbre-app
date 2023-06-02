
import TabBar from '@components/layout/tab-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from '@screens/home';
import Recordings from '@screens/recordings';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import styles from "@styles/components/screen-container.scss";
import { LinearGradient } from 'expo-linear-gradient';
import Transform from '@screens/transform';
import Saved from '@screens/saved';
import { fonts } from '@utils/fonts';
import { useFonts } from 'expo-font';
import { AudioFileType, Context, getPersistedRecordings, getPersistedTransformedRecordings, setPersistedRecordings } from '@utils/context';

// this component serves as the kernel of the app

// nav conf

const Tab = createMaterialTopTabNavigator()

export default function App() {

	// context

	const [recordings, recordingsSetter] = React.useState<AudioFileType[]>([])
	const [transformedRecordings, transformedRecordingsSetter] = React.useState<AudioFileType[]>([])

	// keep the list of recordings consistent with local storage

	const setRecordings = (list: AudioFileType[]) => {
		setPersistedRecordings(list).then(recordingsSetter).then(() => {
			getPersistedRecordings().then(newList => console.log("new list of recordings", newList)).catch(console.log)
		}).catch(console.log)
	}

	// keep the list of transformed recordings consistent with local storage

	const setTransformedRecordings = (list: AudioFileType[]) => {
		setPersistedRecordings(list).then(transformedRecordingsSetter).catch(console.log)
	}

	// load data from local storage on app load

	useEffect(() => {
		getPersistedRecordings().then(recordingsSetter).catch(console.log)
		getPersistedTransformedRecordings().then(transformedRecordingsSetter).catch(console.log)
	}, [])


	// show the list of recordings every time it changes

	useEffect(() => {
		console.log("recordings", recordings.map(r => r.name))
	}, [recordings])

	// memoize the context,
	// to avoid needless React re-renders
	const value = useMemo(
		() => ({ recordings, setRecordings, transformedRecordings, setTransformedRecordings }), [recordings, transformedRecordings]
	)

	// load the fonts

	const [fontsLoaded] = useFonts(fonts)

	// don't display anything until the fonts are loaded

	// implement navigation

	// render

	return (
		<Context.Provider value={value}>
		{
			fontsLoaded ?
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
							initialRouteName='Home'
							tabBar={TabBar}
							sceneContainerStyle={{ backgroundColor: "transparent" }}>
							<Tab.Screen 
								name="Home" 
								component={Home}
							/>
							<Tab.Screen 
								name="Recordings" 
								component={Recordings}
							/>
							<Tab.Screen 
								name="Transform" 
								component={Transform}
							/>
							<Tab.Screen 
								name="Saved" 
								component={Saved}
							/>
						</Tab.Navigator>
					</NavigationContainer>
					<StatusBar style="auto" />
				</SafeAreaProvider>
			:
			<></>
		}
		</Context.Provider>
	)
}

