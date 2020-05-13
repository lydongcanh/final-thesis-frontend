import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { Card, Text, Layout, Icon, Button } from "@ui-kitten/components";
import { formatCurrency } from "../../../core/utilities";
import { CustomerProductDetailsService } from "../../../core/services";

/**
 * @param props account, product, navigation, width, height
 */
export default function MinimalProduct({ account, product, width, height, navigation }) {

    const [isLiked, setIsLiked] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasOldState, setHasOldState] = useState(false);

    const imageWidth = width !== undefined ? width : 150;
    const imageHeight = height !== undefined ? height: 150;

    useEffect(() => {
        loadCustomerProductDetails();
    }, [account]);

    function loadCustomerProductDetails() {
        if (!account || !account.customer || !account.customer.customerProductDetails) {
            setIsLoaded(true);
            return;
        }

        try {
            for(const details of account.customer.customerProductDetails) {
                if (details.productId === product.id) {
                    setHasOldState(true);
                    setIsLiked(details.liked);
                    setIsLoaded(true);
                    return;              
                }
            }

            setHasOldState(false);
            setIsLiked(false);
            setIsLoaded(true);
        } catch(e) {
            console.log(e);
            setIsLoaded(false);
        }
    }

    function handleLikeButton() {
        if (!account || !account.customer) {
            navigation.navigate("Login", { shouldGoBack: true });
            return;
        }
        // TODO: Update info in saved account data.
        CustomerProductDetailsService.toggleCustomerLikedProduct(account.customer.id, product.id, hasOldState, !isLiked);
        setHasOldState(true);
        setIsLiked(!isLiked);
    }

    function handleProductClick() {
        navigation.navigate("CustomerProductPurchase", { product: product })
    }

    function getCardHeader() {
        return (
            <Layout>
                <Image 
                    style={{ width: imageWidth, height: imageHeight, maxWidth: imageWidth }} 
                    source={{ uri: product.mainImage }} 
                />
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

    if (product) {
        return (
            <Card
                style={{ flex: 1, margin: 8, maxWidth: imageWidth }}
                header={getCardHeader}
                onPress={handleProductClick}
            >
                <Text numberOfLines={1} style={{ width: 100 }}>{product.name}</Text>
                <Text category="label" appearance="hint" >{formatCurrency(product.unitPrice)}VND</Text>
            </Card>
        );
    } else {
        return (
            <Card style={{ flex: 1, margin: 8, maxWidth: imageWidth }}>
                <Text 
                    appearance="hint" 
                    style={{ flex: 1, textAlignVertical: "center", textAlign: "center"}}
                >
                    Lỗi load sản phẩm
                </Text>
            </Card>
        );
    }
}