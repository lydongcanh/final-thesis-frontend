import React, { useState } from "react";
import { ScrollView } from "react-native";
import { TabView, Tab } from "@ui-kitten/components";
import { CategoryManageView } from "../components/categories";
import { EmployeeList } from "../components/employees";
import employees from "../../../test/mockData/employees.json";

export default function ManagementScreen() {

    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);

    return (
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
    )
}