import { View } from "react-native"

import styles from '@styles/components/animated-circle.scss'
import { useEffect, useState } from "react"

interface Props {
    on: boolean
}

const AnimatedCircle = ({ on }: Props) => {

    // state

    const [width, setWidth] = useState(120)

    const [interval, setCurrentInterval] = useState<NodeJS.Timer | null>(null)

    const maxWidth = 300

    useEffect(() => {
        // reset width to initial value

        setWidth(120)

        // clear interval if it exists

        if (interval) {
            clearInterval(interval)
            setCurrentInterval(null)
        }

        
        if (!on) return

        // animate width

        setCurrentInterval(setInterval(() => {
            setWidth(width => width < maxWidth ? width + 3 : 120)
        }, 1))
    }, [on])

    // render

    return (
        on ?
        <View style={styles.wrapper}>
            <View style={{...styles.circle, width: width, borderRadius: width, opacity: 1.2 - (width / maxWidth)}} />
        </View>
        :
        <></>
    )
}

export default AnimatedCircle