import React, { useState } from 'react';
import { View, Button, Spinner, Text } from '@shoutem/ui';
import { vanjaCloudClient } from '../../App';

export function RetrospectivesScreen() {

  const [thinking, setThinking] = useState(false);
  const [text, setText] = useState<string>(null);


  async function languageRetrospective() {
    setThinking(true);
    try {
      setText('thinking...');
      const r = await vanjaCloudClient.languageRetrospective('es');
      console.log('r', r);
      setText(r.response);
    } catch (e) {
      console.log(e, JSON.stringify(e));
      setText(JSON.stringify(e));
    }
    setThinking(false);
  }

  async function retrospective() {
    setThinking(true);
    try {
      setText('thinking...');
      const r = await vanjaCloudClient.retrospective();
      console.log('r', r);
      setText(r.response);
    } catch (e) {
      console.log(e, JSON.stringify(e));
      setText(JSON.stringify(e));
    }
    setThinking(false);
  }

  return (

    <View styleName="flexible">
      {thinking && <Spinner styleName="small" />}
      <Button onPress={() => retrospective()}>
        <Text>Week Retrospective</Text>
      </Button>
      <Button onPress={() => languageRetrospective()}>
        <Text>Language Retrospective</Text>
      </Button>
      {/* <ShareableModalPopup text={text} onClose={() => setText(null)} /> */}
    </View>

  );
}
