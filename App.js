import React from 'react';
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light } from "@eva-design/eva";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppLoading } from "expo";
import HomeScreen from './src/view/screens/HomeScreen';
import { store, persistor } from "./src/view/redux/store";

export default function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={<AppLoading />} persistor={persistor}>
                <IconRegistry icons={EvaIconsPack} />
                <ApplicationProvider mapping={mapping} theme={light}>
                    <HomeScreen />
                </ApplicationProvider>
            </PersistGate>
        </Provider>
    );
}
