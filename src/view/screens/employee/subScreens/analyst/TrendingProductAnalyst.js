import React from "react";
import { ScrollView } from "react-native";
import { Layout, Button } from "@ui-kitten/components";
import { DataTable } from "react-native-paper";
import { formatCurrency } from "../../../../../core/utilities";

export default function TrendingProductAnalyst({ route }) {

    const orderDetails = route ? route.params.orderDetails : null;

    function getDataRows() {
        let rawData = [];
        for (const detail of orderDetails) {
            let existFlag = false;
            for (let i = 0; i < rawData.length; i++) {
                if (rawData[i].productId === detail.productDetails.product.id) {
                    rawData[i].quantity += detail.quantity;
                    rawData[i].revenue += detail.purchasedPrice;
                    existFlag = true;
                    break;
                }
            }

            if (!existFlag)
                rawData.push({
                    productId: detail.productDetails.product.id,
                    name: detail.productDetails.product.name,
                    quantity: 0,
                    revenue: 0
                });
        }

        const data = [];
        rawData = rawData.sort((a, b) => a.quantity - b.quantity);
        for(const item of rawData) {
            data.push((
                <DataTable.Row key={item.id}>
                    <DataTable.Cell key={item.id + "1"}>{item.name}</DataTable.Cell>
                    <DataTable.Cell key={item.id + "2"}>{item.quantity}</DataTable.Cell>
                    <DataTable.Cell key={item.id + "3"}>{formatCurrency(item.revenue)}VNĐ</DataTable.Cell>
                </DataTable.Row>
            ));
        }
        return data;
    }

    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            <ScrollView>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Sản phẩm</DataTable.Title>
                        <DataTable.Title>Số lượng bán</DataTable.Title>
                        <DataTable.Title>Doanh thu</DataTable.Title>
                    </DataTable.Header>

                    {getDataRows()}
                </DataTable>
            </ScrollView>
        </Layout>
    )
}