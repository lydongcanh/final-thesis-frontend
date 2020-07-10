import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Platform, StatusBar, FlatList } from "react-native";
import { Layout, Text, Card, Datepicker, Button, Icon,
         CalendarViewModes, NativeDateService, CheckBox } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { EmployeeScreensHeader, LoadErrorPanel, OrderChangeStateModal, Space } from "../../../components/others";
import { CUSTOMER_ORDER_TYPES, dateTimeLocale } from "../../../../core/types";
import { CustomerOrderService } from "../../../../core/services";
import { formatCurrency, formatDate } from "../../../../core/utilities";

export default function OrderScreen({ navigation }) {

    const [orders, setOrders] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [allTimeValue, setAllTimeValue] = useState(true);
    const [selectedState, setSelectedState] = useState(CUSTOMER_ORDER_TYPES.Pending);
    const [selectedOrder, setSelectedOrder] = useState();
    const [changeStateModalVisible, setChangeStateModalVisible] = useState(false);
    const [changeOrderNextState, setChangeOrderNextState] = useState();

    const auth = useSelector(state => state.authReducer);
    const account = auth ? auth.account : null;
    const employee = account ? account.employee : null;
    
    const localeDateService = new NativeDateService("vi_VN", { dateTimeLocale, startDayOfWeek: 1 });

    useEffect(() => {
        loadOrders();
    }, [selectedState, allTimeValue, fromDate, toDate]);

    async function loadOrders() {
        try {
            setIsLoading(true);
            const result = allTimeValue 
                            ? await CustomerOrderService.query({ orderState: selectedState })
                            : await CustomerOrderService.query({ orderState: selectedState, fromDate: fromDate, toDate: toDate });
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

    function handleOrderDetailClick(order) {
        navigation.navigate("OrderDetails", {
            order: order,
            showCustomerData: true
        });
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
                    {getNextStateText(nextState)}
                </Button>
            );
        }

        function getNextStateText(nextState) {
            if (nextState === CUSTOMER_ORDER_TYPES.Delivering)
                return "Xác nhận";

            return nextState;
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
                disabled
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
                <FlatList 
                    horizontal
                    data={[CUSTOMER_ORDER_TYPES.Pending, CUSTOMER_ORDER_TYPES.Delivering, CUSTOMER_ORDER_TYPES.Completed, CUSTOMER_ORDER_TYPES.Cancelled]}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Button
                            style={{ marginRight: 8, marginTop: 4, borderRadius: 24 }}
                            status={item === selectedState ? "info" : "basic"}
                            size="tiny"
                            onPress={() => setSelectedState(item)}
                        >
                            {item}
                        </Button>
                    )}
                />
                <Space />

                <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <CheckBox
                        style={{ alignItems: "flex-start", top: 10 }}
                        status="info"
                        text={"Tất cả"}
                        checked={allTimeValue}
                        onChange={setAllTimeValue}
                    />
                    {getTimeConfigPanel()}
                </Layout>
                <Space />
            </Layout>
        );

        function getTimeConfigPanel() {
            if (allTimeValue)
                return;

            return (
                <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text category="label" style={{ top: 15 }}>Từ </Text>
                    <Datepicker
                        date={fromDate}
                        onSelect={setFromDate}
                        max={new Date()}
                    />
                    <Space />
                    <Text category="label" style={{ top: 15 }}>Đến </Text>
                    <Datepicker
                        date={toDate}
                        onSelect={setToDate}
                        max={new Date()}
                    />
                </Layout>
            )
        }
    }

    function getOrderList(orders) {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />

        if (!isLoaded)
            return <LoadErrorPanel onReload={loadOrders} />

        if (!orders || orders.length < 1) {
            return (
                <Text category="p2" style={{ alignSelf: "center", marginTop: 24 }}>
                    Hiện không có hóa đơn nào trong trạng thái cần tìm.
                </Text>
            );
        }

        return (
            <FlatList
                data={orders}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => getOrderUI(item)}
            />
        );
    }

    function getContentUI() {
        if (!orders)
            return;

        return (
            <Layout style={{ flex: 1, padding: 8 }}>
                {getConfigPanel()}
                {getOrderList(orders.filter(o => o.orderState == selectedState))}
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
                employee={employee}
            />
        </Layout>
    );
}