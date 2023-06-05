import { AudioFileType } from "@utils/context"
import { Text, Pressable } from "react-native"

import styles from "@styles/components/audio-file-list-item.scss"
import { useState } from "react";
import Divider from "./divider";

interface Props {
    item: AudioFileType;
    index: number;
    isLast: boolean;
    onPress: () => void;
}

const AudioFileListItem = ({ item, index, isLast, onPress }: Props) => {

    const [isPressed, setIsPressed] = useState(false)

    // helpers

    const getMinutes = () => {
        const minutes = Math.floor(item.duration / 60)
        return minutes < 10 ? `0${minutes}` : `${minutes}`
    }

    const getSeconds = () => {
        const seconds = Math.floor(item.duration % 60)
        return seconds < 10 ? `0${seconds}` : `${seconds}`
    }

    const getStyles = () => (
        isPressed ? {
            ...styles.item,
            backgroundColor: "rgba(255, 255, 255, 0.03)",
        } : styles.item
    )

    // render

    return (
        <>
            <Pressable 
                style={getStyles()}
                onPress={onPress}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}>
                <Text style={styles.title}>Recording number { index + 1 }</Text>
                <Text style={styles.duration}>{ getMinutes() }:{ getSeconds() }</Text>
            </Pressable>
            {
                isLast ?
                <></> : <Divider />
            }
        </>
    )
}

export default AudioFileListItem