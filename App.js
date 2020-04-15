import "react-native-gesture-handler";
import React, { useState, useEffect } from 'react';
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light } from "@eva-design/eva";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppLoading } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { store, persistor } from "./src/view/redux/store";
import { ThemeProvider } from "react-native-elements";
import { Root } from "native-base";
import { WelcomeScreen, 
         LoginScreen, 
         CustomerSignupScreen, 
         CustomerHomeScreen, 
         EmployeeHomeScreen, 
         CustomerSubCategoryScreen,
         CustomerProductPurchaseScreen,
         CustomerCartScreen,
         CustomerCartPurchaseScreen,
         CustomerAccountDetailsScreen,
         EmployeeEmployeeManagementScreen,
         EmployeeCustomerManagementScreen,
         EmployeeProductManagementScreen,
         EmployeeAccountManagementScreen,
         EmployeeCollectionManagementScreen,
         EmployeeCategoryManagementScreen,
         EmployeeAddEmployeeScreen,
         EmployeeAddProductScreen,
         EmployeeAddCollectionScreen,
        } from "./src/view/screens";

import * as ErrorRecovery from "expo-error-recovery";
import * as ExpoFont from "expo-font";

/** Fix buffer issue on iOS. */
import { Buffer } from "buffer";
global.Buffer = Buffer;

const Stack = createStackNavigator();

export default function App(props) {

    const [isReady, setIsReady] = useState(false);

    ErrorRecovery.setRecoveryProps(props);

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
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome">
                    <Stack.Screen
                        options={{ headerShown: false }}
                        name="Welcome"
                        component={WelcomeScreen}
                    />
                    <Stack.Screen
                        options={{ headerShown: false }}
                        name="CustomerHome"
                        component={CustomerHomeScreen}
                    />
                    <Stack.Screen
                        options={{ headerShown: false }}
                        name="EmployeeHome"
                        component={EmployeeHomeScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Đăng nhập" }}
                        name="Login"
                        component={LoginScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Đăng ký" }}
                        name="CustomerSignup"
                        component={CustomerSignupScreen}
                    />

                    <Stack.Screen 
                        name="CustomerSubCategory"
                        component={CustomerSubCategoryScreen}
                    />
                    <Stack.Screen
                        options={{ headerShown: false }}
                        name="CustomerProductPurchase"
                        component={CustomerProductPurchaseScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Giỏ hàng" }}
                        name="CustomerCart"
                        component={CustomerCartScreen}
                    />
                    <Stack.Screen 
                        options={{ title: "Thanh toán" }}
                        name="CustomerCartPurchase"
                        component={CustomerCartPurchaseScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Thông tin cá nhân" }}
                        name="CustomerAccountDetails"
                        component={CustomerAccountDetailsScreen}
                    />

                    <Stack.Screen
                        options={{ title: "Sản phẩm" }}
                        name="EmployeeProductManagement"
                        component={EmployeeProductManagementScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Bộ sưu tập" }}
                        name="EmployeeCollectionManagement"
                        component={EmployeeCollectionManagementScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Nhân viên" }}
                        name="EmployeeEmployeeManagement"
                        component={EmployeeEmployeeManagementScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Khách hàng" }}
                        name="EmployeeCustomerManagement"
                        component={EmployeeCustomerManagementScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Tài khoản" }}
                        name="EmployeeAccountManagement"
                        component={EmployeeAccountManagementScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Loại sản phẩm" }}
                        name="EmployeeCategoryManagement"
                        component={EmployeeCategoryManagementScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Thêm sản phẩm" }}
                        name="AddProduct"
                        component={EmployeeAddProductScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Thêm bộ sưu tập" }}
                        name="AddCollection"
                        component={EmployeeAddCollectionScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Thêm nhân viên" }}
                        name="AddEmployee"
                        component={EmployeeAddEmployeeScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
            </Root>
            </ThemeProvider>
            </PaperProvider>
            </ApplicationProvider>
        </PersistGate>
        </ReduxProvider>
    );
}
