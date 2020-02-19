import React from "react";
import { Layout } from "@ui-kitten/components";
import employees from "../../../test/mockData/employees.json";
import { EmployeeList } from "../components/employees";
import { ScrollView, SafeAreaView } from "react-native";
import { CategoryManageView } from "../components/categories";
import { Divider } from "react-native-paper";
import { CategoryService } from "../../core/services";

export default function TestScreen() {

    async function handleCategoriesButton() {
        try {
            const result = await CategoryService.getAll();
            alert(JSON.stringify(result, null, 2));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ScrollView>
            <SafeAreaView>
                <Layout>
                    <CategoryManageView />
                    <Divider />
                    <EmployeeList employees={employees} />
                </Layout>
            </SafeAreaView>
        </ScrollView>
    );
}