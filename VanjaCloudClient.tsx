import Config from "./Config";
import axios from "axios";

import * as Device from 'expo-device';

function getUrl() {
    // todo...
    switch (true) {
        case Config.isProd:
            return 'https://myprodurl.com'
        case Device.isDevice:
            return 'http://localhost:3000'
        default:
            return "https://myclouddevurl.com"
    }
}

export class VanjaCloudClient {

    private readonly url: string;

    constructor(url?) {
        this.url = url || getUrl();
    }

    async main(api, body) {
        const response = await axios.post(`${this.url}/api/main/${api}`, body);
        return response.data;
    }

    async explain(language, text) {
        const response = await axios.post(`${this.url}/api/main/language`, {
            request: 'explain',
            target: language,
            text: text
        });
        return response.data;
    }

    async languageRetrospective(language) {
        const response = await axios.post(`${this.url}/api/main/languageretrospective`, {
            target: language,
        });
        return response.data;
    }

    async retrospective() {
        const response = await axios.post(`${this.url}/api/main/retrospective`, {
            // target: language,
        });
        return response.data;
    }
}