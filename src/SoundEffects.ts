
import { Audio } from 'expo-av';
import soundFile from '../assets/bloop.mp3';

export default {
    playBoop: () => playSound()
}

async function playSound() {
    const soundObject = new Audio.Sound();
    try {
        await soundObject.loadAsync(soundFile);
        await soundObject.playAsync();
        console.log('playing', soundFile)
    } catch (error) {
        // An error occurred!
        console.log('playSound', error)
    }
}