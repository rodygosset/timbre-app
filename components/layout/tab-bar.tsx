import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs"
import { SafeAreaView, Text } from "react-native"

import styles from "@styles/components/layout/tab-bar.scss"
import { LinearGradient } from "expo-linear-gradient"



const TabBar = (
    {
        state,
        descriptors,
        navigation,
        position
    }: MaterialTopTabBarProps
) => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#191919', 'rgba(25,25,25,0)']}
                style={styles.background}
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 0 }}
            />
            <Text>Hey</Text>
        </SafeAreaView>
    )



}

export default TabBar