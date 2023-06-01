import { ScreenProps } from '@utils/types';
import ScreenContainer from '@components/screen-container';
import Brand from '@components/brand';
import Button from '@components/button';
import { faFileWaveform } from '@fortawesome/free-solid-svg-icons';
import RecordButton from '@components/record-button';
import { useState } from 'react';

import styles from '@styles/screens/home.scss';
import { View, Text } from 'react-native';

import FadingCircles from '@assets/fading-circles.svg';

const Home = ({ navigation }: ScreenProps) => {


    const [isRecording, setIsRecording] = useState(false)

    // render

    return (
        <ScreenContainer style={styles.screen}>
            <Brand />
            <View style={styles.recordButtonContainer}>
                <FadingCircles style={styles.circles} />
                <RecordButton
                    isRecording={isRecording}
                    onPress={() => setIsRecording(!isRecording)}
                />
            </View>
            <View style={styles.captionContainer}>
                <Text style={styles.caption}>Record a new sample of your voice</Text>
                <Text style={styles.subCaption}>Or</Text>
                <Button
                    icon={faFileWaveform}
                    title="Select an audio file"
                    role='secondary'
                    onPress={() => {}}
                />
            </View>
        </ScreenContainer>
    )
}

export default Home