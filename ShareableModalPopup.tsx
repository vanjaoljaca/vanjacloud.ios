import { ScrollView, View } from 'react-native';
import React from 'react';
import { Modal, Text } from 'react-native-paper';
import { Button } from 'react-native-paper';

export function ShareableModalPopup({ text, onClose }) {
    return (<Modal visible={text != null && text != undefined}>
        <View style={{
            // flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 0
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
                maxHeight: '87%',
                height: '100%',
                width: '95%'
            }}>
                <ScrollView>
                    <Text>{text}</Text>
                </ScrollView>

                <Button onPress={() => onClose()}>Ok</Button>
                {/*<Button>Save</Button>*/}
                {/*<Button>Share</Button>*/}
            </View>
        </View>
    </Modal>);
}
