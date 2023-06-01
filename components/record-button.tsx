import { useState } from "react";

import styles from "@styles/components/record-button.scss";
import { Pressable, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMicrophone, faSquare } from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
    isRecording: boolean;
    onPress: () => void;
}

const RecordButton = (
    {
        isRecording,
        onPress
    }: Props
) => {

    // state

    const [wrapperStyles, setWrapperStyles] = useState(styles.wrapper)

    // handlers

    const onPressIn = () => setWrapperStyles({ ...wrapperStyles, ...styles.pressed })
    const onPressOut = () => setWrapperStyles(styles.wrapper)


    // render

    return (
        <Pressable
            style={wrapperStyles}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}>
                <LinearGradient
					colors={['#039BE5', '#E91E63']}
					style={{ ...styles.gradient, opacity: 0.2 }}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				/>
                <View style={styles.button}>
                    <LinearGradient
                        colors={['#039BE5', '#E91E63']}
                        style={{ ...styles.gradient, opacity: 0.4 }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                    <FontAwesomeIcon icon={isRecording ? faSquare : faMicrophone} style={styles.icon} />
                </View>
        </Pressable>
    )

}

export default RecordButton