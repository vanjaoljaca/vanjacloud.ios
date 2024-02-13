import { BackHandler, Button, View } from 'react-native';
import { Audio, InterruptionModeIOS } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import vanjacloud from "vanjacloud.shared.js";

import { Thought } from 'vanjacloud.shared.js';
import SoundEffects from '../utils/SoundEffects';
import { RecordingOptionsPresets } from 'expo-av/build/Audio';
const Keys = vanjacloud.Keys;

import { Buffer } from 'buffer';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { VanjaCloudClient } from '../utils/VanjaCloudClient';

const BACKGROUND_FETCH_TASK = 'background-upload-task';

export const vanjaCloudClient = new VanjaCloudClient()

var uploadFilesTaskLock = false;
async function uploadFilesTask() {

    console.log('Background task started', { uploadFilesTaskLock })
    if (uploadFilesTaskLock) {
        return
    };

    uploadFilesTaskLock = true;
    try {

        const files = await FileSystem.readDirectoryAsync(Directories.saved);
        console.log('Background task started', { files })

        for (const file of files) {
            const startTime = performance.now();
            const uri = `${Directories.saved}${file}`;
            console.log('Uploading', uri);
            const r = await vanjaCloudClient.uploadAudio(uri);


            if (r == false) {
                continue;
            }

            await FileSystem.moveAsync({
                from: uri,
                to: `${Directories.uploaded}${uri.split('/').pop()}`,
            });

            console.log('Uploaded:', performance.now() - startTime, 'milliseconds');
        }

        uploadFilesTaskLock = false;

        return files.length > 0 ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (error) {
        uploadFilesTaskLock = false;
        console.error('Failed to upload files', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
}


TaskManager.defineTask(BACKGROUND_FETCH_TASK, uploadFilesTask);

async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60, // seconds
        stopOnTerminate: false,
        startOnBoot: true,
    });
}

registerBackgroundFetchAsync();

export const thoughtDb = new Thought.ThoughtDB(Keys.notion,
    Device.isDevice ? Thought.ThoughtDB.proddbid : Thought.ThoughtDB.testdbid);

class Directories {

    public static root = `${FileSystem.documentDirectory}audio/`;
    public static recording = `${Directories.root}recording/`;
    public static saved = `${Directories.root}saved/`;
    public static abandoned = `${Directories.root}abandoned/`;
    public static uploaded = `${Directories.root}uploaded/`;

    public static async init() {
        await FileSystem.makeDirectoryAsync(Directories.root, { intermediates: true })
        await FileSystem.makeDirectoryAsync(Directories.recording, { intermediates: true })
        await FileSystem.makeDirectoryAsync(Directories.saved, { intermediates: true })
        await FileSystem.makeDirectoryAsync(Directories.abandoned, { intermediates: true })
        await FileSystem.makeDirectoryAsync(Directories.uploaded, { intermediates: true })
    }
}


class AudioRecorder {
    private recording: Audio.Recording;

    get isRecording() {
        return this.recording != undefined && this.recording != null;
    }



    private currentAudioUri: string | null;

    constructor() {
        Directories.init();
    }

    async start() {
        try {
            await Audio.requestPermissionsAsync();

            await SoundEffects.playBoop(); // this has to be before the other stuff

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                interruptionModeIOS: InterruptionModeIOS.MixWithOthers
            });

            const { recording } = await Audio.Recording.createAsync(
                RecordingOptionsPresets.HIGH_QUALITY
            );

            this.recording = recording;

            // Guarda el video en un archivo temporal dentro de la aplicación
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

            this.currentAudioUri = `${Directories.recording}audio_${formattedDate}.mp3`;
            console.log('recording to', this.currentAudioUri)

            await FileSystem.moveAsync({
                from: recording._uri,
                to: this.currentAudioUri,
            });


        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    async stop2() {
        // just leave it in limbo, but stop so its saved
        this.recording?.stopAndUnloadAsync();
        this.recording = undefined;
        console.log('Recording stopped in limbo');
    };

    async stopAndSave() {
        const targetUri = Directories.saved + this.currentAudioUri.split('/').pop()
        await FileSystem.moveAsync({
            from: this.currentAudioUri,
            to: targetUri
        });
        this.recording?.stopAndUnloadAsync();
        this.recording = undefined;
        console.log('Recording stopped and saved');


        uploadFilesTask();
    };

    async abandon() {
        await FileSystem.moveAsync({
            from: this.currentAudioUri,
            to: Directories.abandoned + this.currentAudioUri.split('/').pop(),
        });



        this.recording?.stopAndUnloadAsync();
        this.recording = undefined;
        console.log('Recording abandoned');
    }
};

export default AudioRecorder;
