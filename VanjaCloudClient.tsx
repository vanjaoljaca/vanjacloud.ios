import { isProd } from "./App";
import axios from "axios";

export class VanjaCloudClient {

    private readonly url: string;

    constructor(url?) {
        const vanjaCloudUrl = isProd
            ? "https://cloud.vanja.oljaca.me"
            : "https://dev.cloud.vanja.oljaca.me"; // http://localhost:3000


        this.url = url || vanjaCloudUrl; // 'http://localhost:3000' //vanjaCloudUrl;
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