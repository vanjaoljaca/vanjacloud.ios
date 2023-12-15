import React, { useState, useEffect } from 'react';
import { Button, View } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import vanjacloud, { AzureTranslate, Thought } from "vanjacloud.shared.js";

import { AppState } from 'react-native';


import { VanjaCloudClient } from "./VanjaCloudClient";
import { ThoughtDB } from 'vanjacloud.shared.js/dist/src/ThoughtDB';
import SoundEffects from './SoundEffects';
const Keys = vanjacloud.Keys;

const vanjaCloudClient = new VanjaCloudClient()
export const thoughtDb = new ThoughtDB(Keys.notion,
    Device.isDevice ? ThoughtDB.proddbid : ThoughtDB.testdbid);

console.log('audio2', Audio)

const AudioRecorder = () => {
    const [recording, setRecording] = useState<Audio.Recording>();

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            await SoundEffects.playBoop();
            setRecording(recording);

            // todo: play a boop sound

            // Guarda el video en un archivo temporal dentro de la aplicación
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
            const targetDir = `${FileSystem.documentDirectory}audio/`;

            await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true })

            const tempAudioUri = `${targetDir}audio_${formattedDate}.mp3`;
            console.log('recording to', tempAudioUri)

            await FileSystem.moveAsync({
                from: recording._uri,
                to: tempAudioUri,
            });


        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        recording?.stopAndUnloadAsync();
        const uri = recording?.getURI();
        setRecording(undefined);
        console.log('Recording stopped and stored at', uri);

        // todo: queue up to load to notion
        thoughtDb.saveIt2
    };

    return (
        <View>
            <Button title={recording ? 'Stop Recording 🔴' : 'Start Recording!'} onPress={recording ? stopRecording : startRecording} />
        </View>
    );
};

export default AudioRecorder;
