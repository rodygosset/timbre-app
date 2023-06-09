
import TabBar from '@components/layout/tab-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import Home from '@screens/home';
import Recordings from '@screens/recordings';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import styles from "@styles/components/screen-container.scss";
import { LinearGradient } from 'expo-linear-gradient';
import Transform from '@screens/transform';
import Saved from '@screens/saved';
import { fonts } from '@utils/fonts';
import { useFonts } from 'expo-font';
import { AudioFileType, Context, getPersistedRecordings, getPersistedTransformedRecordings, setPersistedRecordings, setPersistedTransformedRecordings } from '@utils/context';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AudioPlayerModal from '@components/audio-player-modal';

// this component serves as the kernel of the app

// nav conf

const Tab = createMaterialTopTabNavigator()

export default function App() {

	// context

	const [recordings, recordingsSetter] = React.useState<AudioFileType[]>([])
	const [transformedRecordings, transformedRecordingsSetter] = React.useState<AudioFileType[]>([])
	const [selectedRecording, setSelectedRecording] = useState<AudioFileType | null>(null)

	const [selectedModel, setSelectedModel] = useState<string | null>(null)
	const [models, setModels] = useState<string[]>([])

	// keep the list of recordings consistent with local storage

	const setRecordings = (list: AudioFileType[]) => {
		setPersistedRecordings(list).then(recordingsSetter).catch(console.log)
	}

	// keep the list of transformed recordings consistent with local storage

	const setTransformedRecordings = (list: AudioFileType[]) => {
		setPersistedTransformedRecordings(list).then(transformedRecordingsSetter).catch(console.log)
	}

	// load data from local storage on app load

	useEffect(() => {
		getPersistedRecordings().then(recordingsSetter).catch(console.log)
		getPersistedTransformedRecordings().then(transformedRecordingsSetter).catch(console.log)
	}, [])

	// memoize the context,
	// to avoid needless React re-renders
	const value = useMemo(
		() => ({ recordings, setRecordings, transformedRecordings, setTransformedRecordings, selectedRecording, setSelectedRecording, models, setModels, selectedModel, setSelectedModel }), [recordings, transformedRecordings, selectedRecording, models, selectedModel]
	)

	// load the fonts

	const [fontsLoaded] = useFonts(fonts)

	// don't display anything until the fonts are loaded

	
	// bottom sheet modal audio player
    // start with creating a ref for it

    // callbacks for the bottom sheet modal

    const [playingAudio, setPlayingAudio] = useState<AudioFileType>()
	const [playingAudioIndex, setPlayingAudioIndex] = useState<number>(0)

	const [toggler, setToggler] = useState(false)
	const [isSaved, setIsSaved] = useState(false)

    const handlePresentModalPress = (audioFile: AudioFileType, index: number, isSaved: boolean = false) => {
		setToggler(!toggler)
        setPlayingAudio(audioFile)
		setPlayingAudioIndex(index)
		setIsSaved(isSaved)
    }

	// trigger navigation to the transform screen

	const navigationRef = useNavigationContainerRef()

	const onTransformClick = (audio: AudioFileType) => {
		if(!navigationRef.current || !audio) return
		setSelectedRecording(audio)
		// @ts-ignore
		navigationRef.current.navigate('Transform')
	}


	// get the list of AI models from the server

    const getModels = () => {
        fetch("https://rave-server.rodygosset.dev/get-models").then(res => res.json())
        .then(res => setModels(res.models))
        .catch(console.log)
    }

    useEffect(() => {
        getModels()
    }, [])


	// render

	return (
		<BottomSheetModalProvider>
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
						<NavigationContainer ref={navigationRef}>
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
								>
									{() => <Recordings onAudioPress={handlePresentModalPress} />}
								</Tab.Screen>
								<Tab.Screen 
									name="Transform" 
									children={(props) => <Transform {...props} onPickerModalToggle={() => setToggler(!toggler)} />}
								/>
								<Tab.Screen 
									name="Saved" 
								>
									{() => <Saved onAudioPress={(audioFile, index) => handlePresentModalPress(audioFile, index, true)} />}
								</Tab.Screen>
							</Tab.Navigator>
						</NavigationContainer>
						<StatusBar style="auto" />
					</SafeAreaProvider>
				:
				<></>
			}
			<AudioPlayerModal 
				audio={playingAudio} 
				index={playingAudioIndex}
				toggler={toggler}
				onTransformClick={onTransformClick}
				savedAudioMode={isSaved}
			/>
			</Context.Provider>
		</BottomSheetModalProvider>
	)
}

