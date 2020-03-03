import React, { useState } from "react";
import EmployeeList from "./EmployeeList.js";
import { ScrollView } from "react-native";
import { Layout } from "@ui-kitten/components";
import { SearchInput, Space } from "../others/index.js";
import { FAB, Dialog, Portal } from "react-native-paper";
import { EmployeeManageForm } from ".";

export default function EmployeeManageView() {

    const [searchText, setSearchText] = useState("");
    const [isFABOpen, setIsFABOpen] = useState(false);
    const [isManageFormOpen, setIsManageFormOpen] = useState(false);

    const fabActions = [
        { icon: "plus", label: "Thêm nhân viên", onPress: () => setIsManageFormOpen(true) }
    ];

    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            <Space value={4}/>
            <SearchInput
                placeHolder="Nhập tên nhân viên"
                onChangeText={setSearchText}
            />
            <ScrollView>
                <EmployeeList searchText={searchText}/>
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