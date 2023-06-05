import { Text, Pressable, View } from "react-native";

import styles from "@styles/components/picker.scss";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useContext, useRef, useState } from "react";
import { Context } from "@utils/context";
import { Picker } from "@react-native-picker/picker";


const ModelPicker = () => {

    // keep track of whether the picker is open

    const [isOpen, setIsOpen] = useState(false)

    // get the models from the context

    const { models, selectedModel, setSelectedModel } = useContext(Context)


    // handlers

    const pickerRef = useRef<Picker<string | null>>(null)

    const handlePress = () => {
        setIsOpen(() => {
            !isOpen ? pickerRef.current?.focus() : pickerRef.current?.blur()
            return !isOpen
        })
    }

    const handleSelect = (model: string | null) => {
        setSelectedModel(model)
        setIsOpen(false)
    }

    // render

    return (
        <>
            <Pressable style={styles.container} onPress={handlePress}>
                <Text style={ selectedModel ? styles.text : styles.empty}>{ selectedModel || "Pick a transformation model" }</Text>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} style={styles.icon} />
            </Pressable>
            {
                isOpen ?
                <View style={styles.options}>
                {
                    models.map((model, index) => (
                        <Pressable 
                            style={selectedModel != model ? styles.optionContainer : {...styles.optionContainer, ...styles.optionSelected}} 
                            key={index}
                            onPress={() => handleSelect(model)}>
                            <Text style={selectedModel != model ? styles.optionText : { ...styles.optionText, ...styles.optionTextSelected }}>{model}</Text>
                        </Pressable>
                    ))
                }
                </View>
                :
                <></>
            }
        </>
    )

}

export default ModelPicker