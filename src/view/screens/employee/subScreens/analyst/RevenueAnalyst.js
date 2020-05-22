import React from "react";
import { Layout } from "@ui-kitten/components";

export default function RevenueAnalyst({ route }) {

    const orderDetails = route ? route.params.orderDetails : null;
    
    return (
        <Layout style={{ flex: 1 }}>

        </Layout>
    )
}