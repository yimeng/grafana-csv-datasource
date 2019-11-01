# Create a new plugin

1. In the plugin directory, run the following to create a new data source plugin:

```
npx grafana-toolkit plugin:create codelab1
```

2. Download dependencies:

```
yarn install
```

```
yarn add --dev lodash @types/lodash
```

3. Build the plugin:

```
yarn dev
```

4. Start Grafana to verify your plugin loads correctly.

5. To add the data source, navigate to **Configuration** -> **Data Sources**, and click **Add data source**.

6. Type "codelab1", and select your data source.

7. Click **Save & Test**.
