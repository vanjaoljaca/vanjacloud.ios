import React, { useState } from "react";
import { Clipboard, Dimensions, ScrollView, StyleSheet, View, Modal } from "react-native";
import { Button, Text } from '@shoutem/ui';
import { VanjaCloudClient } from "./VanjaCloudClient";

const vanjaCloudClient = new VanjaCloudClient()

export function TranslatedView({ translatedText, onPressBack, onPressSave }) {
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

            const response = await vanjaCloudClient.explain(selectedLanguage, expandedText)
            let m = response.response;
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

    function setSelection(t) {
        handleSelectTargetTranslation(t.to)
        setExpandedText(t.text)
    }

    return (
        <>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>Language</Text>
                    <Text>Translation</Text>
                </View>

                {translatedText.map(t => (
                    <View key={t.to} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            styleName="secondary"
                            style={[styles.cell, 
                                selectedLanguage === t.to 
                                    ? { backgroundColor: '#566' }
                                    : {  }]}
                            onPress={() => setSelection(t)}>
                            <Text>{t.to}</Text>
                        </Button>
                        <Button
                            styleName="secondary"
                            style={styles.cell}
                            onPress={() => setSelection(t)}
                            onLongPress={() => Clipboard.setString(t.text)}>
                            <Text>{t.text}</Text>
                        </Button>
                    </View>
                ))}
            </View>


            <View style={[styles.expandedView, { flex: 1 }]}>
                {expandedText && (
                    <>
                        <ScrollView>
                            <Text style={styles.expandedText}>{expandedText}</Text>
                        </ScrollView>

                        <View style={styles.buttonRow}>
                            <Button onPress={handleClose}><Text>Close</Text></Button>
                            {selectedLanguage && <Button onPress={handleExplain}><Text>🤔</Text></Button>}
                        </View>
                    </>
                )}
            </View >


            <View style={styles.buttonRow}>
                <Button onPress={onPressBack}><Text>Back</Text></Button>
                <Button onPress={handlePressSave}><Text>Save Translation</Text></Button>
            </View>


            {
                explanation != null && (
                    <Modal visible={explanation != null}>
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            // marginTop: 7
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
                                maxHeight: '90%',
                                height: '100%',
                                width: '95%'
                            }}>
                                <ScrollView>
                                    <Text>{explanation}</Text>

                                </ScrollView>
                                <Button onPress={() => setExplanation(null)}><Text>End</Text></Button>
                            </View>
                        </View>
                    </Modal>
                )
            }

        </>
    );
}