import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, TextInput, Text, ActivityIndicator, ProgressBar, Modal } from 'react-native-paper'
import { Client } from "@notionhq/client"
import { Provider as PaperProvider } from 'react-native-paper';
import * as Device from 'expo-device';
import { Clipboard } from "react-native"; // todo: move this
import { Menu } from 'react-native-paper';
import { ChatGPT, AzureTranslate } from "vanjacloud.shared.js";
import vanjacloud from "vanjacloud.shared.js";
import axios from 'axios';
import { Dimensions } from 'react-native';
import { DataTable } from 'react-native-paper';
import KeyboardDismisser from "./src/KeyboardDismisser";

process.env['DEBUG'] = 'true'

const Keys = vanjacloud.Keys;
Keys.openai = process.env.OPENAI_API_KEY; // todo.. idk why this isnt being loaded, some build crap

const notion = new Client({
    auth: Keys.notion
})
const proddbid = '1ccbf2c452d6453d94bc462a8c83c200'
const testdbid = '4ef4fb0714c9441d94b06c826e74d5d3'

const dbid = Device.isDevice ? proddbid : testdbid;

const translate = new AzureTranslate(Keys.azure.translate);

function Gap() {
    return <View style={{ height: 40 }}/>
}

const isProd = true;

const vanjaCloudUrl = isProd
  ? "https://cloud.vanja.oljaca.me"
  : "https://dev.cloud.vanja.oljaca.me"; // http://localhost:3000

function MainView({ inputText, setInputText, onPressSave, saving, translateText, errorText, onClearErrorText }) {

    const [menuVisible, setMenuVisible] = useState(false);

    function handleClearErrorText() {
        onClearErrorText();
    }

    const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 })

    return (
        <View style={{ flex: 1, margin: '7% 0% 7% 0%' }}>
            {/* Top section for text input */}
            {!saving && <Gap/>}
            <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                <View style={{ marginTop: 0 }}>
                    <TextInput
                        mode='outlined'
                        multiline={true}
                        onChangeText={text => setInputText(text)}
                        value={inputText}
                        label="Think here"
                        style={{ height: 200 }}
                    />
                    <Gap/>

                </View>
            </View>

            {/* Middle section for buttons */
            }
            <View style={{ flexDirection: 'row' }}>
                <Gap/>
                <Button
                    style={{ flex: 1 }}
                    onPress={onPressSave}
                    mode="contained"
                >
                    <Text>save</Text>

                </Button>
                <Gap/>
                <Button
                    style={{ flex: 1 }}
                    onPress={translateText}
                    mode="contained"
                >
                    <Text>translate</Text>
                </Button>
                <Button
                    style={{ flex: 0.3 }}
                    onPress={(e) => {
                        console.log('long press');
                        const { nativeEvent } = e;
                        const anchor = {
                            x: nativeEvent.pageX,
                            y: nativeEvent.pageY,
                        };

                        setMenuAnchor(anchor);
                        setMenuVisible(true);
                    }}

                >🫥</Button>
                <Menu
                    anchor={menuAnchor}
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

            {/* Bottom section for progress bar and error text */
            }
            <KeyboardDismisser>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* Add progress bar component here */}
                    {/*<ProgressBar progress={0.5} color={'#3f51b5'} style={{height: 200}}/>*/}

                    <View style={{ height: 200, width: '100%' }}>
                        <Text style={{ color: '#FF9a9a' }} onPress={handleClearErrorText}>{errorText}</Text>
                    </View>
                </View>
            </KeyboardDismisser>
        </View>
    )
        ;
}


const windowWidth = Dimensions.get('window').width;
const cellWidth = windowWidth * 0.8 / 4;

function TranslatedView({ translatedText, onPressBack, onPressSave }) {
    const [expandedText, setExpandedText] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [explanation, setExplanation] = useState(null);

    const screenHeight = Dimensions.get('window').height;
    const maxCellHeight = (screenHeight * 0.75) / translatedText.length;

    const styles = StyleSheet.create({
        expandedView: {
            marginTop: 10,

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

    async function handleExplain() {
        try {
            setExplanation('Thinking...')
            const response = await axios.post(`${vanjaCloudUrl}/api/main/language`, {
                request: 'explain',
                target: selectedLanguage,
                text: expandedText
            });

            let m = response.data.response;
            m = (m as string).replace('\n', '\n\n')


            setExplanation(m)
            console.log(m)
        } catch (e) {
            console.log(JSON.stringify(e))
            setExplanation(JSON.stringify(e))
        }
    }

    const styles2 = StyleSheet.create({
        modalOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,0,0,0.5)',
            justifyContent: 'flex-start',
            alignItems: 'stretch'
        },
        modalContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 4,
            alignItems: 'stretch',
            justifyContent: 'flex-start',

            // width: '80%',
            // height: '60%'
            flex: 1
        },
        modalText: {
            fontSize: 30,
            color: '#fff', // white color for the text
            textAlign: 'center', // center the text
        }
    })

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
                            style={[styles.cell, { backgroundColor: selectedLanguage === t.to ? '#ffe' : '#fff' }]}
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
                    {selectedLanguage && <Button onPress={handleExplain}>🤔</Button>}

                </View>

            )}
            <View style={styles.buttonRow}>
                <Button onPress={onPressBack}>Back</Button>
                <Button onPress={handlePressSave}>Save Translation</Button>
            </View>


            {explanation != null && (
                <Modal visible={explanation != null}>
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
                                <Text>{explanation}</Text>

                            </ScrollView>
                            <Button onPress={() => setExplanation(null)}>End</Button>
                        </View>
                    </View>
                </Modal>


            )}

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
            </SafeAreaView>
        </PaperProvider>
    );
}


async function debug() {

    return
}

debug()
