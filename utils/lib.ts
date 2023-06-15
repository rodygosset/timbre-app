import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

/**
 * Send a file to the server
 * @param uri The uri of the file to send
 * @returns Promise<FileSystem.UploadResult>
 */

export const sendFile = async (uri: string, model: string) => {
    return FileSystem.uploadAsync(`https://rave-server.rodygosset.dev/${model}/upload`, uri, {
        fieldName: 'file',
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: { filename: uri.split('/').pop()! }
    })
}

/**
 * Download a file from the server
 * @returns Promise<string> The uri of the downloaded file
 */
export const downloadFile = async () => {
    const newFileName = `timbre-app-result-${new Date().toISOString()}.wav`

    // Download file
    const { uri } = await FileSystem.downloadAsync("https://rave-server.rodygosset.dev/download", FileSystem.documentDirectory + newFileName)

    return uri
}

/**
 * Get the duration of an audio file
 * @param uri The uri of the audio file
 * @returns Promise<number> The duration of the audio file in seconds
 */

export const getAudioDuration = async (uri: string) => {
    const sound = await Audio.Sound.createAsync({ uri })
    const status = await sound.sound.getStatusAsync()
    return status.isLoaded ? (status.durationMillis || 0) / 1000 : 0
}