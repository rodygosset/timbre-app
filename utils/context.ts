
import React from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';


export interface AudioFileType {
    uri: string;
    duration: number; // in seconds
    name: string;
    date: Date;
}

export interface ListOfRecordingsProps {
    date: Date;
    recordings: AudioFileType[];
}


// Context API configuration

export interface AppContextType {
    recordings: AudioFileType[]; // list of recordings
    setRecordings: (recordings: AudioFileType[]) => void; 
    transformedRecordings: AudioFileType[]; // list of transformed recordings
    setTransformedRecordings: (transformedRecordings: AudioFileType[]) => void; 
    selectedRecording: AudioFileType | null; // the recording sent by the transform screen
    setSelectedRecording: (recording: AudioFileType | null) => void;
    models: string[]; // list of models
    setModels: (models: string[]) => void;
    selectedModel: string | null; // the model selected by the user
    setSelectedModel: (model: string | null) => void;
}

export const initContext: AppContextType = {
    recordings: [],
    setRecordings: () => {},
    transformedRecordings: [],
    setTransformedRecordings: () => {},
    selectedRecording: null,
    setSelectedRecording: () => {},
    models: [],
    setModels: () => {},
    selectedModel: null,
    setSelectedModel: () => {},
}

export const Context = React.createContext(initContext)




// Dealing with AsyncStorage

/**
 * Get the recordings from async storage
 * @returns Promise<AudioFileType[]> The list of recordings
 */

export const getPersistedRecordings = () => {
    return AsyncStorage.getItem('@recordings').then((res) => res != null ? JSON.parse(res) : []).then(recordings => {
        // convert the date string to Date object
        return recordings.map((recording: AudioFileType) => ({...recording, date: new Date(recording.date)}))
    }).catch(e => {
        console.log(e)
        return []
    }) as Promise<AudioFileType[]>
}

/**
 * Set the recordings in async storage
 * @param data The list of recordings
 * @returns Promise<void>
 */

export const setPersistedRecordings = (data: AudioFileType[]) => {
    return AsyncStorage.setItem('@recordings', JSON.stringify(data)).catch(e => {
        console.log(e)
    }).then(() => getPersistedRecordings())
}


/**
 * Get the transformed recordings from async storage
 * @returns Promise<AudioFileType[]> The list of transformed recordings
 */

export const getPersistedTransformedRecordings = () => {
    return AsyncStorage.getItem('@transformedRecordings').then((res) => res != null ? JSON.parse(res) : []).then(data => {
        return data.map((recording: AudioFileType) => ({ ...recording, date: new Date(recording.date) }))
    }).catch(e => {
        console.log(e)
        return []
    }) as Promise<AudioFileType[]>
}

/**
 * Set the transformed recordings in async storage
 * @param data The list of transformed recordings
 * @returns Promise<void>
 */

export const setPersistedTransformedRecordings = (data: AudioFileType[]) => {
    return AsyncStorage.setItem('@transformedRecordings', JSON.stringify(data)).catch(e => {
        console.log(e)
    }).then(() => getPersistedTransformedRecordings())
}
