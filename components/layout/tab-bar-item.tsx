import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs"
import { TouchableOpacity } from "react-native"


interface Props extends MaterialTopTabBarProps {
    index: number;
}

const TabBarItem = (
    {
        index,
        state,
        descriptors,
        navigation,
    }: Props
) => {

    // render

    return (
        <TouchableOpacity>
            
        </TouchableOpacity>
    )

}

export default TabBarItem