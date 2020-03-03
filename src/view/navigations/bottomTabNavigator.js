import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { BottomNavigation, BottomNavigationTab, Icon, Layout } from "@ui-kitten/components";
import { AccountScreen, HomeScreen, ManagementScreen } from "../screens";
import { SafeAreaView } from "react-navigation";

const TabBarComponent = ({ navigation }) => {

    const onSelect = (index) => {
        const selectedTabRoute = navigation.state.routes[index];
        navigation.navigate(selectedTabRoute.routeName);
    };

    const tabIcon = (style, name) => (
        <Icon {...style} name={name} />
    );

    return (
        <SafeAreaView>
            <BottomNavigation
                appearance="noIndicator"
                selectedIndex={navigation.state.index}
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

export const BottomTabNavigator = createBottomTabNavigator({
    Management: ManagementScreen,
    Account: AccountScreen,
    Home: HomeScreen
}, {
    tabBarComponent: TabBarComponent,
});