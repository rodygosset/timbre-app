import { View, Text } from "react-native"
import AppIcon from "@assets/icon.svg"

import styles from "@styles/components/brand.scss"


const Brand = () => {

    // render

    return (
        <View style={styles.brand}>
            <AppIcon width="60" height="60" />
            <View style={styles.textContainer}>
                <Text style={styles.appName}>Timbre.</Text>
                <Text style={styles.caption}>AI VOICE TRANSFORMATION</Text>
            </View>
        </View>
    )

}

export default Brand