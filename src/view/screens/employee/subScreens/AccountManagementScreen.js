import React, { useState } from "react";
import { Layout, Text, Card } from "@ui-kitten/components";
import { AccountService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";

export default function CollectionManagementScreen({ navigation }) {

    const [data, setData] = useState([]);

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getAccountListItemUI(account) {
        return (
            <Card 
                style={{ margin: 16 }}
                onPress={() => alert(JSON.stringify(account, null, 2))}
            >
                <Text style={{ fontWeight: "bold" }}>{account.username}</Text>
                <Text appearance="hint">{account.accountType}</Text>
            </Card>
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
            />
        </Layout>
    );
}