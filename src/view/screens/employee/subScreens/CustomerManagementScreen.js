import React, { useState } from "react";
import { Image } from "react-native";
import { Layout, Card, Text, Button } from "@ui-kitten/components";
import { CustomerService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";

export default function CustomerManagementScreen({ navigation }) {

    const [data, setData] = useState([]);

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getCustomerListItemUI(customer) {
        return (
            <Card 
                style={{ margin: 16 }}
                onPress={() => alert(JSON.stringify(customer, null, 2))}
            >
                <Layout style={{ flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)", alignItems: "center" }}>
                    <Image 
                        source={{ uri: customer.imagePath }}
                        style={{ borderRadius: 50, width: 50, height: 50 }}
                    />
                    <Layout style={{ margin: 8, alignContent: "center", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                        <Layout style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                            <Text style={{ fontWeight: "bold" }}>{customer.name}</Text>
                            {/* <Button 
                                disabled
                                size="tiny"
                                style={{ borderRadius: 20, marginLeft: 8 }}
                            > 
                                {customer.vipLevel}
                            </Button> */}
                        </Layout>
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
                data={data}
                setData={setData}
                navigation={navigation}
            />
        </Layout>
    );
}