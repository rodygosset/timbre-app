import { fonts } from '@utils/fonts';
import { ScreenProps } from '@utils/types';
import { useFonts } from 'expo-font';
import { Text, View } from 'react-native';

import AppIcon from "@assets/icon.svg"

import styles from "@styles/screens/home.scss"

const Home = ({ navigation }: ScreenProps) => {

    // load the fonts

	const [fontsLoaded] = useFonts(fonts)

	// don't display anything until the fonts are loaded

    // render

    return (
        fontsLoaded ?
            <View style={styles.screen}>
                <AppIcon style={styles.appIcon} />
                <Text style={styles.appName}>Timbre.</Text>
                <Text style={styles.caption}>AI VOICE TRANSFORMATION</Text>
            </View>
        :
        <></>
    )
}

export default Home