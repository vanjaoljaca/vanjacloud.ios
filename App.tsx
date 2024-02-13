import { AppState, AppStateStatus, Dimensions, SafeAreaView } from 'react-native'; // todo: move this
import React, { useEffect, useState } from 'react';
import { View, Button, Text } from '@shoutem/ui';
import { Client } from "@notionhq/client"
import * as Device from 'expo-device';
import vanjacloud, { AzureTranslate, Thought } from "vanjacloud.shared.js";
const ThoughtDB = Thought.ThoughtDB
export const ThoughtType = Thought.ThoughtType

import { VanjaCloudClient } from "./src/utils/VanjaCloudClient";
import { Gap } from './src/views/Gap';
import { MyCameraTest, Spacer } from './src/tabs/MyCameraTest';
import { ShareableModalPopup } from './src/utils/ShareableModalPopup';
import { Screen, NavigationBar, Row, Title, Icon } from '@shoutem/ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import { mediaDevices, RTCView } from 'react-native-webrtc';

/*
TODO:
@config-plugins/react-native-siri-shortcut
quick-actions
/* TODO:
- mock the save translation thing, and others
- center bottom bar
- translate while typing
- fix translation view when text is long
- move translation thing into its own thing (really save will be its own breakout)
- Add slide mechanics
- Fix Back & done button by merging into 1

- test camera on device
- roll out on dev on old iphone
- roll out prod to new iphone

quick look up conjugations
*/


import * as FileSystem from 'expo-file-system';

const Keys = vanjacloud.Keys;
import uuid from 'react-native-uuid';

class MockTranslate {
    translate(text: string, opts?: {
        to?: string[];
        from?: string;
        traceId?: string;
    }): Promise<Translation[]> {
        let result = Array.of('en', 'es').map(lang => {
            return {
                text: lang + ': ' + text,
                to: lang
            }
        });
        console.log('created translation result', result)
        return Promise.resolve(result)
    }
}

export const translate = Config.isMock
    ? new MockTranslate()
    : new AzureTranslate(Keys.azure.translate,
        {
            traceIdGenerator: () => uuid.v4() as string
        }
    );

export const thoughtDb = new ThoughtDB(Keys.notion,
    Device.isDevice ? ThoughtDB.proddbid : ThoughtDB.testdbid);

export const vanjaCloudClient = new VanjaCloudClient()

const windowWidth = Dimensions.get('window').width;

class path {
    static join(a: string, b: string) {
        if (a.endsWith('/'))
            return a + b;
        return a + '/' + b;
    }
}

class CoolThing {

    private items: [];

    async queueItem() {

        const UploadQueue = 'UploadQueue'
        const UploadDirectory = path.join(FileSystem.documentDirectory, UploadQueue);

        const contents = await FileSystem.readDirectoryAsync(UploadDirectory);
        if (contents == null)
            await FileSystem.makeDirectoryAsync(UploadDirectory)
        console.log(contents);
        // FileSystem.createUploadTask()
        const jobName = new Date().toISOString() + '.job';
        const jobData = {
            test: true
        };
        await FileSystem.writeAsStringAsync(path.join(UploadDirectory, jobName), JSON.stringify(jobData))

    }
}

// import { MyScreen } from './src/MyScreen';
import Config from './src/Config';
import { Translation } from 'vanjacloud.shared.js/dist/src/AzureTranslate';
import { MainView2 } from './src/tabs/MainView2';
import { RetrospectivesScreen } from './src/tabs/RetrospectivesScreen';
import Microphoner from './src/tabs/Microphoner';
import SoundEffects from './src/utils/SoundEffects';




export default function App() {

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {

        // todo: this only fires if the app was running, 
        // does not fire on first run

        // this only works inside this component obviously
        if (nextAppState === 'active') {
            // microphoner.start();
            console.log('App has been opened or come to the foreground');
            if (microphoner.isRecording)
                await microphoner.stopAndSave();
            else
                await microphoner.start();
            setIsRecording(microphoner.isRecording);
        } else if (nextAppState === 'background') {
            if (microphoner.isRecording)
                microphoner.stopAndSave();
            console.log('App has gone to the background');
        }
    };

    // const hasCam = false;
    const [index, setIndex] = useState(1);
    const routes = [
        { key: 'launcher', title: '', component: <Launcher /> },
        { key: 'text-input', title: '(input)', component: <MainView2 /> },
        { key: 'retrospectives', title: '(retrospectives)', component: <RetrospectivesScreen /> },
        { key: 'camera', title: '(camera)', component: <MyCameraTest /> }
    ];

    const CurrentRoute = routes[index].component;


    const [microphoner, _] = useState<Microphoner | null>(() => new Microphoner());
    const [isRecording, setIsRecording] = useState(microphoner.isRecording);
    function Launcher() {
        /*
        sound record toggle & indicator ( & play?)
        quick add text / translate button -> input screen
        later: quick selfie video
        */
        return (<View>
            <Spacer height={35} />
            <Button onPress={async () => {
                if (microphoner.isRecording)
                    await microphoner.stopAndSave();
                else
                    await microphoner.start();
                setIsRecording(microphoner.isRecording);
            }}><Text>{microphoner.isRecording ? 'stop 🔴' : 'record'}</Text></Button>
            <Button onPress={async () => {
                if (microphoner.isRecording)
                    await microphoner.stopAndSave();
                setIsRecording(microphoner.isRecording);
                setIndex(1)
            }}><Text>Write Text</Text></Button>
            <Spacer height={35} />
            <Button onPress={async () => {
                await SoundEffects.playBoop();
            }}><Text>boop</Text></Button>
            <Text>Selfie Cam</Text>
            <Text>Fwd Cam</Text>
        </View>)
    }

    async function stopRecording() {
        if (microphoner.isRecording)
            await microphoner.stopAndSave();
        setIsRecording(microphoner.isRecording);
    }

    async function abandonRecording() {
        if (microphoner.isRecording)
            await microphoner.abandon();
        console.log('abandoned', microphoner.isRecording)
        setIsRecording(microphoner.isRecording);
    }

    const [m, setM] = useState(true);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Screen>
                    <NavigationBar
                        //   style={{ backgroundColor: 'blue' }}
                        //   leftComponent={<Text>text</Text>}
                        centerComponent={
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Button onPress={() => setIndex(0)}><Title>☁️ vanjacloud </Title></Button>
                                {isRecording && (
                                    <>
                                        <Button onPress={() => abandonRecording()}>
                                            <Title>🚫</Title>
                                        </Button>
                                        <Button onPress={() => stopRecording()}>
                                            <Title>✅</Title>
                                        </Button>

                                    </>
                                )}
                            </View>}

                    // styleName="inline"
                    />
                    <View style={{ flex: 9 }} onPress={() => {
                        {
                            console.log('caught!!!')
                            abandonRecording()
                        }
                    }}>
                        {/* <div style={{ backgroundColor: '#f00' }}> */}
                        {CurrentRoute}
                        {/* </div> */}
                    </View>

                    {/* Bottom Tabs */}
                    <Row styleName="small" style={{ flex: 1 }}>
                        {routes.map((route, idx) => (
                            <Button styleName="clear" key={idx} onPress={() => setIndex(idx)}>
                                <Text>{route.title}</Text>
                            </Button>
                        ))}
                    </Row>

                </Screen>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}

console.log('ABOU TTO LOAD BRIDGE')

import { BridgeServer } from 'react-native-http-bridge-refurbished';
import { Modal } from 'react-native';


async function debug() {

    console.log('DEBUG CALLED!!')
    // const port = 3000;
    // const wss = new WebSocket.Server({ port });

    // wss.on('connection', (ws) => {
    //   ws.on('message', (message) => {
    //     // Broadcast the message to all clients except the sender
    //     wss.clients.forEach(client => {
    //       if (client !== ws && client.readyState === WebSocket.OPEN) {
    //         client.send(message);
    //       }
    //     });
    //   });
    // });

    // console.log(`WebRTC signaling server running on port ${port}`);
    // var httpBridge = require('react-native-http-bridge');
    // httpBridge.start(5561, 'http_service', request => {

    //   // you can use request.url, request.type and request.postData here
    //   if (request.type === "GET" && request.url.split("/")[1] === "users") {
    //     httpBridge.respond(request.requestId, 200, "application/json", "{\"message\": \"OK\"}");
    //   } else {
    //     httpBridge.respond(request.requestId, 400, "application/json", "{\"message\": \"Bad Request\"}");
    //   }

    // });

    // const server = new BridgeServer('http_service', true);
    // server.get('/', async (req, res) => {
    //   // do something
    //   console.log('got request', req)
    //   return { message: 'OK' }; // or res.json({message: 'OK'});
    // });
    // console.log('starting server')
    // try {
    //   server.listen(3000);
    // }
    // catch (e) {
    //   console.log('error', e)
    // }
    // console.log('listening on port 3000')

    const c = new CoolThing();
    // await c.queueItem();
    return
}

debug()
