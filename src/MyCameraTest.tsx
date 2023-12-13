import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { View, Button, Spinner, Text } from '@shoutem/ui';
import * as FileSystem from 'expo-file-system';
import * as azure from '@azure/storage-blob';
import { BlobServiceClient, StorageSharedKeyCredential, newPipeline } from '@azure/storage-blob';

import { hello } from '../modules/vanjacloud.ios.native';

console.log('hello:', hello)
console.log('result:', hello())

// let ExpoCamera;
// import('expo-camera').then(m => {
//     ExpoCamera = m;
// })
// .catch(e => {
//     console.log('failed to load expo camera', e);
//     ExpoCamera = null;
// })

import * as ExpoCamera from 'expo-camera';
console.log('sigh', ExpoCamera)
// let ExpoCamera;
// try {
//     ExpoCamera = require('expo-camera')
//     console.log('ExpoCamera loaded')
// } catch (e) {
//     console.log('failed to load expo-camera', e)
//     ExpoCamera = null;
// }

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

export function MyCameraTest() {
    const cameraRef = useRef<ExpoCamera.Camera | null>(null);


    const [isRecording, setIsRecording] = useState(false);
    const [videoURI, setVideoURI] = useState<string>(''); // URI del video grabado
    const [cameraDirection, setCameraDirection] = useState<ExpoCamera.CameraType>(ExpoCamera.CameraType.front);
    const [cameraVisible, setCameraVisible] = useState(true)
    const [cameraSmall, setCameraSmall] = useState(false)
    const [directEyesViewVisible, setDirectEyesViewVisible] = useState(false)
    const [camera4k, setCamera4k] = useState(false)

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
                quality: ExpoCamera.Constants.VideoQuality[
                    camera4k ? '2160p' : '1080p'
                ],
                maxFps: 60,
            };

            setIsRecording(true);

            try {
                const video = await cameraRef.current.recordAsync(videoConfig);

                // Guarda el video en un archivo temporal dentro de la aplicación
                const date = new Date();
                const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
                const tempVideoUri = `${FileSystem.documentDirectory}video_${formattedDate}.mp4`;

                await FileSystem.moveAsync({
                    from: video.uri,
                    to: tempVideoUri,
                });

                FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then((files) => {
                    console.log('files', files)
                })

                setVideoURI(tempVideoUri);

                console.log('recording saved', tempVideoUri)
            } catch (e) {
                // Error: Calling the 'record' function has failed
                // → Caused by: This operation is not supported on the simulator
                console.log('failed to record', e)
            }

            setIsRecording(false);
        } else {
            console.log('Camera being shit')
        }
    };

    const stopRecording = async () => {
        if (cameraRef.current) {
            try {
                await cameraRef.current.stopRecording();
                console.log('sent recording stop')
            } catch (e) {
                // Error: Calling the 'record' function has failed
                // → Caused by: This operation is not supported on the simulator
                console.log('failed to send stop record', e)
            }
        }
    };

    ExpoCamera.CameraType.front

    const flip = async () => {
        if (isRecording)
            await stopRecording(); // flip kills recording for some reason...

        setCameraDirection(cameraDirection == ExpoCamera.CameraType.front
            ? ExpoCamera.CameraType.back
            : ExpoCamera.CameraType.front)
    }

    const toggleVisible = () => {
        setCameraVisible(!cameraVisible)
    }

    const toggleSmall = () => {
        setCameraSmall(!cameraSmall)
    }

    const toggleDirectEyesView = () => {
        setDirectEyesViewVisible(!directEyesViewVisible);
    }

    function toggle4k() {
        setCamera4k(!camera4k);
    }

    return (
        <View style={{ flex: 1 }}>
            <ExpoCamera.Camera ref={cameraRef}
                type={cameraDirection}
                style={{
                    flex: cameraSmall ? 0 : 1, // if cameraSmall is true, don't take up the whole screen
                    width: cameraSmall ? 100 : 'auto', // if cameraSmall is true, set height to 160 dp
                    height: cameraSmall ? (100 * 16 / 9) : 'auto',
                    display: cameraVisible ? 'flex' : 'none'
                }}
                pictureSize={camera4k ? '3840x2160' : '1920:1080'}
                autoFocus={ExpoCamera.AutoFocus.on} />
                {/* //onFacesDetected */}

            <Spacer height={35} />

            
            <Button
                onPress={() => flip()}><Text>Flip</Text></Button>
            <Button onPress={() => toggleVisible()}><Text>Hide</Text></Button>
            <Button onPress={() => toggleSmall()}><Text>Small</Text></Button>
            <Button onPress={() => toggleDirectEyesView()}><Text>Direct</Text></Button>
            <Button onPress={() => toggle4k()}><Text>4k: {camera4k ? 'on' : 'off'}</Text></Button>

            <Button
                onPress={isRecording ? stopRecording : startRecording}>
                <Text>{isRecording ? 'Stop Recording 🔴' : 'Start Recording'}</Text>
            </Button>

            {directEyesViewVisible && (<View><Text>Directing Eyes Up!!</Text></View>)}
            {/* 
            <View style={{ backgroundColor: '#f00', flex: 1 }} />
             */}

        </View>
    );
}

async function run() {

}

run()