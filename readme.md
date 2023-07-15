# Initial setup

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

# Usage tools

### Deploying keys to EAS

```
eas secret:create --scope project --name <KEY> --value <value> --type string
```

### Deploying to EAS

Can't remmeber which of these channels works on my phone...

```
NOTION_SECRET=<...> AZURE_TRANSLATE_KEY=<...> eas update --channel preview
```

### Create new iOS build

Can't remmeber which of these channels works on my phone...

I think I have preview build installed on my phone?

```
eas build --profile preview --platform ios
```

Can also push preview update instead
```shell
NOTION_SECRET=<...> AZURE_TRANSLATE_KEY=<...> eas update --channel main
```

### Link to vanjacloudjs.shared

```shell
cd ./lib/vanjacloudjs.shared && yarn link && yarn watch
cd ../..
yarn link vanjacloudjs.shared
```