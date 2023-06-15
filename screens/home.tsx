import { ScreenProps } from '@utils/types';
import ScreenContainer from '@components/screen-container';
import Brand from '@components/brand';
import Button from '@components/button';
import { faFileWaveform } from '@fortawesome/free-solid-svg-icons';
import RecordButton from '@components/record-button';
import { useContext, useEffect, useRef, useState } from 'react';

import styles from '@styles/screens/home.scss';
import { View, Text, AppState } from 'react-native';

import FadingCircles from '@assets/fading-circles.svg';
import AnimatedCircle from '@components/animated-circle';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { AudioFileType, Context } from '@utils/context';

import * as DocumentPicker from 'expo-document-picker';
import { getAudioDuration } from '@utils/lib';

const Home = ({ navigation }: ScreenProps) => {

    // manage app focus and unfocus

    const appState = useRef(AppState.currentState)

    useEffect(() => {
        const sub = AppState.addEventListener('change', nextAppState => {
            // when the app looses focus, stop the recording

            if(appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
                setIsRecording(false)
            }

            appState.current = nextAppState
        })

        return () => sub.remove()
    }, [])

    // stop the recording when the screen looses focus

    useEffect(() => {

        const stopRecording = () => setIsRecording(false)

        navigation.addListener('blur', stopRecording)

        return () => navigation.removeListener('blur', stopRecording)
    }, [navigation])

    // recording state

    const [isRecording, setIsRecording] = useState(false)

    // keep track of the time in seconds

    const [timeElapsed, setTimeElapsed] = useState(0)

    const [timer, setTimer] = useState<NodeJS.Timer | null>(null)


    // reset the timer when the recording is stopped

    useEffect(() => {
        setTimeElapsed(0)

        // clear the timer if the recording is stopped


        if(timer) clearInterval(timer)
        setTimer(null)

        if(!isRecording) return

        // start the timer when the recording starts

        setTimer(setInterval(() => {
            setTimeElapsed(timeElapsed => timeElapsed + 1)
        }, 1000))


    }, [isRecording])


    // helpers

    const getMinutes = () => {
        const minutes = Math.floor(timeElapsed / 60)
        return minutes < 10 ? `0${minutes}` : `${minutes}`
    }

    const getSeconds = () => {
        const seconds = timeElapsed % 60
        return seconds < 10 ? `0${seconds}` : `${seconds}`
    }

    const handleErr = (e: any) => {
        console.log(`Error while ${isRecording ? "starting" : "stopping"} the recording: `, e)
        setIsRecording(false)
    }


    // rename & save the recording to the list of recordings
    // use the context to access the list

    const { recordings, setRecordings } = useContext(Context)


    const saveRecording = async (uri: string, rename: boolean = true, name?: string) => {
        
        if(!rename) {

            const recName = name || uri.split('/').slice(-1)[0]

            const newRecording: AudioFileType = {
                name: recName,
                duration: await getAudioDuration(uri),
                uri: FileSystem.documentDirectory + recName,
                date: new Date()
            }

            setRecordings([ ...recordings, newRecording ])
            return newRecording
        }
        
        // rename the file

        const newFileName = `timbre-app-rec-${new Date().toISOString()}.wav`

        const newURI = FileSystem.documentDirectory + newFileName

        await FileSystem.moveAsync({
            from: uri,
            to: newURI
        })

        // add the file to the list of recordings

        const newRecording: AudioFileType = {
            name: newFileName,
            duration: await getAudioDuration(newURI),
            uri: newURI,
            date: new Date()
        }

        setRecordings([ ...recordings, newRecording])
        // navigate to the recordings screen
        // @ts-ignore
        navigation.navigate('Recordings')
    }

    // start recording when the button is pressed

    const [recording, setRecording] = useState<Audio.Recording | null>(null)

    const startRecording = async () => {
        try {

            // request permission to record audio

            await Audio.requestPermissionsAsync()
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true
            })

            // create a new recording

            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
            setRecording(recording)

        } catch(e) {
            console.log("Error while starting the recording: ", e)
        }
    }

    // stop recording when the button is pressed

    const stopRecording = async () => {
        if(!recording) return
        await recording.stopAndUnloadAsync()
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false
        })
        const uri = recording.getURI()
        if(!uri) return
        await saveRecording(uri)
    }

    // start or stop the recording when the button is pressed

    useEffect(() => {
        isRecording ? startRecording().catch(handleErr) : stopRecording().catch(handleErr)
    }, [isRecording])


    // let the user select a file from the file system

    const OnFileSelect = async () => {
        try {
            // request permission to read files

            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: true,
                multiple: false
            })

            if(result.type !== 'success') return

            // add the file to the list of recordings

            await saveRecording(result.uri, false, result.name)

        } catch(e) {
            console.log("Error while selecting a file: ", e)
        }
    }

    // render

    return (
        <ScreenContainer style={styles.screen}>
            <Brand />
            <View style={styles.recordButtonContainer}>
                <FadingCircles style={styles.circles} />
                <AnimatedCircle on={isRecording} />
                <RecordButton
                    isRecording={isRecording}
                    onPress={() => setIsRecording(!isRecording)}
                />
            </View>
            {
                isRecording ?
                <View style={styles.recordingInfoContainer}>

                    <View style={styles.recordingTextInfoContainer}>
                        <Text style={styles.recordingMessage}>Recording...</Text>
                        <Text style={styles.recordingCaption}>Press the button to stop</Text>
                    </View>

                    <View style={styles.timer}>
                        <Text style={styles.timerValue}>{getMinutes()}:{getSeconds()}</Text>
                    </View>
                </View>
                :
                <View style={styles.captionContainer}>
                    <Text style={styles.caption}>Record a new sample of your voice</Text>
                    <Text style={styles.subCaption}>Or</Text>
                    <Button
                        icon={faFileWaveform}
                        title="Select an audio file"
                        role='secondary'
                        onPress={OnFileSelect}
                    />
                </View>
            }
        </ScreenContainer>
    )
}

export default Home