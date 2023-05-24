import { Platform, SafeAreaView } from "react-native";
import styles from "@styles/components/screen-container.scss";
import { fonts } from "@utils/fonts";
import { useFonts } from "expo-font";

interface Props {
    children: React.ReactNode;
}

const ScreenContainer = (
    {
        children
    }: Props
) => {

    // load the fonts

	const [fontsLoaded] = useFonts(fonts)

	// don't display anything until the fonts are loaded

    // manage safe area in Android

    const safeAreaStyles = {
        ...styles.container,
        paddingTop: Platform.OS === "android" ? 48 : 0,
        paddingBottom: Platform.OS === "android" ? 16 : 0,
    }

    // render

    return (
        fontsLoaded ?
            <SafeAreaView style={safeAreaStyles}>
                {children}
            </SafeAreaView>
        :
        <></>
    )

}

export default ScreenContainer