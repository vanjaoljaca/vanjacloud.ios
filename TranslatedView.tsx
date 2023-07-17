import React, { useState } from "react";
import { Clipboard, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Button, DataTable, Modal, Text } from "react-native-paper";
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