import React from "react";
import { Layout, Select, Button, Icon, Text } from "@ui-kitten/components";
import { ImageBackground, Dimensions, View } from "react-native";
import { Space } from "../../../components/others";

export default function ProductPurchaseScreen({ navigation, route }) {

    const colorData = [{ text: "Màu 1", text: "Màu 2", text: "Màu 3" }];
    const sizeData = [{ text: "Size 1", text: "Size 2", text: "Size 3" }]

    const { product } = route.params;
    const screenHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get("window").width;

    navigation.setOptions({ title: product.name });

    return (
        <ImageBackground
            source={{ uri: product.mainImage }}
            style={{ height: screenHeight, width: screenWidth, flex: 1, justifyContent: "flex-end" }}
        >
            <Layout style={{ padding: 32, backgroundColor: "rgba(215, 215, 215, 0.95)", borderRadius: 24 }}>
                <Text category="h5" style={{ textAlign: "center", fontWeight: "bold" }}>{product.name}</Text>
                <Text category="h6" style={{ textAlign: "center", fontWeight: "bold" }}>${product.unitPrice}</Text>
                <Space />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Select 
                        data={colorData}
                        placeholder="Chọn màu"
                        controlStyle={{ borderRadius: 24 }} 
                        style={{ width: "45%" }} 
                    />
                    <Select 
                        data={sizeData}
                        placeholder="Chọn size"
                        controlStyle={{ borderRadius: 24 }} 
                        style={{ width: "45%" }}
                    />
                </View>
                <Space />
                <Button 
                    icon={style => <Icon {...style} name="shopping-cart" />}
                    style={{ borderRadius: 24 }}
                >
                    Thêm vào giỏ hàng
                </Button>
            </Layout>
        </ImageBackground>
    );
}