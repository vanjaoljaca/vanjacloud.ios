import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';

import { Button, TextInput, Text, ActivityIndicator } from 'react-native-paper'

import vanjacloud from 'vanjacloudjs.shared';

import { Client } from "@notionhq/client"

import { Provider as PaperProvider } from 'react-native-paper';

import * as Device from 'expo-device';

import MyModule from 'vanjacloudjs.shared';

const notion = new Client({
    auth: vanjacloud.Keys.notion
})
const proddbid = '1ccbf2c452d6453d94bc462a8c83c200'
const testdbid = '4ef4fb0714c9441d94b06c826e74d5d3'

const dbid = Device.isDevice ? proddbid : testdbid;

async function test() {
    let res = await notion.databases.query({
        database_id: dbid,
    })
    let dbpage = await notion.pages.retrieve({
        page_id: res.results[0].id
    });
    console.log('--------')
    console.log(dbpage.object);
    console.log('--------')
    for (const result of res.results) {
        console.log(result.id);
        let props = (result as any).properties;
        console.log(Object.keys(props));
        try {
            console.log(props.Note.title[0].plain_text)
        } catch (e) {
            console.log('*************** BALSAMIC')
            console.log(props.Note)
        }
    }
    console.log('--------')
    return (res.results[0] as any).properties.Note.title[0].plain_text;
}

function Gap() {
    return <View style={{ height: 40 }} />
}

export default function App() {
    const [text, setText] = useState('unset');
    const [inputText, setInputText] = useState('');
    const [saving, setSaving] = useState(false);
    const [errorText, setErrorText] = useState(null);
    const [translatedText, setTranslatedText] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);

    async function doIt() {
        let r = await test();
        console.log('did it', r)
        setText(r);
    }

    async function saveIt(text: string) {
        console.log('saving', text)
        const response = await notion.pages.create({
            icon: {
                type: "emoji",
                emoji: "🐿️"
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
        // to the translatedText state variable
        setTranslatedText('Translated text');
        setShowTranslation(true);
    }

    function onPressBack() {
        setShowTranslation(false);
    }

    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, margin: '10% 30%' }}>
                    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                        <View style={{ marginTop: 100 }}>
                            <Text>Think here:</Text>
                            <TextInput
                                mode='outlined'
                                multiline={true}
                                onChangeText={text => setInputText(text)}
                                value={inputText}
                                label="Note"
                                height={200}
                            />
                        </View>
                        <Gap />
                        <Button
                            onPress={onPressSave}
                            mode="contained"
                        >
                            <Text>save</Text>
                            {saving && <ActivityIndicator size="small" color="#AAAAAA" />}
                        </Button>
                        <Gap />
                        {!showTranslation && (
                            <Button
                                onPress={translateText}
                                mode="contained"
                            >
                                <Text>translate</Text>
                            </Button>
                        )}
                        {showTranslation && (
                            <View>
                                <Text>Translated Text:</Text>
                                <Text>{translatedText}</Text>
                                <Gap />
                                <Button
                                    onPress={onPressBack}
                                    mode="contained"
                                >
                                    <Text>back</Text>
                                </Button>
                            </View>
                        )}
                        <StatusBar style="auto" />
                    </View>
                    <View style={{ height: 400 }}>
                        <Text style={{ color: '#FF9a9a' }}>{errorText}</Text>
                    </View>
                </View>
            </SafeAreaView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
