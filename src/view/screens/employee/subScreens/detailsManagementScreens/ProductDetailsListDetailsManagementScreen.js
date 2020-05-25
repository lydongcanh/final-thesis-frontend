import React, { useState } from "react";
import { Layout, Autocomplete, Input } from "@ui-kitten/components";
import { validateInt } from "../../../../../core/validations";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";
import { ProductDetailsService } from "../../../../../core/services";

export default function ProductDetailsListDetailsManagementScreen({ navigation, route }) {

    const product = route ? route.params.product : null;
    const productDetails = route ? route.params.productDetails : [];

    const [size, setSize] = useState();
    const [color, setColor] = useState();
    const [unitsInStock, setunitsInStock] = useState("0");

    async function createProductDetails() {
        const existDetails = getExistDetails();
        if (existDetails) {
            return await ProductDetailsService.update({
                id: existDetails.id,
                description: existDetails.description,
                size: existDetails.size,
                color: existDetails.color,
                productId: existDetails.productId,
                unitsInStock: parseInt(existDetails.unitsInStock) + parseInt(unitsInStock)
            })
        } else {
            return await ProductDetailsService.create({
                description: "",
                size: size,
                color: color,
                productId: product.id,
                unitsInStock: unitsInStock
            });
        }
    }

    async function updateProductDetails() {

    }

    function resetInputValues() {
        setSize();
        setColor();
        setunitsInStock("0");
    }

    function canAdd() {
        return size && size != "" &&
               color && color != "" &&
               unitsInStock && unitsInStock != "" && validateInt(unitsInStock) && parseInt(unitsInStock) > 0;
    }

    function getButtonText() {
        if (!canAdd())
            return "Xác nhận";

        if (getExistDetails())
            return "Thêm sản phẩm vào chi tiết cũ";

        return "Tạo chi tiết sản phẩm mới";
    }

    function getExistDetails() {
        if (!productDetails || productDetails.length < 1)
            return null;

        for(const pd of productDetails) {
            if (pd.size === size && pd.color === color)
                return pd;
        }

        return null;
    }

    function getData(name) {
        if (!productDetails || productDetails.length < 1)
            return [];

        const data = [];
        for(const pd of productDetails) {
            if (!data.some(d => d.title === pd[name])) {
                data.push({
                    id: pd.id,
                    title: pd[name]
                });
            }
        }
        return data;
    }

    function getContentUI() {
        return (
            <Layout>
                <Autocomplete 
                    label="Size"
                    data={getData("size")}
                    value={size}
                    onChangeText={setSize}
                    onSelect={({ title }) => setSize(title)}
                    maxLength={25}
                />
                <Autocomplete
                    label="Màu"
                    data={getData("color")}
                    value={color}
                    onChangeText={setColor}
                    onSelect={({ title }) => setColor(title)}
                    maxLength={25}
                />
                <Input 
                    label="Số lượng sản phẩm"
                    value={unitsInStock}
                    onChangeText={setunitsInStock}
                    maxLength={25}
                    keyboardType="numeric"
                />
            </Layout>
        )
    }

    return (
        <DetailsManagementTemplateScreen 
            navigation={navigation}
            route={route}
            createFunction={createProductDetails}
            updateFunction={updateProductDetails}
            resetInputFunction={resetInputValues}
            canAdd={canAdd}
            contentUI={getContentUI()}
            buttonText={getButtonText()}
        />
    )
}