import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { View, Button, Spinner, Text } from '@shoutem/ui';

import Constants from 'expo-camera'

let expoCamera;
try {
    expoCamera = require('expo-camera')
} catch (e) {
    console.log('failed to load expo-camera', e)
    expoCamera = null;
}

/*
Todo:
- confirm that camera works on device with these hax
- record, switch camera, focus?
- merge with other app parts
- upload
- uploader screen
- resume

*/

// Componente Spacer
export const Spacer = ({ height }: { height: number }) => {
    return <View style={{ height }} />;
};

const ConnectionString = 'rotated'
const TargetContainer = 'vanja'
const blobName = `video-${new Date().toISOString()}.mp4`;
const SasToken = 'rotated'
const SasUrl = 'rotated'

export function MyCameraTest() {

    if (!expoCamera) {
        return <MyCameraTestDummy />
    }

    return <MyCameraTestReal />
}

export function MyCameraTestDummy() {
    return <Text>bad</Text>
}

export function MyCameraTestReal() {
    let expoCameraX = expoCamera as any
    const cameraRef = useRef<Constants.Camera | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [videoURI, setVideoURI] = useState<string>(''); // URI del video grabado

    useEffect(() => {
        if (cameraRef?.current == null) return;

        cameraRef.current.getAvailablePictureSizesAsync('4:3')
            .then((sizes) => {
                console.log(sizes)
            });

    }, [])

    const startRecording = async () => {
        if (cameraRef.current) {

            const videoConfig = {
                quality: expoCamera.Constants.VideoQuality['2160p'],
                maxFps: 60,
            };
            setIsRecording(true);
            const video = await cameraRef.current.recordAsync(videoConfig);

            // Guarda el video en un archivo temporal dentro de la aplicación
            const tempVideoUri = FileSystem.documentDirectory + 'tempRecordedVideo3.mp4';
            await FileSystem.moveAsync({
                from: video.uri,
                to: tempVideoUri,
            });

            FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then((files) => {
                console.log('files', files)
            })

            setVideoURI(tempVideoUri);

            console.log('recording saved', tempVideoUri)
        } else {
            console.log('Camera being shit')
        }
    };

    const stopRecording = () => {
        if (cameraRef.current) {
            cameraRef.current.stopRecording();
            setIsRecording(false);
            console.log('recording stopped')
        }
    };

    const uploadToAzure = async (videoURI) => {
        // const sasUrl = SasUrl; // Replace this with a call to your backend to get the SAS URL.
        // const blockBlobUrl = new azure.BlobURL(sasUrl, azure.StorageURL.newPipeline(new azure.AnonymousCredential()));

        // const fileContent = await FileSystem.readAsStringAsync(videoURI, { encoding: FileSystem.EncodingType.Base64 });
        // const totalBlocks = Math.ceil(fileContent.length / blockSize);
        // const blockIds = [];

        // for (let i = 0; i < totalBlocks; i++) {
        //     const blockId = btoa(String(i).padStart(6, '0'));
        //     blockIds.push(blockId);
        //     const start = i * blockSize;
        //     const end = i < totalBlocks - 1 ? start + blockSize : fileContent.length;
        //     const blockData = Buffer.from(fileContent.substring(start, end), 'base64');

        //     await blockBlobUrl.stageBlock(blockId, blockData, blockData.length);
        // }

        // await blockBlobUrl.commitBlockList(blockIds.map((id) => ({ name: 'Uncommitted', value: id })));

        // await FileSystem.deleteAsync(videoURI);
        // setVideoURI('');
        // Alert.alert('Video uploaded to Azure and temporary file deleted');
    };

    const blockSize = 4 * 1024 * 1024; // 4MB



    return (
        <View style={{ flex: 1 }}>
            <expoCamera.Camera ref={cameraRef}
                type={expoCamera.Constants.Type.back} style={{ flex: 1 }}
                pictureSize='3840x2160'

                autoFocus={AutoFocus.on} />
            <Button
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
                onPress={isRecording ? stopRecording : startRecording}
            />
            {!isRecording && videoURI && <Button title="Subir a Azure" onPress={uploadToAzure} />}
            <Spacer height={35} />
        </View>
    );
}

async function run() {

}

run()