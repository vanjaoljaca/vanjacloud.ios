import Config from "../Config";
import axios from "axios";

import * as Device from 'expo-device';

function getUrl() {
    console.log('Device.isDevice', Device.isDevice)
    switch (true) {
        case Device.isDevice:
            return 'https://remote.vanja.oljaca.me'
        // case Config.isProd:
        //     return 'https://cloud.vanja.oljaca.me' //return "https://dev.cloud.vanja.oljaca.me"
        default:
            return 'http://localhost:3000'
    }
}

export class VanjaCloudClient {

    private readonly url: string;

    constructor(url?) {
        this.url = url || getUrl();
    }

    async main(api, body) {
        const response = await axios.post(`${this.url}/api`, body);
        return response.data;
    }

    async explain(language, text) {
        const response = await axios.post(`${this.url}/explain`, {
            request: 'explain',
            target: language,
            text: text
        });
        return response.data;
    }

    async languageRetrospective(language) {
        const response = await axios.post(`${this.url}/languageretrospective`, {
            target: language,
        });
        return response.data;
    }

    async retrospective() {
        console.log('this.url', this.url)
        const response = await axios.post(`${this.url}/retrospective`, {
            // target: language,
        });
        return response.data;
    }

    async uploadAudio(uri: string) {

        const formData = new FormData();
        formData.append('cv', {
            uri: uri,
            name: 'recording.m4a',
            type: 'audio/mp3', // todo
        } as any)

        const response = await fetch(`${this.url}/audio`, {
            method: 'POST',
            body: formData,
        });

        return response.ok
    }
}