import React from 'react';
import { ScrollView, Button, Modal } from 'react-native';
import { Text, View } from '@shoutem/ui';
// import Modal from "react-native-modal";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function ShareableModalPopup({ text, onClose }) {
    return (
        <Modal isVisible={text != null && text != undefined}>
            <GestureHandlerRootView>
                <View styleName="fill-parent middle-center">

                    <View styleName="fill-parent middle-center">
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
                            maxHeight: '87%',
                            height: '100%',
                            width: '95%'
                        }}>

                            <Button styleName="dark" onPress={() => {
                                console.log('onClose')
                                onClose()
                            }} title='ok'>

                                {/* <Text>Ok</Text> */}
                            </Button>

                            <ScrollView style={{ backgroundColor: 'red' }} onTouchEnd={() => {
                                console.log('onClose')
                                onClose()
                            }}>
                                <Text>{text}</Text>
                            </ScrollView>


                        </View>
                    </View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
}