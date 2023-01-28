import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, useEffect } from 'react';
// https://developers.notion.com/reference/intro
import keys from './keys';
import { Client } from "@notionhq/client"

// Initializing a client
const notion = new Client({
    auth: keys.notion
})
const dbid = '1ccbf2c452d6453d94bc462a8c83c200'

async function test() {

    let res = await notion.databases.query({
        database_id: dbid,
    })
    let dbpage = await notion.pages.retrieve({
        page_id: res.results[0].id
    });
    console.log('--------')
    console.log(dbpage.object);
    console.log('--------')
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

export default function App() {
    const [text, setText] = useState('unset');
    const [inputText, setInputText] = useState('');
    async function doIt() {
        let r = await test();
        console.log('did it', r)
        setText(r);
    }

    async function saveIt(text: string) {
        console.log('saving', text)


        const response = await notion.pages.create({
            cover: {
                type: "external",
                external: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg"
                }
            },
            icon: {
                type: "emoji",
                emoji: "🐿️"
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
        let r = await saveIt(inputText);
        console.log('saved it', r)
        setText(r);
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
            {/* <View style={styles.container}> */}
            <Text>IT WORKS</Text>
            <Text>and this is how you push a change</Text>
            <Text>{text}</Text>
            {/* multiline input with red background color: */}
            <TextInput style={{ backgroundColor: 'red' }}
                multiline={true}
                numberOfLines={4}
                onChangeText={text => setInputText(text)}
                value={inputText}
            />

            <Button onPress={doIt} title='Do It' />
            <Button onPress={onPressSave} title='Save It' />
            <StatusBar style="auto" />
        </View >
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
