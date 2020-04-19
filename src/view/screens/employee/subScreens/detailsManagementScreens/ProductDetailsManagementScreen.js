import React, { useState } from "react";
import { FlatList } from "react-native";
import { Layout, Input, Text, Card, CardHeader, Button } from "@ui-kitten/components";
import { Switch } from "react-native-paper";
import { styles } from "../../../../styles";
import { LeafCategorySelector } from "../../../../components/categories";
import { ProductService } from "../../../../../core/services";
import { formatDate } from "../../../../../core/utilities";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";

export default function ProductDetailsManagementScreen({ navigation, route }) {

    const product = route ? route.params.product : null;
    const fixedCategory = route ? route.params.category : null;

    const [name, setName] = useState(product ? product.name : "");
    const [unitPrice, setUnitPrice] = useState(product ? product.unitPrice.toString() : null);
    const [mainImage, setMainImage] = useState(product ? product.mainImage : "");
    const [subImages, setSubImages] = useState(product && product.subImages ? product.subImages : []);
    const [category, setCategory] = useState(getDefaultCategory());
    const [isSelling, setIsSelling] = useState(product ? product.isSelling : true);
    
    function getDefaultCategory() {
        if (product)
            return product.category;

        if (fixedCategory)
            return fixedCategory;

        return null;
    }

    async function createProduct() {
        const result = await ProductService.create({
            name: name,
            isSelling: isSelling,
            unitPrice: unitPrice, 
            mainImage: mainImage, 
            subImages: subImages,
            categoryId: category.id
        });
        return result;
    }

    async function updateProduct() {
        const result = await ProductService.update({
            id: product.id,
            name: name,
            isSelling: isSelling,
            unitPrice: unitPrice,
            mainImage: mainImage,
            subImages: subImages,
            categoryId: category.id
        });
        return result;
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
        const date = product ? new Date(Date.parse(product.creationDate)) : new Date();
        return (
            <Layout>
                <Layout style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center", padding: 8 }}>
                    <Layout style={{ marginTop: 8 }}>
                        <Text appearance="hint" category="label">Trạng thái kinh doanh:</Text>
                        <Switch
                            style={{ marginLeft: 0, alignSelf: "flex-start" }} 
                            value={isSelling} 
                            onValueChange={setIsSelling} 
                        />
                    </Layout>
                    <Layout>
                        <Text appearance="hint" category="label" >Ngày tạo sản phẩm:</Text>
                        <Text>{formatDate(date)}</Text>
                    </Layout>
                </Layout>
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
            navigation={navigation}
            route={route}
            createFunction={createProduct}
            updateFunction={updateProduct}
            resetInputFunction={resetInputValues}
            canAdd={canAdd}
            contentUI={getContentUI()}
        />
    );
}