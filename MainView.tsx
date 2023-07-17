import React, { useState } from "react";
import { Clipboard, ScrollView, View } from "react-native";
import { Button, Menu, Modal, Text, TextInput, ToggleButton } from "react-native-paper";
import KeyboardDismisser from "./src/KeyboardDismisser";
import { Gap } from "./Gap";

import { Chip } from 'react-native-paper';
import { VanjaCloudClient } from "./VanjaCloudClient";

const vanjaCloudClient = new VanjaCloudClient()

export function MainView({ inputText, setInputText, onPressSave, saving, translateText, errorText, onClearErrorText }) {

    const [menuVisible, setMenuVisible] = useState(false);

    function handleClearErrorText() {
        onClearErrorText();
    }

    const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 })

    async function retrospective(type) {

    }

    return (
        <>
            <View style={{
                flex: 1,
                marginLeft: '7%',
                marginRight: '7%',
                marginTop: '7%',
                marginBottom: '7%',
            }}>
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

                        <Menu.Item
                            onPress={async () => {
                                await retrospective('translation');
                                setMenuVisible(false);
                            }}
                            title='Retrospective Translation'
                        />
                        <Menu.Item
                            onPress={async () => {
                                await retrospective('journal');
                                setMenuVisible(false);
                            }}
                            title='Retrospective Journal'
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
            <Modal visible={false}>
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
                            <Text>stuff</Text>

                        </ScrollView>
                        <View>
                            {['#coulddo', '#shoulddo', '#woulddo'].map((tag) =>
                                <Chip
                                    key={tag}
                                    style={{ height: 40 }}
                                    selected={true}
                                    onPress={() => console.log('Pressed')}>{tag}</Chip>
                            )}
                        </View>

                        <Button>Cancel</Button>
                        <Button>Stop</Button>
                    </View>
                </View>
            </Modal>
        </>
    )
        ;
}