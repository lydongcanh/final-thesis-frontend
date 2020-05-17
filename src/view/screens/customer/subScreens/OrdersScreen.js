import React, { useState } from "react";
import { FlatList } from "react-native";
import { Layout, Button, Tab, TabView, Text, Card, Icon } from "@ui-kitten/components";
import { CustomerOrderService } from "../../../../core/services";
import { formatDate, formatCurrency } from "../../../../core/utilities";
import { CUSTOMER_ORDER_TYPES } from "../../../../core/types";
import { OrderDetailsModal } from "../../../components/others";

export default function OrdersScreen({ navigation, route }) {

    const customer = route ? route.params.customer : null;
    const orders = route ? route.params.orders : null;

    const [selectedOrder, setSelectedOrder] = useState();
    const [orderDetailsModalVisible, setOrderDetailsModalVisible] = useState(false);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);

    function handleOrderDetailClick(order) {
        setSelectedOrder(order);
        setOrderDetailsModalVisible(true);
    }

    function getOrders(type) {
        return orders.filter(o => o.orderState === type);
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
            <OrderDetailsModal 
                visible={orderDetailsModalVisible}
                setVisible={setOrderDetailsModalVisible}
                order={selectedOrder}
                showCustomerData={false}
            />
        </Layout>
    );
}