import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { BottomNavigation, BottomNavigationTab, Icon, Layout } from "@ui-kitten/components";
import { AccountScreen, HomeScreen } from "../screens";

const TabBarComponent = ({ navigation }) => {

    const homeIcon = (style) => (
        <Icon {...style} name="home" />
    );

    const accountIcon = (style) => (
        <Icon {...style} name="person" />
    );

    const onSelect = (index) => {
        const selectedTabRoute = navigation.state.routes[index];
        navigation.navigate(selectedTabRoute.routeName);
    };

    return (
        <Layout>
            <BottomNavigation
                appearance="noIndicator"
                selectedIndex={navigation.state.index}
                onSelect={onSelect}
            >
                <BottomNavigationTab icon={homeIcon} />
                <BottomNavigationTab icon={accountIcon} />
            </BottomNavigation>
        </Layout>
    );
};

export const BottomTabNavigator = createBottomTabNavigator({
    Home: HomeScreen,
    Account: AccountScreen,
}, {
    tabBarComponent: TabBarComponent,
});