import React from "react";
import { Icon, TopNavigation, TopNavigationAction } from "@ui-kitten/components";

export default function EmployeeScreensHeader({ navigation }) {
   
    function handleToCustomerHomeButton() {
        navigation.navigate("CustomerHome");
    }

    function getRightControl() {
        return ([
            <TopNavigationAction
                icon={style => <Icon {...style} name="log-in-outline" />}
                onPress={handleToCustomerHomeButton}
            />
        ]);
    }

    return (
        <TopNavigation 
            title="ĐỒ ÁN TỐT NGHIỆP"
            alignment="center"
            //rightControls={getRightControl()}
        />
    );
}