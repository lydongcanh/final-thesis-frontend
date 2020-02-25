import React, { useState } from "react";
import { ScrollView, Platform, StatusBar } from "react-native";
import { Layout, TabView, Tab } from "@ui-kitten/components";
import { CategoryManageView } from "../components/categories";
import { EmployeeList } from "../components/employees";
import employees from "../../../test/mockData/employees.json";

export default function ManagementScreen() {

    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);

    return (
        <Layout style={{ 
            flex: 1, 
            justifyContent: "flex-start", 
            alignContent: "center", 
            padding: 8,
            marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
        }}>
            <TabView
                indicatorStyle={{ height: 1 }}
                onSelect={setTabSelectedIndex}
                selectedIndex={tabSelectedIndex}
                style={{ flex: 1 }}
            >
                <Tab title="Category">
                    <CategoryManageView />
                </Tab>
                <Tab title="Employee">
                    <ScrollView >
                        <EmployeeList employees={employees} />
                    </ScrollView>
                </Tab>
            </TabView>
        </Layout>
    )
}