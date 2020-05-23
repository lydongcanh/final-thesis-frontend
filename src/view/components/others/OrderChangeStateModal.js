import React, { useState } from "react";
import { Card, CardHeader, Modal, Text, Layout, Button, Input } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { CustomerOrderService, CustomerOrderStateDetailsService } from "../../../core/services";
import { Space } from ".";

/**
 * 
 * @param param0 order, employee, nextState, visible, setVisible 
 */
export default function OrderChangeStateModal({ order, employee, nextState = "", visible, setVisible }) {

    const [description, setDescription] = useState(order ? order.description : "");
    const [isLoading, setIsLoading] = useState(false);

    async function updateOrderState() {
        if (!order)
            return;

        try {
            setIsLoading(true);
            const newOrder = order;
            newOrder.orderState = nextState;
            const result = await CustomerOrderService.update(newOrder);
            if (result.error) {
                console.log(error);
            } else {
                const stateDetails = {
                    customerOrderId: order.id,
                    orderState: nextState,
                    description: description                
                };

                if (employee)
                    stateDetails.employeeId = employee.id;

                await CustomerOrderStateDetailsService.create(stateDetails);
                setDescription("");
                setVisible(false);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    function getFooterUI() {
        return (
            <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Button
                    size="tiny"
                    appearance="ghost"
                    onPress={updateOrderState}
                >
                    OK
                </Button>
                <Button
                    size="tiny"
                    appearance="ghost"
                    onPress={() => setVisible(false)}
                >
                    Hủy
                </Button>
            </Layout>
        );
    }

    function getDescriptionUI () {
        if (!order)
            return;

        return (
            <Input 
                value={description}
                onChangeText={setDescription}
                maxLength={200}
                label="Ghi chú"
            />
        );
    }

    function getContentUI() {
        if (!order)
            return;

        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />

        return (
            <Layout>
                <Text>Xác nhận chuyển hóa đơn sang trạng thái </Text>
                <Text style={{ fontWeight: "bold" }}>{nextState}?</Text>
                <Space />
                {getDescriptionUI()}
            </Layout>
        );
    }

    return (
        <Modal 
            visible={visible}
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onBackdropPress={() => setVisible(false)}
            style={{ padding: 8, alignSelf: "center", width: "100%" }}
        >
            <Card
                disabled 
                footer={getFooterUI}
                header={() => <CardHeader title="Hóa đơn" />}
            >
                {getContentUI()}
            </Card>
        </Modal>
    );
}