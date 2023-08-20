import { Dimensions, SafeAreaView } from 'react-native'; // todo: move this
import React, { useState } from 'react';
import { View, Button, Spinner, Text } from '@shoutem/ui';
import { Client } from "@notionhq/client"
import * as Device from 'expo-device';
import vanjacloud, { AzureTranslate, Thought } from "vanjacloud.shared.js";
const ThoughtDB = Thought.ThoughtDB
const ThoughtType = Thought.ThoughtType
import { TranslatedView } from "./TranslatedView";
import { MainView } from "./MainView";

import { VanjaCloudClient } from "./VanjaCloudClient";
import { Gap } from './Gap';
import { MyCameraTest } from './MyCameraTest';
import { ShareableModalPopup } from './ShareableModalPopup';
import {  Screen, NavigationBar, Row, Title, Icon } from '@shoutem/ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';



import * as FileSystem from 'expo-file-system';

const Keys = vanjacloud.Keys;
import uuid from 'react-native-uuid';

const translate = new AzureTranslate(Keys.azure.translate,
    {
        traceIdGenerator: () => uuid.v4() as string
    }
);

const thoughtDb = new ThoughtDB(Keys.notion,
    Device.isDevice ? ThoughtDB.proddbid : ThoughtDB.testdbid);

const vanjaCloudClient = new VanjaCloudClient()

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

function RetrospectivesScreen() {

    const [thinking, setThinking] = useState(false);
    const [text, setText] = useState<string>(null)


    async function languageRetrospective() {
        setThinking(true);
        try {
            setText('thinking...')
            const r = await vanjaCloudClient.languageRetrospective('es')
            console.log('r', r)
            setText(r.response)
        } catch (e) {
            console.log(e, JSON.stringify(e))
            setText(JSON.stringify(e))
        }
        setThinking(false);
    }

    async function retrospective() {
        setThinking(true);
        try {
            setText('thinking...')
            const r = await vanjaCloudClient.retrospective()
            console.log('r', r)
            setText(r.response)
        } catch (e) {
            console.log(e, JSON.stringify(e))
            setText(JSON.stringify(e))
        }
        setThinking(false);
    }

    return (
        
        <View styleName="flexible">
            {thinking && <Spinner styleName="small" />}
            <Button onPress={() => retrospective()}>
                <Text>Week Retrospective</Text>
            </Button>
            <Button onPress={() => languageRetrospective()}>
                <Text>Language Retrospective</Text>
            </Button>
            {/* <ShareableModalPopup text={text} onClose={() => setText(null)} /> */}
        </View>

    )
}

function MainView2() {
    const [inputText, setInputText] = useState('');
    const [saving, setSaving] = useState(false);
    const [errorText, setErrorText] = useState(null);
    const [translatedText, setTranslatedText] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);

    async function onPressSave(inputText, selectedTags) {
        try {
            setSaving(true)
            let r = await thoughtDb.saveIt2(inputText, ThoughtType.note, selectedTags);
            console.log('saved it', r)
            setInputText('');
        } catch (e) {
            console.error(e)
            setErrorText('error: ' + JSON.stringify(e, null, 2));
        }
        setSaving(false)
    }

    async function translateText() {
        // Call translation service here and set the translated text
        // to the translatedText
        // to the translatedText state variable
        try {
            setSaving(true)
            let r = await translate.translate(inputText);
            setTranslatedText(r);
            setShowTranslation(true);
        } catch (e) {
            console.error(JSON.stringify(e, null, 2))
            setErrorText('error: ' + JSON.stringify(e, null, 2));
        }
        setSaving(false)
    }

    function handlePressBack() {
        setShowTranslation(false);
    }

    async function handleSaveTranslation(translations, preferredLanguage?) {

        setSaving(true);
        const r = await thoughtDb.saveTranslation(translations, preferredLanguage)
        setSaving(false);
    }

    return (
        <View style={{ flex: 1 }}>
            {showTranslation ?
                <TranslatedView
                    translatedText={translatedText}
                    onPressBack={() => setShowTranslation(false)}
                    onPressSave={handleSaveTranslation}
                /> :
                <MainView

                    inputText={inputText}
                    setInputText={setInputText}
                    onPressSave={onPressSave}
                    saving={saving}
                    translateText={translateText}
                    errorText={errorText}
                    onClearErrorText={() => setErrorText(null)}
                />
            }
            {saving && <Spinner size="small" color="#AAAAAA" />}
        </View>
    );
}


import { MyScreen } from './MyScreen';

export default function App() {

    const [index, setIndex] = useState(0);
  const routes = [
    { key: 'first', title: 'Tab1', component: MainView2 },
    { key: 'second', title: 'Tab2', component: RetrospectivesScreen },
  ];

  const CurrentRoute = routes[index].component;

  return (
    <SafeAreaProvider>
    
     <SafeAreaView style={{ flex: 1 }}>
    <Screen>
      <NavigationBar
    //   style={{ backgroundColor: 'blue' }}
      leftComponent={<Text>text</Text>}
        centerComponent={<Title>vanjacloud</Title>}

        // styleName="inline"
      />
      <Row styleName="small" style={{ flex: 1 }}>
        {routes.map((route, idx) => (
          <Button styleName="clear" key={idx} onPress={() => setIndex(idx)}>
            <Text>{route.title}</Text>
          </Button>
        ))}
      </Row>
      <View style={{ flex: 9 }}>
        <CurrentRoute />
      </View>
    </Screen>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}


async function debug() {

    const c = new CoolThing();
    // await c.queueItem();
    return
}

debug()
