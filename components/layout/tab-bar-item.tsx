import { MaterialTopTabDescriptorMap, MaterialTopTabNavigationEventMap } from "@react-navigation/material-top-tabs/lib/typescript/src/types";
import { NavigationHelpers, ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native"

import styles from "@styles/components/layout/tar-bar-item.scss"
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faDownload, faFolder, faHome, faWaveSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface Props {
    index: number;
    state: TabNavigationState<ParamListBase>;
    descriptors: MaterialTopTabDescriptorMap;
    navigation: NavigationHelpers<ParamListBase, MaterialTopTabNavigationEventMap>;
}

const TabBarItem = (
    {
        index,
        state,
        descriptors,
        navigation
    }: Props
) => {

    // route data

    const route = state.routes[index];

    const { options } = descriptors[route.key];

    const label = options.tabBarLabel?.toString() || options.title || route.name;

    // associate labels with icons

    const icons: { [key: string]: IconProp } = {
        'Home': faHome,
        'Records': faFolder,
        'Transform': faWaveSquare,
        'Saved': faDownload
    }

    // utils

    const getBackgroundColor = () => state.index === index ? 'rgba(255,255,255,0.02)' : 'transparent';

    const getColor = () => state.index === index ? '#fff' : 'rgba(255,255,255,0.4)';

    // handlers

    // navigate to the tab when it is pressed

    const onPress = () => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        })

        if (state.index != index && !event.defaultPrevented) {
            // @ts-ignore
            navigation.navigate({ name: route.name, merge: true });
        }
    }

    // render

    return (
        <TouchableOpacity 
            style={{
                ...styles.item,
                backgroundColor: getBackgroundColor()
            }}
            onPress={onPress}>
            <FontAwesomeIcon icon={icons[label]} color={getColor()} size={20} />
            <Text 
                style={{
                    ...styles.label,
                    color: getColor()
                }}>
                {label}
            </Text>
        </TouchableOpacity>
    )

}

export default TabBarItem