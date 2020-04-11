import React, { useState, useEffect } from "react";
import { Platform, StatusBar, FlatList } from "react-native";
import { Layout, Text, Card, RangeDatepicker, CalendarViewModes, NativeDateService, Select } from "@ui-kitten/components";
import { ActivityIndicator, Switch } from "react-native-paper";
import { EmployeeScreensHeader, LoadErrorPanel, Space } from "../../../components/others";
import { CUSTOMER_ORDER_TYPES, dateTimeLocale } from "../../../../core/types";
import { CustomerOrderService } from "../../../../core/services";
import { formatCurrency, formatDate } from "../../../../core/utilities";

export default function OrderScreen({ navigation }) {

    const dateData = [
        { text: "Chọn theo ngày", value: CalendarViewModes.DATE },
        { text: "Chọn theo tháng", value: CalendarViewModes.MONTH },
        { text: "Chọn theo năm", value: CalendarViewModes.YEAR },
    ];

    const [orders, setOrders] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showCompletedOrder, setShowCompletedOrder] = useState(false);
    const [dateRange, setDateRange] = useState({});
    const [dateRangeMode, setDateRangeMode] = useState(dateData[0]);

    const localeDateService = new NativeDateService("vi_VN", { dateTimeLocale, startDayOfWeek: 1 });

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            setIsLoading(true);
            const result = await CustomerOrderService.getAll();
            if (result.error) {
                console.log(result.error);
                setIsLoaded(false);
            } else {
                setOrders(result.data.sort((a, b) => {
                    return new Date(Date.parse(a.creationDate)) < new Date(Date.parse(b.creationDate));
                }));
                setIsLoaded(true);
            }
        } catch (e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    function getOrders() {
        if (showCompletedOrder)
            return orders;

        return orders.filter(o => {
            return o.orderState !== CUSTOMER_ORDER_TYPES.Completed &&
                   o.orderState !== CUSTOMER_ORDER_TYPES.Cancelled;
        });
    }

    function getOrderUI(order) {
        return (
            <Card
                onPress={() => alert(JSON.stringify(order, null, 2))}
                style={{ flex: 1, margin: 4, borderRadius: 8 }}
            >
                <Text appearance="hint">
                    Trạng thái: {order.orderState}
                </Text>
                <Text appearance="hint">
                    Giá: {formatCurrency(CustomerOrderService.calculateFinalPrice(order))}VND
                </Text>
                <Text appearance="hint">
                    Địa chỉ: {order.shipAddress.number}, {order.shipAddress.street}, {order.shipAddress.district}, {order.shipAddress.city}
                </Text>
                <Text appearance="hint">
                    Ngày đặt hàng: {formatDate(new Date(Date.parse(order.creationDate)))}
                </Text>
            </Card>
        );
    }

    function getConfigPanel() {
        return (
            <Layout>
                <Layout style={{ justifyContent: "flex-start", flexDirection: "row", alignItems: "center", margin: 4 }}>
                    <Text appearance="hint" category="label">Hiện hóa đơn đã xử lý</Text>
                    <Switch style={{ marginLeft: 4 }} value={showCompletedOrder} onValueChange={setShowCompletedOrder} />
                </Layout>
                <Layout style={{ justifyContent: "flex-start", flexDirection: "column", margin: 4 }}>
                    <Text appearance="hint" category="label">Thời gian</Text>
                    <Layout style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "flex-start", margin: 4 }}>
                        <Select 
                            data={dateData}
                            selectedOption={dateRangeMode}
                            onSelect={value => setDateRangeMode(value)}
                            style={{ flex: 5, marginRight: 8 }}
                        />
                        <RangeDatepicker 
                            range={dateRange} 
                            onSelect={setDateRange} 
                            startView={dateRangeMode.value}
                            dateService={localeDateService}
                            min={new Date(1900, 12, 31)}
                            max={new Date()}
                            style={{ flex: 4 }}
                        />
                    </Layout>
                </Layout>
            </Layout>
        );
    }

    function getOrderList() {
        return (
            <FlatList
                data={getOrders()}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => getOrderUI(item)}
            />
        );
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />

        if (!isLoaded)
            return <LoadErrorPanel onReload={loadOrders} />

        return (
            <Layout style={{ padding: 8 }}>
                {getConfigPanel()}
                <Space />
                {getOrderList()}
            </Layout>
        );
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <EmployeeScreensHeader navigation={navigation} />
            {getContentUI()}
        </Layout>
    );
}