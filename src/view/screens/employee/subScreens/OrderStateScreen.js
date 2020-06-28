import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { Layout, Button, Text } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import Timeline from "react-native-timeline-flatlist";
import { CustomerOrderStateDetailsService } from "../../../../core/services";
import { LoadErrorPanel } from "../../../components/others";
import { formatDateTime } from "../../../../core/utilities";

export default function OrderStateScreen({ route }) {

    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [orderState, setOrderState] = useState();

    useEffect(() => {
        loadOrderStates();
    }, [route]);

    async function loadOrderStates() {
        try { 
            setIsLoading(true);
            const result = await CustomerOrderStateDetailsService.getByEmployeeId(route.params.employee.id);
            if (result.error) {
                console.log(error);
                setIsLoaded(false);
            } else {
                setOrderState(result.data.sort((a, b) => {
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

    function getTimelineData() {
        if (!orderState)
            return [];

        const data = [];
        for(const detail of orderState) {
            data.push({
                key: detail.orderState,
                //time: formatDate(detail.creationDate),
                title: detail.orderState,
                description: "Id: " + detail.customerOrderId + "\nThời gian: " +  formatDateTime(detail.creationDate)
            });
        }
        return data;
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, margin: 8, alignContent: "center" }} />

        if (!isLoaded)
            return <LoadErrorPanel onReload={loadOrderStates} />

        const data = getTimelineData();
        if (!data || data.length < 1) {
            return (
                <Text category="p2" style={{ alignSelf: "center", marginTop: 24 }}>
                    Nhân viên hiện tại chưa xử lý hóa đơn nào.
                </Text>
            );
        }

        return (
            <Timeline 
                data={data}
                innerCircle={"dot"}
                separator={true}
                showTime={false}
            />
        );
    }

    return (
        <Layout style={{ flex: 1, padding: 8 }}>
            {getContentUI()}
        </Layout>
    );
}