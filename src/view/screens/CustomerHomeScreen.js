import React from "react";
import { useSelector } from "react-redux";
import { BottomNavigation, BottomNavigationTab, Icon  } from "@ui-kitten/components";
import { SafeAreaView } from "react-navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CustomerAccountInfoScreen, CustomerMainScreen, CustomerFavouriteScreen, CustomerSearchScreen } from ".";

const Tab = createBottomTabNavigator();

const TabBarComponent = ({ navigation, state }) => {

    const auth = useSelector(state => state.authReducer);

    const onSelect = (index) => {
        const screenName = state.routeNames[index];
        if (screenName === "Favourite" && !auth.loggedIn) {
            navigation.navigate("Login");
        } else {
            navigation.navigate(screenName);
        }
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
                <BottomNavigationTab icon={(style) => tabIcon(style, "home-outline")} title="Trang chủ" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "search-outline")} title="Tìm kiếm" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "heart-outline")} title="Yêu thích" />
                <BottomNavigationTab icon={(style) => tabIcon(style, "person-outline")} title="Tài khoản" />
            </BottomNavigation>
        </SafeAreaView>
    );
};

export default function CustomerHomeScreen({ navigation }) {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Tab.Navigator tabBar={props => <TabBarComponent {...props} />}>
                <Tab.Screen name="Home" component={CustomerMainScreen} />
                <Tab.Screen name="Search" component={CustomerSearchScreen} />
                <Tab.Screen name="Favourite" component={CustomerFavouriteScreen} />
                <Tab.Screen name="AccountInfo" component={CustomerAccountInfoScreen} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}