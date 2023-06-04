import { View, Text } from "react-native"
import AppIcon from "@assets/icon.svg"

import styles from "@styles/components/brand.scss"


interface Props {
    inline?: boolean
}

const Brand = ({ inline }: Props) => {

    // helpers 

    const getContainerStyles = () => inline ? { ...styles.brand, ...styles.inline } : styles.brand

    const getTextContainerStyles = () => inline ? { ...styles.textContainer, ...styles.textContainerInline } : styles.textContainer

    const getAppNameStyles = () => inline ? { ...styles.appName, ...styles.appNameInline } : styles.appName

    const getCaptionStyles = () => inline ? { ...styles.caption, ...styles.captionInline } : styles.caption

    const getLogoSize = () => inline ? 40 : 60

    // render

    return (
        <View style={getContainerStyles()}>
            <AppIcon 
                width={getLogoSize()}
                height={getLogoSize()}
            />
            <View style={getTextContainerStyles()}>
                <Text style={getAppNameStyles()}>Timbre.</Text>
                <Text style={getCaptionStyles()}>AI VOICE TRANSFORMATION</Text>
            </View>
        </View>
    )

}

export default Brand