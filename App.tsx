import { Dimensions, SafeAreaView, ScrollView, View } from 'react-native'; // todo: move this
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActivityIndicator, Chip, Modal, Provider as PaperProvider, Text } from 'react-native-paper'
import { Client } from "@notionhq/client"
import * as Device from 'expo-device';
import vanjacloud, { AzureTranslate, ThoughtDB } from "vanjacloud.shared.js";
import { TranslatedView } from "./TranslatedView";
import { MainView } from "./MainView";

import { Button } from 'react-native-paper';
import { VanjaCloudClient } from "./VanjaCloudClient";

process.env['DEBUG'] = 'true'

const Keys = vanjacloud.Keys;
Keys.openai = process.env.OPENAI_API_KEY; // todo.. idk why this isnt being loaded, some build crap

const notion = new Client({
    auth: Keys.notion
})

const dbid = Device.isDevice ? ThoughtDB.proddbid : ThoughtDB.testdbid;

const translate = new AzureTranslate(Keys.azure.translate);

export const isProd = true;

const vanjaCloudClient = new VanjaCloudClient()

const windowWidth = Dimensions.get('window').width;
const cellWidth = windowWidth * 0.8 / 4;


function ShareableModalPopup({text, onClose}) {
    return (<Modal visible={text != null && text != undefined}>
                <View style={{
                    // flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 7
                }}>
                    <View style={{
                        margin: 20,
                        backgroundColor: "white",
                        borderRadius: 20,
                        padding: 35,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                        maxHeight: '80%',
                        height: '100%',
                        width: '95%'
                    }}>
                        <ScrollView>
                            <Text>{text}</Text>

                        </ScrollView>

                        <Button onPress={() => onClose()}>Ok</Button>
                        {/*<Button>Save</Button>*/}
                        {/*<Button>Share</Button>*/}
                    </View>
                </View>
            </Modal>)
}

export default function App() {
    const [text, setText] = useState('unset');
    const [inputText, setInputText] = useState('');
    const [saving, setSaving] = useState(false);
    const [errorText, setErrorText] = useState(null);
    const [translatedText, setTranslatedText] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const [languageRetrospectiveText, setLanguageRetrospectiveText] = useState(null);

    async function saveIt(text: string, categoryEmoji?) {
        categoryEmoji = categoryEmoji || '🐿️';
        console.log('saving', text)
        const response = await notion.pages.create({
            icon: {
                type: "emoji",
                emoji: categoryEmoji
            },
            parent: {
                type: "database_id",
                database_id: dbid
            },
            properties: {
                title: [
                    {
                        text: {
                            content: text
                        }
                    }
                ]
            }
        });
        return text;
    }

    async function onPressSave() {
        try {
            setSaving(true)
            let r = await saveIt(inputText);
            console.log('saved it', r)
            setInputText('');
        } catch (error) {
            console.error(error)
            setErrorText('error: ' + JSON.stringify(error));
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
            setErrorText('error: ' + JSON.stringify(e));
        }
        setSaving(false)
    }

    function handlePressBack() {
        setShowTranslation(false);
    }

    async function handleSaveTranslation(translations, preferredLanguage) {
        setSaving(true);
        await saveIt(JSON.stringify({ translations, preferredLanguage }), '👻');
        setShowTranslation(false);
        setSaving(false);
    }

    async function languageRetrospective() {
        setSaving(true);
        try {
            setLanguageRetrospectiveText('thinking...')
            const r = await vanjaCloudClient.languageRetrospective('es')
            console.log('r',r)
            setLanguageRetrospectiveText(r.response)
        } catch (e) {
            console.log(e, JSON.stringify(e))
            setLanguageRetrospectiveText(JSON.stringify(e))
        }
        setSaving(false);
    }

    async function retrospective() {
        setSaving(true);
        try {
            setLanguageRetrospectiveText('thinking...')
            const r = await vanjaCloudClient.retrospective()
            console.log('r',r)
            setLanguageRetrospectiveText(r.response)
        } catch (e) {
            console.log(e, JSON.stringify(e))
            setLanguageRetrospectiveText(JSON.stringify(e))
        }
        setSaving(false);
    }

    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }}>

                {saving && <ActivityIndicator size="small" color="#AAAAAA"/>}
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
                <View>
                    <Button onPress={() => retrospective()}>Week Retrospective</Button>
                    <Button onPress={() => languageRetrospective()}>Language Retrospective</Button>
                </View>
                <ShareableModalPopup text={languageRetrospectiveText} onClose={() => setLanguageRetrospectiveText(null)}/>
            </SafeAreaView>
        </PaperProvider>
    );
}


async function debug() {

    return
}

debug()
