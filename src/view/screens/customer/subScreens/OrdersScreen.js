import React, { useState } from "react";
import { FlatList } from "react-native";
import { Layout, Button, Tab, TabView, Text, Card, Icon } from "@ui-kitten/components";
import { CustomerOrderService } from "../../../../core/services";
import { formatDate, formatCurrency } from "../../../../core/utilities";
import { CUSTOMER_ORDER_TYPES } from "../../../../core/types";
import { OrderChangeStateModal } from "../../../components/others";

export default function OrdersScreen({ navigation, route }) {

    const customer = route ? route.params.customer : null;
    const orders = route ? route.params.orders : null;

    const [selectedOrder, setSelectedOrder] = useState();
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [changeStateModalVisible, setChangeStateModalVisible] = useState(false);
    const [changeOrderNextState, setChangeOrderNextState] = useState();

    function handleOrderDetailClick(order) {
        navigation.navigate("OrderDetails", {
            order: order,
            showCustomerData: false
        });
    }

    function getOrders(type) {
        return orders.filter(o => o.orderState === type);
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
                    Ngày đặt hàng: {formatDate(new Date(Date.parse(order.creationDate)))}
                </Text>
            </Card>
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

    return (
        <Layout style={{ flex: 1, padding: 8 }}>
            <TabView
                indicatorStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                selectedIndex={selectedTabIndex}
                onSelect={setSelectedTabIndex}
                style={{ flex: 1 }}
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
            <OrderChangeStateModal 
                order={selectedOrder}
                visible={changeStateModalVisible}
                setVisible={setChangeStateModalVisible}
                nextState={changeOrderNextState}
            />
        </Layout>
    );
}