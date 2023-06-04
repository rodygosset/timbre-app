import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { Text, View } from "react-native"
import { AudioFileType } from "@utils/context";
import React, { useEffect, useRef, useState } from "react";

import styles from "@styles/components/audio-player-modal.scss"
import Button from "./button";
import { faArrowRotateLeft, faPause, faPlay, faTimes, faTrash, faWaveSquare } from "@fortawesome/free-solid-svg-icons";
import { Audio } from "expo-av";


interface Props {
    audio?: AudioFileType;
    index: number;
    toggler: boolean;
    savedAudioMode?: boolean;
}

const AudioPlayerModal = (
    {
        audio, 
        index,
        toggler,
        savedAudioMode
    }: Props,
    ref: React.Ref<BottomSheetModal>
) => {

    // bottom sheet modal audio player

    const bottomSheetModalRef = useRef<BottomSheetModal>(null)

    const snapPoints = [300]

    const handlePresentModalPress = () => {
        bottomSheetModalRef.current?.present()
    }

    // show the modal when the audio changes or when the toggler changes

    useEffect(() => {
        if(!audio) return
        handlePresentModalPress()
        Audio.Sound.createAsync({ uri: audio.uri }).then(({ sound }) => {
            setSound(sound)
        }).catch(console.log)
    } ,[audio, toggler])

    // handle the audio player

    const [isPlaying, setIsPlaying] = useState(false)
    const [sound, setSound] = useState<Audio.Sound | null>(null)
    const [progress, setProgress] = useState(0) // in seconds

    // unload sound on unmount

    useEffect(() => {
        return () => { sound?.unloadAsync() } 
    }, [sound])

    // helpers

    const dateOptions = { year: "numeric", month: "long", weekday: "long", day: "numeric" }
    // @ts-ignore
    const getDateString = () => (new Date(audio?.date)).toLocaleDateString("en-US", dateOptions)


    // handlers

    const handleClose = () => {
        setIsPlaying(false)
        sound?.unloadAsync()
        setSound(null)
        setProgress(0)
        bottomSheetModalRef.current?.dismiss()
    }

    // render

    return (
        <>
        {
            audio ?
            <BottomSheetModal 
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                style={{
                    zIndex: 1000
                }}
                backgroundStyle={styles.modalBackground}
                handleIndicatorStyle={styles.handleIndicator}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>Recording number { index + 1 }</Text>
                            <Text style={styles.date}>{ getDateString() }</Text>
                        </View>
                        <Button 
                            width={40}
                            height={40}
                            round
                            role="secondary"
                            icon={faTimes}
                            onPress={handleClose}
                        />
                    </View>
                    <View style={styles.buttonsContainer}>
                    {
                        !savedAudioMode ?
                        <>
                            <Button 
                                round
                                width={60}
                                height={60}
                                role="tertiary"
                                icon={faArrowRotateLeft}
                                iconSize="small"
                                onPress={() => {}}
                            />

                            <Button 
                                round
                                width={60}
                                height={60}
                                role="secondary"
                                icon={isPlaying ? faPause : faPlay}
                                iconSize="medium"
                                onPress={() => {}}
                            />

                            <Button 
                                round
                                width={60}
                                height={60}
                                icon={faTrash}
                                role="tertiary"
                                iconSize="small"
                                onPress={() => {}}
                            />
                        </>
                        :
                        <>
                            <Button 
                                round
                                width={60}
                                height={60}
                                role="tertiary"
                                icon={faTrash}
                                iconSize="small"
                                onPress={() => {}}
                            />

                            <Button 
                                round
                                width={60}
                                height={60}
                                role="secondary"
                                icon={isPlaying ? faPause : faPlay}
                                iconSize="medium"
                                onPress={() => {}}
                            />

                            <Button 
                                round
                                width={60}
                                height={60}
                                icon={faWaveSquare}
                                iconSize="small"
                                onPress={() => {}}
                            />
                        </>
                    }
                    </View>
                </View>
            </BottomSheetModal>
            :
            <></>
        }
        </>

    )

}

export default React.forwardRef(AudioPlayerModal)