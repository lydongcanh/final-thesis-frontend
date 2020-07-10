import React, { useState } from "react";
import { Layout, Text, Button, Input } from "@ui-kitten/components";
import { Switch, Divider } from "react-native-paper";
import NumericInput from "react-native-numeric-input";
import { formatCurrency } from "../../../../../core/utilities";
import { ProductService, EmailService } from "../../../../../core/services";
import { Toast } from "native-base";

export default function DiscountDetailsScreen({ navigation, route }) {

    const { product } = route.params;
    const [isDiscount, setIsDiscount] = useState(product.isDiscount);
    const [discountAmount, setDiscountAmount] = useState(product.discountAmount);
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleConfirmButton() {
        try {
            setIsUpdating(true);
            product.isDiscount = isDiscount;
            product.discountAmount = discountAmount;
            await ProductService.update(product); 

            if (isDiscount)
                EmailService.sendNewDiscountEmail(product); 

            Toast.show({
                text: "Cập nhật thành công.",
                type: "success",
                duration: 3000
            }); 
            navigation.goBack();    
            setIsUpdating(false);
        }
        catch(e) {
            console.log(e);
            Toast.show({
                text: "Cập nhật thất bại",
                type: "danger",
                duration: 3000
            });
        }
    }

    function calculatePercent() {
        return discountAmount / product.unitPrice * 100;
    }

    function getConfigPanel() {
        if (!isDiscount)
            return;

        return (
            <Layout>
                <Text style={{ marginBottom: 4 }} appearance="hint" category="label">Giảm ({calculatePercent().toFixed(2)}%)</Text>
                <NumericInput 
                    value={discountAmount}
                    onChange={setDiscountAmount}
                    valueType="integer"
                    step={1000}
                    minValue={0}
                    maxValue={product.unitPrice}
                    rounded
                    totalWidth={220}
                    totalHeight={30}
                />
                <Divider style={{ marginVertical: 8 }} />
                <Layout style={{ flexDirection: "row" }}>
                    <Text>Giá sau khuyến mãi: </Text>
                    <Text style={{ fontWeight: "bold" }}>{formatCurrency(product.unitPrice - discountAmount)}VNĐ</Text>
                </Layout>
            </Layout>
        );
    }

    return (
        <Layout style={{ flex: 1, padding: 16, justifyContent: "space-between" }}>
            <Layout>
                <Text>{product.name}</Text>
                <Layout style={{ flexDirection: "row" }}>
                    <Text>Giá gốc: </Text>
                    <Text style={{ fontWeight: "bold" }}>{formatCurrency(product.unitPrice)}VNĐ</Text>
                </Layout>                
                <Divider style={{ marginVertical: 8 }}/>
                <Layout style={{ marginTop: 8 }}>
                    <Text appearance="hint" category="label">Khuyến mãi</Text>
                    <Switch
                        style={{ marginLeft: 0, alignSelf: "flex-start" }}
                        value={isDiscount}
                        onValueChange={setIsDiscount}
                    />
                </Layout>
                {getConfigPanel()}
            </Layout>
            <Button
                style={{ borderRadius: 25 }}
                disabled={isUpdating || (isDiscount && discountAmount <= 0)}
                onPress={handleConfirmButton}
            >
                Xác nhận
            </Button>
        </Layout>
    );
}