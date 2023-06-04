import { AudioFileType, ListOfRecordingsProps } from "@utils/context"
import { View, Text } from "react-native"

import styles from "@styles/components/list-of-recordings.scss"
import AudioFileListItem from "./audio-file-list-item"

interface Props extends ListOfRecordingsProps {
    onPress: (recording: AudioFileType, index: number) => void;
}

const ListOfRecordings = (
    {
        date,
        recordings,
        onPress
    }: Props
) => {

    // helpers


    const dateOptions = { year: "numeric", month: "long", weekday: "long", day: "numeric" }
    // @ts-ignore
    const getDateString = () => (new Date(date)).toLocaleDateString("en-US", dateOptions)

    // render

    return (
        <View style={styles.container}>
            <Text style={styles.date}>{ getDateString() }</Text>
            {
                recordings.map((recording, index) => (
                    <AudioFileListItem 
                        key={index}
                        item={recording}
                        index={recordings.length - index - 1}
                        isLast={index === recordings.length - 1}
                        onPress={() => onPress(recording, index)}
                    />
                ))
            }
        </View>
    )
}

export default ListOfRecordings