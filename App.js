import React, { useState, useEffect } from 'react';
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light } from "@eva-design/eva";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppLoading } from "expo";
import { createAppContainer } from "react-navigation";
import { store, persistor } from "./src/view/redux/store";
import { BottomTabNavigator } from "./src/view/navigations/bottomTabNavigator";
import { ThemeProvider } from "react-native-elements";
import { Root } from "native-base";
import * as ErrorRecovery from "expo-error-recovery";
import * as ExpoFont from "expo-font";

/** Fix buffer issue on iOS. */
import { Buffer } from "buffer";
global.Buffer = Buffer;

export default function App(props) {

    const [isReady, setIsReady] = useState(false);

    ErrorRecovery.setRecoveryProps(props);
    const AppContainer = createAppContainer(BottomTabNavigator);

    useEffect(() => {
        loadFont();
    }, []);

    async function loadFont() {
        await ExpoFont.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        });
        setIsReady(true);
    }

    if (!isReady)
        return <AppLoading />;

    return (
        <ReduxProvider store={store}>
            <PersistGate loading={<AppLoading />} persistor={persistor}>
                <IconRegistry icons={EvaIconsPack} />
                <ApplicationProvider mapping={mapping} theme={light}>
                    <PaperProvider>
                        <ThemeProvider>
                            <Root>
                                <AppContainer />
                            </Root>
                        </ThemeProvider>
                    </PaperProvider>
                </ApplicationProvider>
            </PersistGate>
        </ReduxProvider>
    );
}
