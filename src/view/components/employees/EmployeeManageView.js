import React, { useState } from "react";
import employees from "../../../../test/mockData/employees.json";
import EmployeeList from "./EmployeeList.js";
import { ScrollView } from "react-native";
import { Layout } from "@ui-kitten/components";
import { SearchInput } from "../others/index.js";
import { FAB, Dialog, Portal } from "react-native-paper";
import { EmployeeManageForm } from ".";

export default function EmployeeManageView() {

    const [isFABOpen, setIsFABOpen] = useState(false);
    const [isManageFormOpen, setIsManageFormOpen] = useState(false);

    const fabActions = [
        { icon: "plus", label: "Thêm nhân viên", onPress: () => setIsManageFormOpen(true) }
    ];

    function handleSearchTextChange(text) {
    }

    function handleSearch(text) {
        alert(text);
    }

    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            <SearchInput
                placeHolder="Nhập tên nhân viên, email, sđt..."
                onChangeText={handleSearchTextChange}
                onSearch={handleSearch}
            />
            <ScrollView>
                <EmployeeList employees={employees} />
            </ScrollView>
            <FAB.Group
                open={isFABOpen}
                onStateChange={({ open }) => setIsFABOpen(open)}
                actions={fabActions}
                icon={isFABOpen ? "close" : "settings"}
            />
            <Portal>
                <Dialog visible={isManageFormOpen}>
                    <EmployeeManageForm 
                        onOk={() => setIsManageFormOpen(false)}
                        onCancel={() => setIsManageFormOpen(false)}
                    />
                </Dialog>
            </Portal>
        </Layout>
    );
}