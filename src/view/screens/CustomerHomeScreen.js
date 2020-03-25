import React from "react";
import { Platform, StatusBar } from "react-native";
import { BottomNavigation, BottomNavigationTab, Icon } from "@ui-kitten/components";
import { SafeAreaView } from "react-navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CustomerAccountInfoScreen, CustomerMainScreen, CustomerFavouriteScreen, CustomerCartScreen } from ".";

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
                <BottomNavigationTab icon={(style) => tabIcon(style, "home")} title="Trang chủ" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "heart")} title="Yêu Thích" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "person")} title="Tài khoản" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "shopping-cart")} title="Giỏ hàng" />
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
                <Tab.Screen name="Home" component={CustomerMainScreen} />
                <Tab.Screen name="Favourite" component={CustomerFavouriteScreen} />
                <Tab.Screen name="AccountInfo" component={CustomerAccountInfoScreen} />
                <Tab.Screen name="Cart" component={CustomerCartScreen} />
            </Tab.Navigator>
        </SafeAreaView>
    )
}