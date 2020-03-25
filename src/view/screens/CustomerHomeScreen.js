import React from "react";
import { Platform, StatusBar } from "react-native";
import { BottomNavigation, BottomNavigationTab, Icon } from "@ui-kitten/components";
import { SafeAreaView } from "react-navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LoginScreen } from ".";
import { CustomerSignupPanel, UserAccountView } from "../components/accounts";

const Tab = createBottomTabNavigator();

const TabBarComponent = ({ navigation, state }) => {

    const onSelect = (index) => {
        navigation.navigate(state.routeNames[index]);
    };

    const tabIcon = (style, name) => (
        <Icon {...style} name={name} />
    );

    return (
        <SafeAreaView>
            <BottomNavigation
                appearance="noIndicator"
                selectedIndex={state.index}
                onSelect={onSelect}
                style={{ borderTopColor: "#e6e6e6", borderTopWidth: 0.5 }}
            >
                <BottomNavigationTab icon={(style) => tabIcon(style, "briefcase")} title="Quản lý" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "person")} title="Tài khoản" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "home")} title="Trang chủ" />
            </BottomNavigation>
        </SafeAreaView>
    );
};

export default function CustomerHomeScreen({ navigation }) {

    return (
        <SafeAreaView style={{
            marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
            flex: 1
        }}>
            <Tab.Navigator tabBar={props => <TabBarComponent {...props} />}>
                <Tab.Screen name="A" component={UserAccountView} />
                <Tab.Screen name="B" component={LoginScreen} />
                <Tab.Screen name="C" component={CustomerSignupPanel} />
            </Tab.Navigator>
        </SafeAreaView>
    )
}