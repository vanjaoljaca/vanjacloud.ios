import React, { useState } from "react";
import { Clipboard, ScrollView, View } from "react-native";
import { Button, Menu, Modal, Text, TextInput, ToggleButton } from "react-native-paper";
import KeyboardDismisser from "./src/KeyboardDismisser";
import { Gap } from "./Gap";

import { Chip } from 'react-native-paper';
import { VanjaCloudClient } from "./VanjaCloudClient";

const vanjaCloudClient = new VanjaCloudClient()

function getHashTags(text) {
    const regex = /#[a-zA-Z0-9]+/g;
    const matches = text.match(regex);
    if (matches) {
        return matches;
    } else {
        return [];
    }
}

import { Keyboard } from 'react-native';


export function MainView({ inputText, setInputText, onPressSave, saving, translateText, errorText, onClearErrorText }) {

    const tags = [
        '#danger', '#idea', '#work',
        '#feeling', '#wyd', '#mood',
        '#ai', '#name', '#spanish',
        '#app', '#singing', '#tiktok',
        '#content', '#story', '#comedy',
        '#code', '#lol', '#writing',
        '#coulddo', '#shoulddo', '#followup',
    ]

    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedTags, setSelectedTags] = useState([])
    const [showingSaveModal, setShowingSaveModal] = useState(false);

    function handleClearErrorText() {
        onClearErrorText();
    }

    const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 })

    function handlePressSaveOne() {
        const t = getHashTags(inputText);
        setSelectedTags(t);
        Keyboard.dismiss();
        setShowingSaveModal(true);
    }

    function handlePressSaveTwo() {
        console.log('handlePressSaveTwo', inputText, selectedTags);
        onPressSave(inputText, selectedTags);
        setShowingSaveModal(false);
        setSelectedTags([]);
    }

    function handleCancel() {
        setShowingSaveModal(false);
    }

    return (
        <>
            <View style={{
                flex: 1,
                marginLeft: '7%',
                marginRight: '7%',
                marginTop: '15%',
                marginBottom: '7%',
            }}>
                {/* Top section for text input */}
                <Gap />
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
                        <Gap />

                    </View>
                </View>
                <Gap />
                <View style={{ flexDirection: 'row' }}>

                    <Button
                        style={{ flex: 1 }}
                        onPress={handlePressSaveOne}
                        mode="contained"
                    >
                        <Text>save</Text>

                    </Button>

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
                            <ScrollView>
                                <Text style={{ color: '#FF9a9a' }} onPress={handleClearErrorText}>{errorText}</Text>
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardDismisser>
            </View>
            <Modal visible={showingSaveModal}>
                <View style={{
                    // flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 7
                }}
                    onTouchStart={() => {

                    }}>
                    <View style={{
                        margin: 20,
                        backgroundColor: "white",
                        borderRadius: 20,
                        padding: 20,
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
                        <Text>Select tags:</Text>
                        <Gap />
                        {/* <ScrollView>
                            <Text>stuff</Text>

                        </ScrollView> */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {tags.map((tag) => (
                                <View
                                    key={tag}
                                    style={{ width: '33.3%', padding: 5 }}
                                >
                                    <Chip
                                        icon={null}

                                        style={{
                                            height: 40,
                                            backgroundColor: selectedTags.includes(tag) ? '#3f51b5' : 'rgba(255, 255, 0, 0.1)',
                                        }}
                                        compact={true}
                                        selected={false}
                                        onPress={() => setSelectedTags(t => {
                                            if (t.includes(tag)) {
                                                return t.filter(t => t != tag);
                                            } else {
                                                return [...t, tag];
                                            }
                                        })}
                                    >
                                        {tag}
                                    </Chip>
                                </View>
                            ))}
                        </View>


                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Button onPress={handleCancel}>Cancel</Button>
                            <Button onPress={() => handlePressSaveTwo()}>Save</Button>

                        </View>
                    </View>
                </View>
            </Modal >
        </>
    )
        ;
}