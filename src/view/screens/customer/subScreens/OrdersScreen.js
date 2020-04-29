import React from "react";
import { Layout, Button } from "@ui-kitten/components";

export default function OrdersScreen({ navigation, route }) {

    const customer = route ? route.params.customer : null;
    const orders = route ? route.params.orders : null;

    return (
        <Layout style={{ flex: 1, padding: 8 }}>
            <Layout style={{ flexDirection: "row", justifyContent: "space-between"}}>
                <Button onPress={() => alert(JSON.stringify(customer, null, 2))}>Thông tin khách hàng</Button>
                <Button onPress={() => alert(JSON.stringify(orders, null, 2))}>Thông tin hóa đơn</Button>
            </Layout>
        </Layout>
    );
}