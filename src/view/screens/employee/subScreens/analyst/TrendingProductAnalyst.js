import React from "react";
import { ScrollView } from "react-native";
import { Layout, Button, Text } from "@ui-kitten/components";
import { DataTable, Divider } from "react-native-paper";
import { Space } from "../../../../components/others";
import { formatCurrency, getMonths } from "../../../../../core/utilities";

export default function TrendingProductAnalyst({ route }) {

    const orders = route ? route.params.orders : null;

    function getOrdersWithMonth(month) {
        const result = [];
        for (const order of orders) {
            const date = new Date(Date.parse(order.creationDate));
            if ((date.getMonth() + 1) === month)
                result.push(order);
        }
        return result;
    }

    function getSum(orders) {
        let sum = 0;
        for (const detail of getOrderDetails(orders)) {
            sum += detail.purchasedPrice;
        }
        return sum;
    }

    function getDataRows(orderDetails) {
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
                    quantity: detail.quantity,
                    revenue: detail.purchasedPrice
                });
        }

        const data = [];
        rawData = rawData.sort((a, b) => a.quantity - b.quantity);
        for (const item of rawData) {
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

    function getOrderDetails(orders) {
        if (!orders || orders.length < 1)
            return [];

        const result = [];
        for (const order of orders) {
            result.push(...order.orderDetails);
        }
        return result;
    }

    function getTableUI(orders, month) {
        return (
            <Layout style={{ flex: 1 }}>
                <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontWeight: "bold", marginLeft: 16 }}>Tháng {month}</Text>
                    <Text style={{ marginRight: 16 }} appearance="hint">{formatCurrency(getSum(orders))}VNĐ</Text>
                </Layout>
                <Divider style={{ marginTop: 8 }} />
                <Layout style={{ flex: 1, paddingHorizontal: 8 }}>
                    <ScrollView>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Sản phẩm</DataTable.Title>
                                <DataTable.Title>Số lượng bán</DataTable.Title>
                                <DataTable.Title>Doanh thu</DataTable.Title>
                            </DataTable.Header>

                            {getDataRows(getOrderDetails(orders))}
                        </DataTable>
                    </ScrollView>
                </Layout>
            </Layout>
        );
    }

    function getContentUI() {
        return getMonths().map(month => {
            return getTableUI(getOrdersWithMonth(month), month);
        });
    }

    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            <Space />
            {getContentUI()}
        </Layout>
    )
}