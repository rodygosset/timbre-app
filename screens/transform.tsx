import Brand from "@components/brand"
import ScreenContainer from "@components/screen-container"
import { ScrollView, Text, View } from "react-native"

import styles from "@styles/screens/transform.scss"
import Button from "@components/button"
import { ScreenProps } from "@utils/types"
import { useContext } from "react"
import { AudioFileType, Context } from "@utils/context"
import { faFileWaveform, faWaveSquare } from "@fortawesome/free-solid-svg-icons"
import ModelPicker from "@components/model-picker"
import { downloadFile, getAudioDuration, sendFile } from "@utils/lib"

interface Props extends ScreenProps {
    onPickerModalToggle: () => void;
}

const Transform = ({ navigation, onPickerModalToggle }: Props) => {

    // get the selected recording from the context

    const { recordings, selectedRecording, setSelectedRecording, selectedModel, setTransformedRecordings, transformedRecordings } = useContext(Context)

    // helpers

    const dateOptions = { year: "numeric", month: "long", weekday: "long", day: "numeric" }
    // @ts-ignore
    const getDateString = () => (new Date(selectedRecording?.date)).toLocaleDateString("en-US", dateOptions)

    const getTimeString = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
        const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`
        return `${minutesString}:${secondsString}`
    }

    const getIndex = () => {
        if(!selectedRecording) return -1
        const index = recordings.findIndex(recording => recording.uri === selectedRecording.uri)
        return recordings.length - index
    }

    // handlers

    const handleTransform = () => {
        if(!selectedRecording) return
        if(!selectedModel) return

        sendFile(selectedRecording.uri, selectedModel).then(downloadFile).then(async (uri) => {
            const newResult: AudioFileType = {
                name: uri.split('/').slice(-1)[0],
                duration: await getAudioDuration(uri),
                uri: uri,
                date: new Date()
            }

            setTransformedRecordings([ ...transformedRecordings, newResult ])
            // @ts-ignore
            navigation.navigate("Saved")
        }).catch(console.log)
    }

    // render

    return (
        <ScreenContainer>
            <View style={styles.brandContainer}>
                <Brand />
            </View>
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Orignial Audio Sample</Text>
                    {
                        selectedRecording ?
                        <View style={styles.audioContainer}>
                            <View style={styles.audioTitleContainer}>
                                <Text style={styles.audioName}>Recording number { getIndex() }</Text>
                                <Text style={styles.audioDate}>{ getDateString() }</Text>
                            </View>
                            <Text style={styles.duration}>{ getTimeString(selectedRecording.duration) }</Text>
                        </View>
                        :
                        <Text style={styles.noAudioText}>No audio selected</Text>
                    }
                    <Button 
                        icon={faFileWaveform}
                        iconSize="small"
                        title={selectedRecording  ? "Pick another" : "Pick a recording"}
                        role="secondary"
                        fullWidth
                        // @ts-ignore
                        onPress={() => navigation.navigate("Recordings")}
                    />
                    {
                        selectedRecording ?
                        <Button 
                            title="Clear"
                            role="tertiary"
                            fullWidth
                            onPress={() => setSelectedRecording(null)}
                        />
                        :
                        <></>
                    }
                </View>
                <ScrollView contentContainerStyle={styles.section}>
                    <Text style={styles.sectionTitle}>AI Model</Text>
                    <ModelPicker/>
                    <Button 
                        fullWidth
                        title="Transform"
                        icon={faWaveSquare}
                        onPress={handleTransform}
                    />
                </ScrollView>
            </View>
        </ScreenContainer>
    )

}

export default Transform