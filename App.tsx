import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { AzureTranslate } from "vanjacloudjs.shared/dist/src/AzureTranslate";
import { v4 as uuidv4 } from 'uuid';
import { Button, TextInput, Text, ActivityIndicator, ProgressBar } from 'react-native-paper'
import vanjacloud from 'vanjacloudjs.shared';
import { Client } from "@notionhq/client"
import { Provider as PaperProvider } from 'react-native-paper';
import * as Device from 'expo-device';
import MyModule from 'vanjacloudjs.shared';
import { Clipboard } from "react-native"; // todo: move this
import { Menu, MenuItem } from 'react-native-paper';

const notion = new Client({
    auth: vanjacloud.Keys.notion
})
const proddbid = '1ccbf2c452d6453d94bc462a8c83c200'
const testdbid = '4ef4fb0714c9441d94b06c826e74d5d3'

const dbid = Device.isDevice ? proddbid : testdbid;

const translate = new AzureTranslate(vanjacloud.Keys.azure.translate);

async function test() {
    let res = await notion.databases.query({
        database_id: dbid,
    })
    let dbpage = await notion.pages.retrieve({
        page_id: res.results[0].id
    });
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
    return <View style={{height: 40}}/>
}

function MainView({inputText, setInputText, onPressSave, saving, translateText, errorText, onClearErrorText}) {

    const [menuVisible, setMenuVisible] = useState(false);
    let refInputText = useRef(null);

    function handleClearErrorText() {
        onClearErrorText();
    }

    return (
        <View style={{flex: 1, margin: '7% 0%'}}>
            {/* Top section for text input */}
            <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center'}}>
                <View style={{marginTop: 0}}>
                    <TextInput
                        ref={r => refInputText = r}
                        mode='outlined'
                        multiline={true}
                        onChangeText={text => setInputText(text)}
                        value={inputText}
                        label="Note"
                        height={200}
                        onLongPress={() => {
                            setMenuVisible(true);
                        }}
                    />
                    <Menu
                        // anchor={refInputText.current}
                        anchor={<Button onPress={() => setMenuVisible(true)}>Show menu</Button>}
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                    >
                        <Menu.Item
                            onPress={() => {
                                Clipboard.setString(inputText)
                                setMenuVisible(false);
                            }}
                            title='Copy'
                        />

                        <Menu.Item
                            onPress={() => {
                                setInputText('');
                                setMenuVisible(false);
                            }}
                            title='Clear'
                        />
                    </Menu>
                </View>
            </View>

            {/* Middle section for buttons */}
            <View>
                <Button
                    onPress={onPressSave}
                    mode="contained"
                >
                    <Text>save</Text>
                    {saving && <ActivityIndicator size="small" color="#AAAAAA"/>}
                </Button>
                <Gap/>
                <Button
                    onPress={translateText}
                    mode="contained"
                >
                    <Text>translate</Text>
                </Button>
            </View>

            {/* Bottom section for progress bar and error text */}
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {/* Add progress bar component here */}
                {/*<ProgressBar progress={0.5} color={'#3f51b5'} style={{height: 200}}/>*/}

                <View style={{height: 200, width: '100%'}}>
                    <Text style={{color: '#FF9a9a'}} onPress={handleClearErrorText}>{errorText}</Text>
                </View>
            </View>
        </View>
    );
}

import { Dimensions } from 'react-native';
import { DataTable } from 'react-native-paper';
import KeyboardDismisser from "./src/KeyboardDismisser";

const windowWidth = Dimensions.get('window').width;
const cellWidth = windowWidth * 0.8 / 4;

function TranslatedView({translatedText, onPressBack, onPressSave}) {
    const [expandedText, setExpandedText] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const screenHeight = Dimensions.get('window').height;
    const maxCellHeight = (screenHeight * 0.75) / translatedText.length;

    const styles = StyleSheet.create({
        expandedView: {
            marginTop: 10,
            height: 200,
            backgroundColor: '#fff'
        },
        expandedText: {
            padding: 10,
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        cell: {
            flex: 1,
            maxHeight: maxCellHeight,
        },
    });

    function handleSelectTargetTranslation(to) {
        setSelectedLanguage(to);
    }

    function handlePressSave() {
        onPressSave(translatedText, selectedLanguage);
    }

    function handleSingleTap(text) {
        setExpandedText(text);
    }

    function handleClose() {
        setExpandedText(null);
    }

    return (
        <>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Language</DataTable.Title>
                    <DataTable.Title>Translation</DataTable.Title>
                </DataTable.Header>

                {translatedText.map(t => (
                    <DataTable.Row key={t.to}>
                        <DataTable.Cell
                            style={[styles.cell, {backgroundColor: selectedLanguage === t.to ? '#ffe' : '#fff'}]}
                            onPress={() => handleSelectTargetTranslation(t.to)}>
                            {t.to}
                        </DataTable.Cell>
                        <DataTable.Cell
                            style={styles.cell}
                            onPress={() => setExpandedText(t.text)}
                            onLongPress={() => Clipboard.setString(t.text)}>
                            {t.text}
                            {/*{expandedText === t.text ? t.text : t.text.substring(0, 40) + '...'}*/}
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
            {expandedText && (
                <View style={styles.expandedView}>
                    <Text style={styles.expandedText}>{expandedText}</Text>
                    <Button onPress={handleClose}>Close</Button>
                </View>
            )}
            <View style={styles.buttonRow}>
                <Button onPress={onPressBack}>Back</Button>
                <Button onPress={handlePressSave}>Save Translation</Button>
            </View>
        </>
    );
}


export default function App() {
    const [text, setText] = useState('unset');
    const [inputText, setInputText] = useState('');
    const [saving, setSaving] = useState(false);
    const [errorText, setErrorText] = useState(null);
    const [translatedText, setTranslatedText] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);

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
            let r = await translate.translate(inputText, {
                traceId: uuidv4()
            });
            setTranslatedText(r);
            setShowTranslation(true);
        } catch (e) {
            console.error(e)
            setErrorText('error: ' + JSON.stringify(e));
        }
    }

    function handlePressBack() {
        setShowTranslation(false);
    }

    async function handleSaveTranslation(translations, preferredLanguage) {
        setSaving(true);
        await saveIt(JSON.stringify({translations, preferredLanguage}), '👻');
        setShowTranslation(false);
        setSaving(false);
    }

    return (
        <PaperProvider>
            <SafeAreaView style={{flex: 1}}>
                <KeyboardDismisser>
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
                </KeyboardDismisser>
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

async function debug() {

}

debug()
