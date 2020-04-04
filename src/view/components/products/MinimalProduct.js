import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { Card, Text, Layout, Icon, Button } from "@ui-kitten/components";
import { formatCurrency } from "../../../core/utilities";
import { CustomerProductDetailsService } from "../../../core/services";

/**
 * @param props customer, product, navigation
 */
export default function MinimalProduct({ customer, product, navigation }) {

    const [isLiked, setIsLiked] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasOldState, setHasOldState] = useState(false);

    useEffect(() => {
        loadCustomerProductDetails();
    }, [customer]);

    async function loadCustomerProductDetails() {
        if (!customer) {
            setIsLoaded(true);
            return;
        }

        try {
            const result = await CustomerProductDetailsService.getByProductAndCustomerId(customer.id, product.id);
            if (result.data && result.data.id) {
                setHasOldState(true);
                setIsLoaded(result.data.liked);
            }
            setIsLoaded(true);
        } catch(e) {
            console.log(e);
            setIsLoaded(false);
        }
    }

    function handleLikeButton() {
        if (!customer) {
            navigation.navigate("Login", { shouldGoBack: true });
            return;
        }

        CustomerProductDetailsService.toggleCustomerLikedProduct(customer.id, product.id, hasOldState, !isLiked);
        setHasOldState(true);
        setIsLiked(!isLiked);
    }

    function handleProductClick() {
        navigation.navigate("CustomerProductPurchase", { product: product })
    }

    function getCardHeader() {
        return (
            <Layout>
                <Image style={{ width: 150, height: 150 }} source={{ uri: product.mainImage }} />
                <Button 
                    size="tiny"
                    disabled={!isLoaded}
                    status={isLiked ? "danger" :"control"}
                    icon={(style) => <Icon {...style} name="heart-outline" />} 
                    style={{ position: "absolute", top: 8, right: 8, height: 24, width: 24, borderRadius: 12 }}
                    onPress={handleLikeButton}
                />
            </Layout>
        );
    }

    return (
        <Card
            style={{ flex: 1, margin: 8 }}
            header={getCardHeader}
            onPress={handleProductClick}
        >
            <Text numberOfLines={1} style={{ width: 100 }}>{product.name}</Text>
            <Text category="label" appearance="hint" >{formatCurrency(product.unitPrice)}VND</Text>
        </Card>
    );
}