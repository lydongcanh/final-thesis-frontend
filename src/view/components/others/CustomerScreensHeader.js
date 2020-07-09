import React from "react";
import { useSelector } from "react-redux";
import { Icon, TopNavigation, TopNavigationAction } from "@ui-kitten/components";

export default function CustomerScreensHeader({ navigation }) {

    const auth = useSelector(state => state.authReducer);
   
    function handleCartButton() {
        if (auth.loggedIn && auth.account) {
            navigation.navigate("CustomerCart", { account: auth.account })
        } else {
            navigation.navigate("Login", { shouldGoBack: true });
        }
    }

    function getRightControl() {
        return ([
            <TopNavigationAction
                icon={style => <Icon {...style} name="shopping-bag-outline" />}
                onPress={handleCartButton}
            />
        ]);
    }

    return (
        <TopNavigation 
            title="MASSEW SHOP"
            alignment="center"
            rightControls={getRightControl()}
        />
    );
}