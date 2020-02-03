import React from "react";
import { Layout } from "@ui-kitten/components";
import employees from "../../../test/mockData/employees.json";
import { EmployeeList } from "../components/employees";
import { ScrollView } from "react-native";
import CategoryTree from "../components/categories/CategoryTree.js";

export default function TestScreen() {
    return (
        <ScrollView>
            <Layout>
                {/* <EmployeeList employees={employees} /> */}
                <CategoryTree />
            </Layout>
        </ScrollView>
    );
}