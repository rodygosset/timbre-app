import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Pressable, StyleProp, Text } from "react-native"


import styles from "@styles/components/button.scss"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";

interface Props {
    title?: string;
    style?: StyleProp<any>;
    width?: number;
    height?: number;
    icon?: IconProp;
    iconSize?: "small" | "medium";
    fullWidth?: boolean; 
    round?: boolean;
    role?: "primary" | "secondary" | "tertiary";
    onPress: () => void;
}

const Button = (
    {
        title,
        style,
        width,
        height = 50,
        icon,
        iconSize = "small",
        fullWidth,
        round,
        role = "primary",
        onPress
    }: Props
) => {

    // utils
    
    const getStyles = () => {
        let s = { ...styles.button, height: height }
        if(width) s = { ...s, width: width }
        if(style) s = { ...s, ...style }
        if(fullWidth) s = { ...s, ...styles.fullWidth }
        if(round) s = { ...s, ...styles.round }
        if(role == "primary") s = { ...s, ...styles.primary }
        else if(role == "secondary") s = { ...s, ...styles.secondary }
        else if(role == "tertiary") s = { ...s, ...styles.tertiary }
        return s
    }

    const getIconStyles = () => ({ ...styles.icon, ...styles[iconSize + "Icon"] })

    // state

    const [buttonStyles, setButtonStyles] = useState(getStyles())

    // handlers

    const onPressIn = () => setButtonStyles({ ...buttonStyles, ...styles[role + "Pressed"] })
    const onPressOut = () => setButtonStyles(getStyles())


    // render

    return (
        <Pressable
            style={buttonStyles}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}>
            {
                icon ?
                <FontAwesomeIcon icon={icon} style={getIconStyles()} />
                :
                <></>
            }
            {
                title ?
                <Text style={styles.title}>{title}</Text>
                :
                <></>
            }
        </Pressable>
    )
}

export default Button