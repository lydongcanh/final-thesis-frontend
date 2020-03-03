import React, { useState } from "react";
import { TabView, Tab } from "@ui-kitten/components";
import { LoginPanel, CustomerSignupPanel } from ".";

export default function UserAccountView() {

    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);

    return (
        <TabView
            indicatorStyle={{ height : 1 }}
            onSelect={setTabSelectedIndex}
            selectedIndex={tabSelectedIndex}
            style={{flex: 1}}
        >
            <Tab title="Đăng nhập">
                <LoginPanel />
            </Tab>
            <Tab title="Đăng ký">
                <CustomerSignupPanel />
            </Tab>
        </TabView>
    )
}