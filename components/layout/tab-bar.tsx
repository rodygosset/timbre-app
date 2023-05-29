import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs"
import { SafeAreaView } from "react-native"

import styles from "@styles/components/layout/tab-bar.scss"
import { LinearGradient } from "expo-linear-gradient"
import TabBarItem from "./tab-bar-item"
import { useEffect } from "react"



const TabBar = (
    {
        state,
        descriptors,
        navigation
    }: MaterialTopTabBarProps
) => {

    // render

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#191919', 'rgba(25,25,25,0)']}
                style={styles.background}
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 0 }}
            />
            {
                // loop over the routes
                state.routes.map((route, index) => (
                    <TabBarItem
                        key={route.key}
                        index={index}
                        descriptors={descriptors}
                        state={state}
                        navigation={navigation}
                    />
                ))
            }
        </SafeAreaView>
    )



}

export default TabBar