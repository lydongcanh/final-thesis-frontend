import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { Layout, Button, Text, Card, Icon } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { CustomerOrderService } from "../../../../core/services";
import { formatCurrency, formatDateTime } from "../../../../core/utilities";
import { CUSTOMER_ORDER_TYPES } from "../../../../core/types";
import { OrderChangeStateModal, LoadErrorPanel, Space } from "../../../components/others";

export default function OrdersScreen({ navigation, route }) {

    const customer = route ? route.params.customer : null;

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState();
    const [changeStateModalVisible, setChangeStateModalVisible] = useState(false);
    const [changeOrderNextState, setChangeOrderNextState] = useState();
    const [selectedState, setSelectedState] = useState(CUSTOMER_ORDER_TYPES.Pending);

    useEffect(() => {
        loadOrders();
    }, [selectedState]);

    async function loadOrders() {
        try {
            setIsLoading(true);
            const result = await CustomerOrderService.query({ orderState: selectedState });
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
            showCustomerData: false
        });
    }

    function handleCancelOrderClick(order) {
        setSelectedOrder(order);
        setChangeOrderNextState(CUSTOMER_ORDER_TYPES.Cancelled);
        setChangeStateModalVisible(true);
    }

    function getCancelButton(order) {
        if (order.orderState != CUSTOMER_ORDER_TYPES.Pending)
            return;

        return (
            <Button 
                appearance="ghost"
                size="tiny"
                status="danger"
                icon={style => <Icon {...style} name="trash-outline" />}
                onPress={() => handleCancelOrderClick(order)}
            >
                Hủy
            </Button>
        );
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
            </Layout>
        );
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
                {getCancelButton(order)}
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
                    Thời gian đặt hàng: {formatDateTime(new Date(Date.parse(order.creationDate)))}
                </Text>
            </Card>
        );
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

    return (
        <Layout style={{ flex: 1, padding: 8 }}>
            {getConfigPanel()}
            {getOrderList(orders ? orders.filter(o => o.orderState == selectedState) : null)}
            <OrderChangeStateModal 
                order={selectedOrder}
                visible={changeStateModalVisible}
                setVisible={setChangeStateModalVisible}
                nextState={changeOrderNextState}
            />
        </Layout>
    );
}