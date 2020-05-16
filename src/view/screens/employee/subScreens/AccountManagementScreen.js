import React, { useState } from "react";
import { FlatList } from "react-native";
import { Button, Layout, Text, Card, TabView, Tab, CardHeader } from "@ui-kitten/components";
import { AccountService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";
import { ACCOUNT_TYPES } from "../../../../core/types";

export default function CollectionManagementScreen({ navigation }) {

    const [data, setData] = useState([]);
    const [tabViewIndex, setTabViewIndex] = useState(0);

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getAccountListItemUI(account) {
        return (
            <Card 
                style={{ margin: 16 }}
                status={account.isActive ? "success" : "danger"}
                onPress={() => alert(JSON.stringify(account, null, 2))}
                header={() => <CardHeader title="" />}
            >
                <Text style={{ fontWeight: "bold" }}>{account.username}</Text>
            </Card>
        );
    }

    function getListUI(listData) {
        return (
            <FlatList
                data={listData}
                keyExtractor={(_, item) => item.toString()}
                renderItem={({ item }) => getAccountListItemUI(item)}
            />
        );
    }

    function getTabViewUI() {
        return (
            <TabView
                indicatorStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                selectedIndex={tabViewIndex}
                onSelect={setTabViewIndex}
            >
                <Tab title="Nhân viên">
                    {getListUI(data.filter(a => a.accountType === ACCOUNT_TYPES.Employee))}
                </Tab>
                <Tab title="Khách hàng">
                    {getListUI(data.filter(a => a.accountType === ACCOUNT_TYPES.Customer))}
                </Tab>
            </TabView>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await AccountService.getAll()}
                handleConfigButton={handleConfigButton}
                getListItemUI={getAccountListItemUI}
                data={data}
                setData={setData}
                navigation={navigation}
                getOverrideListUI={getTabViewUI}
            />
        </Layout>
    );
}