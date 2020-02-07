import React from "react";
import { Layout } from "@ui-kitten/components";
import employees from "../../../test/mockData/employees.json";
import { EmployeeList } from "../components/employees";
import { ScrollView, SafeAreaView } from "react-native";
import { CategoryForm, CategoryTree, CategoryManageView } from "../components/categories";
import { Divider, Button } from "react-native-paper";
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
                    {/* <EmployeeList employees={employees} /> */}
                    <CategoryManageView />
                    <Divider/>
                </Layout>
                {/* <Button style={{ width: 150, alignSelf: "center" }} mode="contained" onPress={handleCategoriesButton}>Categories</Button> */}
            </SafeAreaView>
        </ScrollView>
    );
}