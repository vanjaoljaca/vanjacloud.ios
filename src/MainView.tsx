import React, { useState } from "react";
import { Clipboard, ScrollView, TextInput, View, Modal } from "react-native";

import KeyboardDismisser from "./utils/KeyboardDismisser";
import { Gap } from "./views/Gap";
import { Text, Button } from '@shoutem/ui';

import { VanjaCloudClient } from "./utils/VanjaCloudClient";

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
import Config from "./Config";
import Chip from "./views/Chip";


export function MainView({ inputText, setInputText, onPressSave, saving, translateText, errorText, onClearErrorText }) {

  const tags = Config.tags;

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
        borderColor: '#ff0',
        backgroundColor: '#0f0',
      }}>
        <View style={{ flex: 2, backgroundColor: '#0ff', borderColor: '#ff0', minHeight: '40%' }}>
          <TextInput
            // mode='outlined'
            multiline={true}
            onChangeText={text => setInputText(text)}
            value={inputText}
            // label="Think here"
            style={{ flex: 1 }}
          />
        </View>

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

        </View>

        <KeyboardDismisser>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f00' }}>

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
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 0
        }}

          onTouchStart={() => {
            setShowingSaveModal(false);
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
            width: '95%',

          }}
            onTouchStart={(e) => {
              e.stopPropagation()
            }
            }>
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
                    selected={selectedTags.includes(tag)}
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
              <Button onPress={handleCancel}><Text>Cancel</Text></Button>
              <Button onPress={() => handlePressSaveTwo()}><Text>Save</Text></Button>

            </View>
          </View>
        </View>
      </Modal >
    </>
  )
    ;
}