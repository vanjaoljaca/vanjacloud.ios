import { AppState, AppStateStatus, Dimensions, SafeAreaView } from 'react-native'; // todo: move this
import React, { useEffect, useState } from 'react';
import { View, Button, Text } from '@shoutem/ui';
import { Client } from "@notionhq/client"
import * as Device from 'expo-device';
import vanjacloud, { AzureTranslate, Thought } from "vanjacloud.shared.js";
const ThoughtDB = Thought.ThoughtDB
export const ThoughtType = Thought.ThoughtType

import { VanjaCloudClient } from "./src/VanjaCloudClient";
import { Gap } from './src/Gap';
import { MyCameraTest, Spacer } from './src/MyCameraTest';
import { ShareableModalPopup } from './src/ShareableModalPopup';
import { Screen, NavigationBar, Row, Title, Icon } from '@shoutem/ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';


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

import { MyScreen } from './src/MyScreen';
import Config from './src/Config';
import { Translation } from 'vanjacloud.shared.js/dist/src/AzureTranslate';
import { MainView2 } from './src/MainView2';
import { RetrospectivesScreen } from './src/RetrospectivesScreen';
import Microphoner from './src/Microphoner';
import SoundEffects from './src/SoundEffects';




export default function App() {

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {

        // this only works inside this component obviously
        if (nextAppState === 'active') {
            // microphoner.start();
            console.log('App has been opened or come to the foreground');
            if (microphoner.isRecording)
                await microphoner.stop();
            else
                await microphoner.start();
            setIsRecording(microphoner.isRecording);
        } else if (nextAppState === 'background') {
            if (microphoner.isRecording)
                microphoner.stop();
            console.log('App has gone to the background');
        }
    };

    // const hasCam = false;
    const [index, setIndex] = useState(0);
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
                    await microphoner.stop();
                else
                    await microphoner.start();
                setIsRecording(microphoner.isRecording);
            }}><Text>{microphoner.isRecording ? 'stop 🔴' : 'record'}</Text></Button>
            <Button onPress={async () => {
                if (microphoner.isRecording)
                    await microphoner.stop();
                setIsRecording(microphoner.isRecording);
                setIndex(1)
            }}><Text>Write Text</Text></Button>
            <Spacer height={35} />
            <Button onPress={async () => {
                await SoundEffects.playBoop();
            }}><Text>boop</Text></Button>
        </View>)
    }

    return (
        <SafeAreaProvider>

            <SafeAreaView style={{ flex: 1 }}>
                <Screen>
                    <NavigationBar
                        //   style={{ backgroundColor: 'blue' }}
                        //   leftComponent={<Text>text</Text>}
                        centerComponent={<Button onPress={() => setIndex(0)}><Title>☁️ vanjacloud </Title></Button>}

                    // styleName="inline"
                    />
                    <View style={{ flex: 9 }}>
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


async function debug() {

    const c = new CoolThing();
    // await c.queueItem();
    return
}

debug()
