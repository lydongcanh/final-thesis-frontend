import React from "react";
import { useSelector } from "react-redux";
import { BottomNavigation, BottomNavigationTab, Icon } from "@ui-kitten/components";
import { SafeAreaView } from "react-navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { EmployeeAnalystScreen, EmployeeAccountInfoScreen, EmployeeManagementScreen, EmployeeOrderScreen } from ".";
import { JOB_TITLES } from "../../core/types";

const Tab = createBottomTabNavigator();

const TabBarComponent = ({ navigation, state }) => {

    const auth = useSelector(state => state.authReducer);
    const account = auth.account;

    const onSelect = (index) => {
        const screenName = state.routeNames[index];
        navigation.navigate(screenName);
    };

    const tabIcon = (style, name) => (
        <Icon {...style} name={name} />
    );

    if (account && account.employee && account.employee.jobTitle === JOB_TITLES[0]) { // Bán hàng
        return (
            <SafeAreaView>
                <BottomNavigation
                    appearance="noIndicator"
                    selectedIndex={state.index}
                    onSelect={onSelect}
                    style={{ borderTopColor: "#e6e6e6", borderTopWidth: 0.5 }}
                >
                    <BottomNavigationTab icon={(style) => tabIcon(style, "shopping-bag-outline")} title="Đơn hàng" />
                    <BottomNavigationTab icon={(style) => tabIcon(style, "person-outline")} title="Tài khoản" />
                </BottomNavigation>
            </SafeAreaView>
        );    
    } else {  // Quản lý
        return (
            <SafeAreaView>
                <BottomNavigation
                    appearance="noIndicator"
                    selectedIndex={state.index}
                    onSelect={onSelect}
                    style={{ borderTopColor: "#e6e6e6", borderTopWidth: 0.5 }}
                >
                    <BottomNavigationTab icon={(style) => tabIcon(style, "bar-chart-outline")} title="Thống kê" />
                    <BottomNavigationTab icon={(style) => tabIcon(style, "shopping-bag-outline")} title="Đơn hàng" />
                    <BottomNavigationTab icon={(style) => tabIcon(style, "settings-2-outline")} title="Quản lý" />
                    <BottomNavigationTab icon={(style) => tabIcon(style, "person-outline")} title="Tài khoản" />
                </BottomNavigation>
            </SafeAreaView>
        );
    }
};

export default function EmployeeHomeScreen({ navigation }) {

    const auth = useSelector(state => state.authReducer);
    const account = auth.account;

    if (account && account.employee && account.employee.jobTitle === JOB_TITLES[0]) { // Bán hàng
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Tab.Navigator tabBar={props => <TabBarComponent {...props} />}>
                    <Tab.Screen name="Order" component={EmployeeOrderScreen} />
                    <Tab.Screen name="AccountInfo" component={EmployeeAccountInfoScreen} />
                </Tab.Navigator>
            </SafeAreaView>
        );
    } else { // Quản lý
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
}