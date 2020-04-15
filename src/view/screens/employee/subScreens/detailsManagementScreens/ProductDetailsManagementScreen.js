import React, { useState } from "react";
import { FlatList } from "react-native";
import { Layout, Input, Button, Card, CardHeader } from "@ui-kitten/components";
import { styles } from "../../../../styles";
import { LeafCategorySelector } from "../../../../components/categories";
import { ProductService } from "../../../../../core/services";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";

export default function ProductDetailsManagementScreen({ route }) {

    const [name, setName] = useState();
    const [unitPrice, setUnitPrice] = useState();
    const [mainImage, setMainImage] = useState();
    const [subImages, setSubImages] = useState([]);
    const [category, setCategory] = useState();

    async function createProduct() {
        const result = await ProductService.create({
            name: name, 
            unitPrice: unitPrice, 
            mainImage: mainImage, 
            subImages: subImages,
            categoryId: category.id
        });
        return result;
    }

    async function updateProduct() {
        return { error: "Đang cập nhật." }
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
               category;
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
        return (
            <Layout>
                <Input
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    label="Tên sản phẩm"
                    maxLength={100}
                />
                <Input
                    value={unitPrice}
                    onChangeText={setUnitPrice}
                    style={styles.input}
                    label="Giá tiền"
                    maxLength={20}
                    keyboardType="numeric"
                />
                <Input
                    value={mainImage}
                    onChangeText={setMainImage}
                    style={styles.input}
                    label="Ảnh chính"
                    maxLength={200}
                />
                {getCategoryUI()}
                {getSubImagesUI()}
            </Layout>
        );
    }

    return (
        <DetailsManagementTemplateScreen 
            route={route}
            createFunction={createProduct}
            updateFunction={updateProduct}
            resetInputFunction={resetInputValues}
            canAdd={canAdd}
            contentUI={getContentUI()}
        />
    );
}