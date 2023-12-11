import React from 'react';
import { ScrollView, Modal } from 'react-native';
import { Text, Button, View } from '@shoutem/ui';

export function ShareableModalPopup({ text, onClose }) {
    return (
        <Modal visible={text != null && text != undefined}>
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
                        <ScrollView>
                            <Text>{text}</Text>
                        </ScrollView>

                        <Button styleName="dark" onPress={() => onClose()}>
                            <Text>Ok</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}