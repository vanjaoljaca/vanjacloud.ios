import Config from "../Config";
import axios from "axios";
import moment from "moment";

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


export interface Translation {
    text: string;
    to: string;
}

interface AzureTranslateOpts {
    endpoint?: string,
    location?: string,
    traceIdGenerator?: () => string
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

    async languageRetrospective(language, duration?: moment.Duration) {
        console.log('this.url', this.url)
        const response = await axios.post(`${this.url}/retrospective`, {
            // target: language,
            prompt: `
                Write a short story in language '${language}' and make it entertaining. It will be used for remembering past translation requests
                in a relevant way. Use all the provided data and make it fun and tie it together in a memorable way. Repetition is allowed if relevant.
                Highlight the supplied references in bold so that they are easily recognizable.`,
            duration
        });
        return response.data;
    }

    async retrospective(prompt?: string, duration?: moment.Duration) {
        console.log('this.url', this.url)
        const response = await axios.post(`${this.url}/retrospective`, {
            // target: language,
            prompt,
            duration
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


    async translate(text: string, opts?: { to?: string[], from?: string, traceId?: string }): Promise<Translation[]> {

        const defaultTo = ['en', 'de', 'es', 'sr-Cyrl-BA'];

        const response = await axios.post(`${this.url}/translate`, {
            text: text,
            to: opts?.to || defaultTo,
            from: opts?.from,
            traceId: opts?.traceId
        });

        return response.data as Translation[];
    }
}