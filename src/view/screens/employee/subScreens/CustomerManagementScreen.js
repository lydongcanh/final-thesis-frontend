import React from "react";
import { Image } from "react-native";
import { Layout, Card, Text } from "@ui-kitten/components";
import { CustomerService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";

export default function CustomerManagementScreen({ navigation }) {

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getCustomerListItemUI(customer) {
        return (
            <Card 
                style={{ margin: 16 }}
                onPress={() => alert(JSON.stringify(customer, null, 2))}
            >
                <Layout style={{ flexDirection: "row" }}>
                    <Image 
                        source={{ uri: customer.imagePath }}
                        style={{ borderRadius: 50, width: 50, height: 50 }}
                    />
                    <Layout style={{ margin: 8, alignContent: "center" }}>
                        <Text style={{ fontWeight: "bold" }}>{customer.name}</Text>
                        <Text appearance="hint">{customer.phoneNumber}</Text>
                    </Layout>
                </Layout>
            </Card>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await CustomerService.getAll()}
                handleConfigButton={handleConfigButton}
                getListItemUI={getCustomerListItemUI}
                navigation={navigation}
            />
        </Layout>
    );
}