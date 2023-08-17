import React, { useEffect, useRef, useState } from 'react';
import { Button, View, Alert } from 'react-native';
import expoCamera from 'expo-camera';

const AutoFocus = expoCamera?.AutoFocus;
const Camera = expoCamera?.Camera;

import { BlobServiceClient } from '@azure/storage-blob';
import * as FileSystem from 'expo-file-system';


/*
Todo:
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

const ConnectionString = 'DefaultEndpointsProtocol=https;AccountName=vanjacloud;AccountKey=H6vLpXx4w995rJh1qmlp/2NUWk2DaUCuHHMZ4rAwcqLQbZNXPar9wwg909ojGtUfTuBpPIgwmKoc+AStN2J5hQ==;EndpointSuffix=core.windows.net'
const TargetContainer = 'vanja'
const blobName = `video-${new Date().toISOString()}.mp4`;
const SasToken = 'sp=racwl&st=2023-08-08T11:29:47Z&se=2026-04-01T19:29:47Z&spr=https&sv=2022-11-02&sr=c&sig=SIDznVzjRiXHSVLkF%2FiAaS7dNeh26JKW9i33EMKZ4eY%3D'
const SasUrl = 'https://vanjacloud.blob.core.windows.net/vanja?sp=racwl&st=2023-08-08T11:29:47Z&se=2026-04-01T19:29:47Z&spr=https&sv=2022-11-02&sr=c&sig=SIDznVzjRiXHSVLkF%2FiAaS7dNeh26JKW9i33EMKZ4eY%3D'

export function MyCameraTest() {
    const cameraRef = useRef<Camera | null>(null);
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
                quality: Camera.Constants.VideoQuality['2160p'],
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
        const sasUrl = SasUrl; // Replace this with a call to your backend to get the SAS URL.
        const blockBlobUrl = new azure.BlobURL(sasUrl, azure.StorageURL.newPipeline(new azure.AnonymousCredential()));

        const fileContent = await FileSystem.readAsStringAsync(videoURI, { encoding: FileSystem.EncodingType.Base64 });
        const totalBlocks = Math.ceil(fileContent.length / blockSize);
        const blockIds = [];

        for (let i = 0; i < totalBlocks; i++) {
            const blockId = btoa(String(i).padStart(6, '0'));
            blockIds.push(blockId);
            const start = i * blockSize;
            const end = i < totalBlocks - 1 ? start + blockSize : fileContent.length;
            const blockData = Buffer.from(fileContent.substring(start, end), 'base64');

            await blockBlobUrl.stageBlock(blockId, blockData, blockData.length);
        }

        await blockBlobUrl.commitBlockList(blockIds.map((id) => ({ name: 'Uncommitted', value: id })));

        await FileSystem.deleteAsync(videoURI);
        setVideoURI('');
        Alert.alert('Video uploaded to Azure and temporary file deleted');
    };

    const blockSize = 4 * 1024 * 1024; // 4MB



    return (
        <View style={{ flex: 1 }}>
            <Camera ref={cameraRef}
                type={Camera.Constants.Type.back} style={{ flex: 1 }}
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