import React, { useState } from "react";
import { Clipboard, Dimensions, ScrollView, StyleSheet, View, Modal } from "react-native";
import { Button, Text } from '@shoutem/ui';
import { VanjaCloudClient } from "./VanjaCloudClient";

const vanjaCloudClient = new VanjaCloudClient()

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
        maxHeight: 100,
    },
});


function TranslatedTable({ translatedText, selectedLanguage, setSelection }) {
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>Language</Text>
                <Text>Translation</Text>
            </View>

            {translatedText.map(t => (
                <View key={t.to} style={{ flexDirection: 'row', justifyContent: 'space-between', height: 100 }}>
                    <Button
                        styleName="secondary"
                        style={[styles.cell,
                        selectedLanguage === t.to
                            ? { backgroundColor: '#566' }
                            : {}]}
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
    )
}

export function TranslatedView({ translatedText, onPressBack, onPressSave }) {
    const [expandedText, setExpandedText] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [explanation, setExplanation] = useState(null);


    function handleSelectTargetTranslation(to) {
        setSelectedLanguage(to);
    }

    function handlePressSave() {
        onPressSave(translatedText, selectedLanguage);
    }

    function handleSingleTap(text) {
        setExpandedText(text);
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
        if (selectedLanguage == t.to) {
            handleSelectTargetTranslation(null)
            setExpandedText(null)
        } else {
            handleSelectTargetTranslation(t.to)
            setExpandedText(t.text)
        }
    }

    return (
        <>
            <TranslatedTable
                translatedText={translatedText}
                selectedLanguage={selectedLanguage}
                setSelection={setSelection} />


            <View style={[styles.expandedView, { flex: 1 }]}>
                {expandedText && (
                    <>
                        <ScrollView>
                            <Text style={styles.expandedText}>{expandedText}</Text>
                        </ScrollView>

                        <View style={styles.buttonRow}>
                            {selectedLanguage && <Button onPress={handleExplain}><Text>🤔</Text></Button>}
                        </View>
                    </>
                )}
            </View >


            <View style={styles.buttonRow}>
                <Button onPress={onPressBack}><Text>Back</Text></Button>
                <Button onPress={handlePressSave}><Text>Done</Text></Button>
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