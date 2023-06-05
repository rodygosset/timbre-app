import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { Dimensions, Text, View } from "react-native"
import { AudioFileType, Context } from "@utils/context";
import React, { useContext, useEffect, useRef, useState } from "react";

import styles from "@styles/components/audio-player-modal.scss"
import Button from "./button";
import { faArrowRotateLeft, faCircle, faPause, faPlay, faTimes, faTrash, faWaveSquare } from "@fortawesome/free-solid-svg-icons";
import { Audio } from "expo-av";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";


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

    const snapPoints = [375]

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


    const getTimeString = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
        const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`
        return `${minutesString}:${secondsString}`
    }

    // button handlers

    const handleClose = () => {
        setIsPlaying(false)
        sound?.unloadAsync()
        setSound(null)
        setProgress(0)
        bottomSheetModalRef.current?.dismiss()
    }

    // delete the audio file from the list

    // first retrieve the list of audio files from the context

    const { recordings, setRecordings, transformedRecordings, setTransformedRecordings } = useContext(Context)

    const handleDelete = () => {
        if(!audio) return
        if(savedAudioMode) {
            setTransformedRecordings(transformedRecordings.filter((recording) => recording.uri !== audio.uri))
        } else {
            setRecordings(recordings.filter((recording) => recording.uri !== audio.uri))
        }

        handleClose()
    }

    const handleRestart = () => {
        if(!audio) return
        sound?.setPositionAsync(0)
    }

    const handlePlayPause = () => {
        if(!audio || !sound) return
        // pause or play the audio depending on its current state
        isPlaying ? sound.pauseAsync() : sound.playAsync()
        // update the progress every 50ms
        sound.setProgressUpdateIntervalAsync(50)
        sound.setOnPlaybackStatusUpdate((status) => {
            if(!status.isLoaded) return
            const { positionMillis, durationMillis } = status
            // keep track of the progress
            setProgress(positionMillis / 1000)
            // stop the audio when it reaches the end
            if(positionMillis === durationMillis) {
                setIsPlaying(false)
            }
        })
        setIsPlaying(!isPlaying)
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
                    <View style={styles.progress}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressIndicator, { flexBasis: `${progress * 100 / audio.duration}%` }]}/>
                        </View>
                        <View style={styles.timeIndicators}>
                            <Text style={styles.timeIndicator}>{ getTimeString(progress) }</Text>
                            <Text style={styles.timeIndicator}>{ getTimeString(audio.duration) }</Text>
                        </View>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Button 
                            round
                            width={60}
                            height={60}
                            role="tertiary"
                            icon={faArrowRotateLeft}
                            iconSize="small"
                            onPress={handleRestart}
                        />

                        <Button 
                            round
                            width={60}
                            height={60}
                            role="secondary"
                            icon={isPlaying ? faPause : faPlay}
                            iconSize="medium"
                            onPress={handlePlayPause}
                        />

                        <Button 
                            round
                            width={60}
                            height={60}
                            icon={faTrash}
                            role="tertiary"
                            iconSize="small"
                            onPress={handleDelete}
                        />
                    </View>
                    {
                        !savedAudioMode ?
                        <Button 
                            fullWidth
                            title="Transform"
                            icon={faWaveSquare}
                            onPress={() => {}}
                        />
                        :
                        <></>
                    }
                </View>
            </BottomSheetModal>
            :
            <></>
        }
        </>

    )

}

export default React.forwardRef(AudioPlayerModal)