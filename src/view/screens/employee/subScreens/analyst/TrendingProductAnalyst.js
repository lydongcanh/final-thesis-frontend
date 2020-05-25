import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Layout, Button, Text, Icon, TabView, Tab } from "@ui-kitten/components";
import { DataTable, Divider } from "react-native-paper";
import { Space, QuarterSelector, YearSelector } from "../../../../components/others";
import { formatCurrency, getMonthsWithQuarter } from "../../../../../core/utilities";

export default function TrendingProductAnalyst({ route }) {

    const [orders, setOrders] = useState(route ? route.params.orders : []);
    const [year, setYear] = useState(new Date().getFullYear());
    const [quarter, setQuarter] = useState(getCurrentQuarter());
    const [availableYears, setAvailableYears] = useState(getAvailableYears(route ? route.params.orders : []));
    const [tabViewIndex, setTabViewIndex] = useState(0);

    function getAvailableYears(orders) {
        if (!orders || orders.length < 1)
            return [];

        const years = [];
        for (const order of orders) {
            const year = new Date(Date.parse(order.creationDate)).getFullYear();
            if (!years.includes(year))
                years.push(year);
        }
        return years;
    }

    function getCurrentQuarter() {
        const currentMonth = new Date().getMonth();
        if (currentMonth < 4)
            return 1;
    
        if (currentMonth < 7)
            return 2;
    
        if (currentMonth < 10)
            return 3;
    
        return 4;
    }

    function getOrdersWithMonth(month) {
        const result = [];
        for (const order of orders) {
            const date = new Date(Date.parse(order.creationDate));
            if ((date.getMonth() + 1) === month && date.getFullYear() === year)
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

    function getQuantity(orders) {
        let quantity = 0;
        for (const detail of getOrderDetails(orders)) {
            quantity += detail.quantity;
        }
        return quantity;
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
        if (!orders || orders.length < 1)
            return <Text appearance="hint" style={{ textAlign: "center", marginTop: 16 }}>Không có thông tin.</Text>;

        return (
            <Layout key={(month + 1).toString()} style={{ flex: 1 }}>
                <Layout key={(month + 2).toString()} style={{ marginLeft: 16 }}>
                    <Text 
                        key={(month + 4).toString()} 
                        category="label" 
                        appearance="hint"
                    >
                        Tổng doanh thu: {formatCurrency(getSum(orders))}VNĐ
                    </Text>
                    <Text
                        key={(month + 5).toString()} 
                        category="label" 
                        appearance="hint"
                    >
                        Tổng sản phẩm tiêu thụ: {getQuantity(orders)}
                    </Text>
                </Layout>
                <Divider key={(month + 6).toString()} style={{ marginTop: 8 }} />
                <Layout key={(month + 7).toString()} style={{ flex: 1, paddingHorizontal: 8 }}>
                    <ScrollView key={(month + 8).toString()}>
                        <DataTable key={(month + 9).toString()}>
                            <DataTable.Header key={(month + 10).toString()}>
                                <DataTable.Title key={(month + 11).toString()}>Sản phẩm</DataTable.Title>
                                <DataTable.Title key={(month + 12).toString()}>Số lượng bán</DataTable.Title>
                                <DataTable.Title key={(month + 13).toString()}>Doanh thu</DataTable.Title>
                            </DataTable.Header>

                            {getDataRows(getOrderDetails(orders))}
                        </DataTable>
                    </ScrollView>
                </Layout>
            </Layout>
        );
    }

    function getContentUI() {
        const months = getMonthsWithQuarter(quarter);
        return (
            <TabView
                indicatorStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                selectedIndex={tabViewIndex}
                onSelect={setTabViewIndex}
                shouldLoadComponent={index => index === tabViewIndex}
                style={{ flex: 1 }}
            >
                <Tab title={"Tháng " + months[0]}>
                    {getTableUI(getOrdersWithMonth(months[0]), months[0])}
                </Tab>
                <Tab title={"Tháng " + months[1]}>
                    {getTableUI(getOrdersWithMonth(months[1]), months[1])}
                </Tab>
                <Tab title={"Tháng " + months[2]}>
                    {getTableUI(getOrdersWithMonth(months[2]), months[2])}
                </Tab>
            </TabView>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <YearSelector data={availableYears} year={year} setYear={setYear} />
            <QuarterSelector quarter={quarter} setQuarter={setQuarter} />

            <Divider style={{ marginVertical: 8 }} />
            {getContentUI()}
        </Layout>
    )
}