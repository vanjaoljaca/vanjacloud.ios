### Development install

```shell
yarn global add eas-cli
eas build --profile dev --platform ios
eas build:run -p ios # might be needed
```
### Keys

Don't forget to clear cache ``expo start -c``

.env
NOTION_SECRET=
OPENAI_API_KEY=
SPOTIFY_CLIENTID=
SPOTIFY_CLIENTSECRET=
AZURE_TRANSLATE_KEY=

### Deploying keys to EAS

```
eas secret:create --scope project --name <KEY> --value <value> --type string
```

### Deploying to EAS

This will send the new bundle to EAS, and users will download it on next open. (my phone)

```
NOTION_SECRET=<...> AZURE_TRANSLATE_KEY=<...> eas update --channel preview
```