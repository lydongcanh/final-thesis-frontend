import React from "react";
import { Layout, Text } from "@ui-kitten/components";

export default function CustomerDetailsManagementScreen({ route }) {
    const customer = route ? route.params.customer : null;

    return (
        <Layout style={{ flex: 1, padding: 16 }}>
            <Text>Tên: {customer.name}</Text>
            <Text>Email: {customer.email}</Text>
        </Layout>
    );
}