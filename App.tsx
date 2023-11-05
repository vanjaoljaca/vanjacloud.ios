import { Dimensions, SafeAreaView } from 'react-native'; // todo: move this
import React, { useState } from 'react';
import { View, Button, Text } from '@shoutem/ui';
import { Client } from "@notionhq/client"
import * as Device from 'expo-device';
import vanjacloud, { AzureTranslate, Thought } from "vanjacloud.shared.js";
const ThoughtDB = Thought.ThoughtDB
export const ThoughtType = Thought.ThoughtType

import { VanjaCloudClient } from "./src/VanjaCloudClient";
import { Gap } from './src/Gap';
import { MyCameraTest } from './src/MyCameraTest';
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
    }): Promise<[]> {
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

export default function App() {

    // const hasCam = false;
    const [index, setIndex] = useState(0);
    const routes = [
        { key: 'text-input', title: '(input)', component: <MainView2 /> },
        { key: 'retrospectives', title: '(retrospectives)', component: <RetrospectivesScreen /> },
        { key: 'camera', title: '(camera)', component: <MyCameraTest /> }
    ];

    const CurrentRoute = routes[index].component;

    return (
        <SafeAreaProvider>

            <SafeAreaView style={{ flex: 1 }}>
                <Screen>
                    <NavigationBar
                        //   style={{ backgroundColor: 'blue' }}
                        //   leftComponent={<Text>text</Text>}
                        centerComponent={<Title>☁️ vanjacloud</Title>}

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
