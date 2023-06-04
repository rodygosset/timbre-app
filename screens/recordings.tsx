import Brand from "@components/brand"
import ScreenContainer from "@components/screen-container"
import { AudioFileType, Context, ListOfRecordingsProps } from "@utils/context"
import { useContext } from "react"
import { FlatList, Text, View } from "react-native"
  

import styles from "@styles/screens/recordings.scss"
import ListOfRecordings from "@components/list-of-recordings"

interface Props {
    onAudioPress: (audio: AudioFileType, index: number) => void
}


const Recordings = ({ onAudioPress }: Props) => {

    // retrieve the list of recordings from the context

    const { recordings } = useContext(Context)


    // sort the recordings by date

    const getRecordingsByDate = (): ListOfRecordingsProps[] => {
        // start by sorting the recordings by date

        const sortedRecordings = recordings.sort((a, b) => b.date.getTime() - a.date.getTime())

        // create a list of dates

        const dates = [...new Set(sortedRecordings.map(recording => recording.date.toISOString().split("T")[0]))]

        // create & return  a list of recordings for each date

        return dates.map(date => ({
            date: new Date(date),
            recordings: sortedRecordings.filter(recording => recording.date.toISOString().split("T")[0] === date)
        }))
    }


    // render

    return (
        <ScreenContainer>
            <Brand inline />
            <View style={styles.container}>
                <Text style={styles.header}>Recordings</Text>
                {
                    recordings.length > 0 ?
                    <FlatList 
                        style={{ width: "100%" }}
                        data={getRecordingsByDate()}
                        keyExtractor={item => item.date.toString()}
                        renderItem={({ item }) => (
                            <ListOfRecordings 
                                date={item.date} 
                                recordings={item.recordings} 
                                onPress={onAudioPress}
                            />
                        )}
                    />
                    :
                    <View style={styles.empty}>
                        <Text style={styles.noRecordings}>No recordings yet</Text>
                        <Text style={styles.noRecordingsCaption}>Go to the home page to start recording !</Text>
                    </View>

                }
            </View>
        </ScreenContainer>
    )

}

export default Recordings