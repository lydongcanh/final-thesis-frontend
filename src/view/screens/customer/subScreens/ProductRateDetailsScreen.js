import React, { useEffect, useState } from "react";
import { FlatList, Image } from "react-native";
import { Layout, Text, Card } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { Rating } from "react-native-elements";
import { CustomerService } from "../../../../core/services";
import { Space } from "../../../components/others";

export default function ProductRateDetailsScreen({ route }) {

    const { details } = route.params;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        try {
            setIsLoading(true);
            for(const detail of details) {
                const p = await CustomerService.getById(detail.customerId);
                detail.customer = p.data;
            }
        } catch(e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ margin: 8, flex: 1, alignContent: "center" }} />

        return (
            <FlatList
                data={details}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) =>
                    <Card
                        disabled
                        style={{ margin: 16 }}                      
                    >
                        <Layout style={{ flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)", alignItems: "center" }}>
                            <Image 
                                source={{ uri: item.customer.imagePath }}
                                style={{ borderRadius: 50, width: 50, height: 50 }}
                            />
                            <Layout style={{ marginLeft: 8 }}>
                                <Text>{item.customer.name}</Text>
                                <Layout style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Rating 
                                        imageSize={20}
                                        readonly
                                        startingValue={item.rate}
                                    />                                                                                                       
                                </Layout>
                                <Text>Bình luận: {!item.comment ? "Trống" : item.comment}</Text>  
                            </Layout>       
                        </Layout>
                    </Card>
                }
            />
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            {getContentUI()}
        </Layout>
    )
}