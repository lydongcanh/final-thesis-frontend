import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { BottomNavigation, BottomNavigationTab, Icon, Layout } from "@ui-kitten/components";
import { AccountScreen, HomeScreen } from "../screens";
import TestScreen from "../screens/TestScreen";

const TabBarComponent = ({ navigation }) => {
   
    const onSelect = (index) => {
        const selectedTabRoute = navigation.state.routes[index];
        navigation.navigate(selectedTabRoute.routeName);
    };

    const tabIcon = (style, name) => (
        <Icon {...style} name={name} />
    );

    return (
        <Layout>
            <BottomNavigation
                appearance="noIndicator"
                selectedIndex={navigation.state.index}
                onSelect={onSelect}
            >
                <BottomNavigationTab icon={(style) => tabIcon(style, "home")} title="Home" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "person")} title="Account" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "lock")} title = "Test" />
            </BottomNavigation>
        </Layout>
    );
};

export const BottomTabNavigator = createBottomTabNavigator({
    Home: HomeScreen,
    Account: AccountScreen,
    Test: TestScreen
}, {
    tabBarComponent: TabBarComponent,
});