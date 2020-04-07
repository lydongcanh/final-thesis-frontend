import React from "react";
import { BottomNavigation, BottomNavigationTab, Icon } from "@ui-kitten/components";
import { SafeAreaView } from "react-navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { EmployeeAnalystScreen, EmployeeAccountInfoScreen, EmployeeManagementScreen, EmployeeOrderScreen } from ".";

const Tab = createBottomTabNavigator();

const TabBarComponent = ({ navigation, state }) => {

    const onSelect = (index) => {
        const screenName = state.routeNames[index];
        navigation.navigate(screenName);
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
                <BottomNavigationTab icon={(style) => tabIcon(style, "bar-chart")} title="Thống kê" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "shopping-bag")} title="Đơn hàng" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "settings-2")} title="Quản lý" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "person")} title="Tài khoản" />
            </BottomNavigation>
        </SafeAreaView>
    );
};

export default function EmployeeHomeScreen({ navigation }) {
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Tab.Navigator tabBar={props => <TabBarComponent {...props} />}>
                <Tab.Screen name="Analyst" component={EmployeeAnalystScreen} />
                <Tab.Screen name="Order" component={EmployeeOrderScreen} />
                <Tab.Screen name="Management" component={EmployeeManagementScreen} />
                <Tab.Screen name="AccountInfo" component={EmployeeAccountInfoScreen} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}