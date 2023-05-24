import { ScreenProps } from '@utils/types';
import ScreenContainer from '@components/screen-container';
import Brand from '@components/brand';

const Home = ({ navigation }: ScreenProps) => {


    // render

    return (
        <ScreenContainer>
            <Brand />
        </ScreenContainer>
    )
}

export default Home