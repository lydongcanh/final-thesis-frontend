import React, { useState, useEffect } from "react";
import { Platform, StatusBar, FlatList } from "react-native";
import { Layout, Text, Card, RangeDatepicker, Button, Icon,
         CalendarViewModes, NativeDateService, Select, Tab, TabView } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { EmployeeScreensHeader, LoadErrorPanel, OrderChangeStateModal, OrderDetailsModal } from "../../../components/others";
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
    const [dateRange, setDateRange] = useState({});
    const [dateRangeMode, setDateRangeMode] = useState(dateData[0]);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState();
    const [changeStateModalVisible, setChangeStateModalVisible] = useState(false);
    const [changeOrderNextState, setChangeOrderNextState] = useState();
    const [orderDetailsModalVisible, setOrderDetailsModalVisible] = useState(false);

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

    function getOrders(type) {
        return orders.filter(o => o.orderState === type);
    }

    function handleOrderDetailClick(order) {
        setSelectedOrder(order);
        setOrderDetailsModalVisible(true);
    }

    function handleOrderChangeState(order, nextState) {
        setSelectedOrder(order);
        setChangeOrderNextState(nextState);
        setChangeStateModalVisible(true);
    }

    function getHandleButtons(order) {
        if (order.orderState === CUSTOMER_ORDER_TYPES.Pending)
            return (
                <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    {getHandleButton(order, CUSTOMER_ORDER_TYPES.Delivering)}
                    {getCancelButton(order)}
                </Layout>
            );

        if (order.orderState === CUSTOMER_ORDER_TYPES.Delivering)
            return (
                <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    {getHandleButton(order, CUSTOMER_ORDER_TYPES.Completed)}
                    {getCancelButton(order)}
                </Layout>
            );

        function getCancelButton(order) {
            return (
                <Button 
                    appearance="ghost"
                    size="tiny"
                    status="danger"
                    icon={style => <Icon {...style} name="trash-outline" />}
                    onPress={() => handleOrderChangeState(order, CUSTOMER_ORDER_TYPES.Cancelled)}
                >
                    Hủy
                </Button>
            );
        }

        function getHandleButton(order, nextState) {
            return (
                <Button 
                    appearance="ghost"
                    size="tiny"
                    icon={style => <Icon {...style} name="arrow-right-outline" />}
                    onPress={() => handleOrderChangeState(order, nextState)}
                >
                    {nextState}
                </Button>
            );
        }
    }

    function getOrderFooterUI(order) {
        return (
            <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Button 
                    appearance="ghost"
                    size="tiny"
                    icon={style => <Icon {...style} name="edit-2-outline" />}
                    onPress={() => handleOrderDetailClick(order)}
                >
                    Chi tiết
                </Button>
                {getHandleButtons(order)}
            </Layout>
        );
    }

    function getOrderUI(order) {
        return (
            <Card
                onPress={() => alert(JSON.stringify(order, null, 2))}
                style={{ flex: 1, margin: 4, borderRadius: 8 }}
                footer={() => getOrderFooterUI(order)}
            >
                <Text appearance="hint">
                    Giá: {formatCurrency(CustomerOrderService.calculateFinalPrice(order))}VND
                </Text>
                <Text appearance="hint">
                    Địa chỉ: {order.shipAddress.number}, {order.shipAddress.street}, {order.shipAddress.district}, {order.shipAddress.city}
                </Text>
                <Text appearance="hint">
                    Ngày đặt hàng: {formatDate(new Date(Date.parse(order.creationDate)))}
                </Text>
                {getDescriptionUI()}
            </Card>
        );

        function getDescriptionUI() {
            if (order.description && order.description !== "")
                return (
                    <Text appearance="hint">
                        Chú thích: {order.description}
                    </Text>
                );
        }
    }

    function getConfigPanel() {
        return (
            <Layout>
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

    function getOrderList(orders) {
        return (
            <FlatList
                data={orders}
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
                {/* {getConfigPanel()}
                <Space /> */}
                <TabView
                    indicatorStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                    selectedIndex={selectedTabIndex}
                    onSelect={setSelectedTabIndex}
                >
                    <Tab title={CUSTOMER_ORDER_TYPES.Pending}>
                        {getOrderList(getOrders(CUSTOMER_ORDER_TYPES.Pending))}
                    </Tab>
                    <Tab title={CUSTOMER_ORDER_TYPES.Delivering}>
                        {getOrderList(getOrders(CUSTOMER_ORDER_TYPES.Delivering))}
                    </Tab>
                    <Tab title={CUSTOMER_ORDER_TYPES.Completed}>
                        {getOrderList(getOrders(CUSTOMER_ORDER_TYPES.Completed))}
                    </Tab>
                    <Tab title={CUSTOMER_ORDER_TYPES.Cancelled}>
                        {getOrderList(getOrders(CUSTOMER_ORDER_TYPES.Cancelled))}
                    </Tab>
                </TabView>
            </Layout>
        );
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <EmployeeScreensHeader navigation={navigation} />
            {getContentUI()}
            <OrderChangeStateModal 
                order={selectedOrder}
                visible={changeStateModalVisible}
                setVisible={setChangeStateModalVisible}
                nextState={changeOrderNextState}
            />
            <OrderDetailsModal 
                visible={orderDetailsModalVisible}
                setVisible={setOrderDetailsModalVisible}
                order={selectedOrder}
                showCustomerData={true}
            />
        </Layout>
    );
}