import React from 'react';
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light } from "@eva-design/eva";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppLoading } from "expo";
import { createAppContainer } from "react-navigation";
import { store, persistor } from "./src/view/redux/store";
import { BottomTabNavigator } from './src/view/navigations/bottomTabNavigator';

export default function App() {

    const AppContainer = createAppContainer(BottomTabNavigator);

    return (
        <Provider store={store}>
            <PersistGate loading={<AppLoading />} persistor={persistor}>
                <IconRegistry icons={EvaIconsPack} />
                <ApplicationProvider mapping={mapping} theme={light}>
                    <ThemeProvider>
                        <AppContainer />
                    </ThemeProvider>
                </ApplicationProvider>
            </PersistGate>
        </Provider>
    );
}
