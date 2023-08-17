import { Dimensions, SafeAreaView, View } from 'react-native'; // todo: move this
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActivityIndicator, Chip, Provider as PaperProvider } from 'react-native-paper'
import { Client } from "@notionhq/client"
import * as Device from 'expo-device';
import vanjacloud, { AzureTranslate, ThoughtDB } from "vanjacloud.shared.js";
import { TranslatedView } from "./TranslatedView";
import { MainView } from "./MainView";

import { Button } from 'react-native-paper';
import { VanjaCloudClient } from "./VanjaCloudClient";
import { Gap } from './Gap';
import { ThoughtType } from 'vanjacloud.shared.js/dist/src/ThoughtDB';
import { MyCameraTest } from './MyCameraTest';
import { ShareableModalPopup } from './ShareableModalPopup';

import * as FileSystem from 'expo-file-system';

const Keys = vanjacloud.Keys;

const translate = new AzureTranslate(Keys.azure.translate);

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

        <View style={{ flex: 1 }}>
            {thinking && <ActivityIndicator size="small" color="#AAAAAA" />}
            <Button onPress={() => retrospective()}>Week Retrospective</Button>
            <Button onPress={() => languageRetrospective()}>Language Retrospective</Button>
            <ShareableModalPopup text={text} onClose={() => setText(null)} />
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
            let r = await translate.translate(inputText, {
                traceId: uuidv4()
            });
            setTranslatedText(r);
            setShowTranslation(true);
        } catch (e) {
            console.error(e)
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
            {saving && <ActivityIndicator size="small" color="#AAAAAA" />}
        </View>
    );
}


export default function App() {

    const [currentScreen, setCurrentScreen] = useState(0);

    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }}>
                { /* todo: tab thing */}
                {/* <Button onPress={(e) => setCurrentScreen(s => s + 1)}>next</Button> */}
                {currentScreen == 1 && <RetrospectivesScreen />}
                {currentScreen == 0 && <MainView2 />}
                {currentScreen == 2 && <MyCameraTest />}
            </SafeAreaView>
        </PaperProvider>
    );
}



async function debug() {

    const c = new CoolThing();
    await c.queueItem();
    return
}

debug()
