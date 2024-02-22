import React, { useState } from 'react';
import { View, Spinner } from '@shoutem/ui';
import { TranslatedView } from "./TranslatedView";
import { MainView } from "../MainView";
import { thoughtDb, ThoughtType } from '../../App';
import { vanjaCloudClient } from './Microphoner';

export function MainView2() {
    const [inputText, setInputText] = useState('');
    const [saving, setSaving] = useState(false);
    const [errorText, setErrorText] = useState(null);
    const [translatedText, setTranslatedText] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);

    async function onPressSave(inputText, selectedTags) {
        try {
            setSaving(true);
            let r = await thoughtDb.saveIt2(inputText, ThoughtType.note, selectedTags);
            console.log('saved it', r);
            setInputText('');
        } catch (e) {
            console.error(e);
            setErrorText('error: ' + JSON.stringify(e, null, 2));
        }
        setSaving(false);
    }

    async function translateText() {
        // Call translation service here and set the translated text
        // to the translatedText
        // to the translatedText state variable
        try {
            setSaving(true);
            let r = await vanjaCloudClient.translate(inputText);
            console.log({ r })
            setTranslatedText(r);
            setShowTranslation(true);
        } catch (e) {
            console.error(JSON.stringify(e, null, 2));
            setErrorText('error: ' + JSON.stringify(e, null, 2));
        }
        setSaving(false);
    }

    function handlePressBack() {
        setShowTranslation(false);
    }

    async function handleSaveTranslation(translations, preferredLanguage?) {

        setSaving(true);
        const r = await thoughtDb.saveTranslation(translations, preferredLanguage);
        setShowTranslation(false);
        setSaving(false);
    }

    return (
        <View style={{ flex: 1 }}>
            {showTranslation ?
                <TranslatedView
                    translatedText={translatedText}
                    onPressBack={() => setShowTranslation(false)}
                    onPressSave={handleSaveTranslation} /> :
                <MainView

                    inputText={inputText}
                    setInputText={setInputText}
                    onPressSave={onPressSave}
                    saving={saving}
                    translateText={translateText}
                    errorText={errorText}
                    onClearErrorText={() => setErrorText(null)} />}
            {saving && <Spinner size="small" color="#AAAAAA" />}
        </View>
    );
}
