# Create a new panel plugin

1. In the plugin directory, run the following to create a new panel plugin:

```
npx grafana-toolkit plugin:create my-panel-plugin
```

**Note:** `grafana-toolkit` supports two types of panel plugins; Angular, and React plugins. For this codelab, we're going to create a React plugin.

2. Download dependencies:

```
yarn install
```

3. Build the plugin:

```
yarn dev
```
