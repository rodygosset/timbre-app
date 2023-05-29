import { Platform, SafeAreaView } from "react-native";
import styles from "@styles/components/screen-container.scss";

interface Props {
    children: React.ReactNode;
}

const ScreenContainer = (
    {
        children
    }: Props
) => {


    // manage safe area in Android

    const safeAreaStyles = {
        ...styles.container,
        paddingTop: Platform.OS === "android" ? 48 : 0,
        paddingBottom: Platform.OS === "android" ? 16 : 0,
    }

    // render

    return (
        <SafeAreaView style={safeAreaStyles}>
            {children}
        </SafeAreaView>
    )

}

export default ScreenContainer