import React from "react";
import { Icon, TopNavigation, TopNavigationAction } from "@ui-kitten/components";

export default function CustomerScreensHeader({ navigation }) {

    function getRightControl() {
        return ([
            <TopNavigationAction
                icon={style => <Icon {...style} name="shopping-cart-outline" />}
                onPress={() => navigation.navigate("CustomerCart")}
            />
        ]);
    }

    return (
        <TopNavigation 
            title="ĐỒ ÁN TỐT NGHIỆP"
            alignment="center"
            rightControls={getRightControl()}
        />
    );
}