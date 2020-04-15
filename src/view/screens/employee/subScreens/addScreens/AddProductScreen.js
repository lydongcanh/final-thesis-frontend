import React, { useState, useEffect } from "react";
import { FlatList, ScrollView } from "react-native";
import { Layout, Input, Button, Card, CardHeader } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { Toast } from "native-base";
import { styles } from "../../../../styles";
import { LeafCategorySelector } from "../../../../components/categories";
import { Texts } from "../../../../../core/texts";
import { ProductService } from "../../../../../core/services";

export default function AddProductScreen() {

    const [name, setName] = useState();
    const [unitPrice, setUnitPrice] = useState();
    const [mainImage, setMainImage] = useState();
    const [subImages, setSubImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState();

    async function handleConfirmButton() {
        try {
            setIsLoading(true);
            const result = await ProductService.create({
                name: name, 
                unitPrice: unitPrice, 
                mainImage: mainImage, 
                subImages: subImages,
                categoryId: category.id
            });
            if (result.error) {
                console.log(result.error);
                Toast.show({
                    text: Texts.CREATE_PRODUCT_ERROR,
                    type: "danger"
                });
            } else {
                Toast.show({
                    text: Texts.CREATE_PRODUCT_SUCCESS,
                    type: "success"
                });
                resetInputValues();
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                text: Texts.CREATE_PRODUCT_ERROR,
                type: "danger"
            });
        } finally {
            setIsLoading(false);
        }
    }

    function resetInputValues() {
        setName("");
        setUnitPrice("");
        setMainImage("");
        setSubImages([]);
        setCategory(null);
    }

    function canAdd() {
        return name && name !== "" &&
            unitPrice && unitPrice !== "" &&
            mainImage && mainImage !== "" &&
            subImages && subImages !== "" &&
            !isLoading;
    }

    function getSubImagesUI() {
        return (
            <Card
                style={{ margin: 8 }}
                disabled
                header={style => <CardHeader {...style} title="Ảnh phụ (đang cập nhật)" />}
            >
                {/* <FlatList
                    data={subImages}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Input
                            value={item}
                            disabled
                        />
                    )}
                /> */}
            </Card>
        );
    }

    function getCategoryUI() {
        return (
            <Card
                style={{ margin: 8 }}
                disabled
                header={style => <CardHeader {...style} title="Loại sản phẩm" />}
            >
                <LeafCategorySelector
                    selectedCategory={category}
                    setSelectedCategory={setCategory}
                />
            </Card>
        )
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center" }} />

        return (
            <Layout style={{ flex: 1, padding: 16, justifyContent: "space-between" }}>
                <ScrollView>
                    <Input
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        label="Tên sản phẩm"
                    />
                    <Input
                        value={unitPrice}
                        onChangeText={setUnitPrice}
                        style={styles.input}
                        label="Giá tiền"
                        keyboardType="numeric"
                    />
                    <Input
                        value={mainImage}
                        onChangeText={setMainImage}
                        style={styles.input}
                        label="Ảnh chính"
                    />
                    {getCategoryUI()}
                    {getSubImagesUI()}
                </ScrollView>

                <Button
                    style={{ borderRadius: 25 }}
                    disabled={!canAdd()}
                    onPress={handleConfirmButton}
                >
                    Xác nhận
            </Button>
            </Layout>
        );
    }

    return getContentUI();
}