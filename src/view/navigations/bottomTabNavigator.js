import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { BottomNavigation, BottomNavigationTab, Icon, Layout } from "@ui-kitten/components";
import { AccountScreen, HomeScreen, ManagementScreen } from "../screens";

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
                <BottomNavigationTab icon={(style) => tabIcon(style, "briefcase")} title="Management" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "person")} title="Account" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "home")} title="Home" />
            </BottomNavigation>
        </Layout>
    );
};

export const BottomTabNavigator = createBottomTabNavigator({
    Management: ManagementScreen,
    Account: AccountScreen,
    Home: HomeScreen
}, {
    tabBarComponent: TabBarComponent,
});