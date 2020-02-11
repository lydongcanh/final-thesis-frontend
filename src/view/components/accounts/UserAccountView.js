import React, { useState } from "react";
import { TabView, Tab } from "@ui-kitten/components";
import { LoginPanel, UserSignupPanel } from ".";

export default function UserAccountView() {

    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);

    return (
        <TabView
            onSelect={setTabSelectedIndex}
            selectedIndex={tabSelectedIndex}
        >
            <Tab title="Login">
                <LoginPanel />
            </Tab>
            <Tab title="Sign Up">
                <UserSignupPanel />
            </Tab>
        </TabView>
    )
}