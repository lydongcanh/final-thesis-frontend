import React from 'react';
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light } from "@eva-design/eva";
import { Provider as PaperProvider} from "react-native-paper";
import { Provider as ReduxProvider} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppLoading } from "expo";
import { createAppContainer } from "react-navigation";
import { store, persistor } from "./src/view/redux/store";
import { BottomTabNavigator } from './src/view/navigations/bottomTabNavigator';
import * as ErrorRecovery from 'expo-error-recovery';

/** Fix buffer issue on iOS. */
import { Buffer } from "buffer";
global.Buffer = Buffer;

export default function App(props) {

    ErrorRecovery.setRecoveryProps(props);
    
    const AppContainer = createAppContainer(BottomTabNavigator);

    return (
        <ReduxProvider store={store}>
            <PersistGate loading={<AppLoading />} persistor={persistor}>
                <IconRegistry icons={EvaIconsPack} />
                <ApplicationProvider mapping={mapping} theme={light}>
                    <PaperProvider>
                        <AppContainer />
                    </PaperProvider>
                </ApplicationProvider>
            </PersistGate>
        </ReduxProvider>
    );
}
