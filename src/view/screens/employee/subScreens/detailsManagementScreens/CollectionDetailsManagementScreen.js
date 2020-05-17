import React, { useState } from "react";
import { Layout, Input, Button, Text, Card, CardHeader, Icon } from "@ui-kitten/components";
import { Switch, Divider } from "react-native-paper";
import { styles } from "../../../../styles";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";
import { formatDate } from "../../../../../core/utilities";
import { ProductVerticalListItem } from "../../../../components/products";

export default function CollectionDetailsManagementScreen({ route }) {

    const collection = route ? route.params.collection : null;
    const [name, setName] = useState(collection ? collection.name : null);
    const [showOnMainPage, setShowOnMainPage] = useState(collection ? collection.showOnMainPage : false);
    const [details, setDetails] = useState(collection ? collection.details : []);

    async function createCollection() {
        alert(JSON.stringify({
            name, showOnMainPage, details
        }, null, 2));
        return { error: "Dang cap nhat" };
    }

    async function updateCollection() {
        alert(JSON.stringify({
            name, showOnMainPage, details
        }, null, 2));
        return { error: "Dang cap nhat" };
    }

    function resetInputValues() {
        setName("");
        setProducts([]);
    }

    function canAdd() {
        return name && name !== "";
    }

    function getHeader() {
        return (
            <Layout style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
                <Text category="c6">Sản phẩm</Text>
                <Button 
                    size="tiny"
                    appearance="ghost"
                    icon={(style) => <Icon {...style} name="plus-outline" />}
                    onPress={() => alert("")}
                />
            </Layout>
        );
    }

    // TODO: Add, remove products...
    function getProductsUI() {
        if (!collection)
            return;

        return (
            <Card
                style={{ margin: 8 }}
                disabled
                header={getHeader}
            >
                {details.map(d => (
                    <Layout key={d.id}>
                        <ProductVerticalListItem
                            showCategory={false} 
                            key={d.product.id} 
                            product={d.product}
                        />
                        <Divider style={{ margin: 8 }} />
                    </Layout>
                ))}
            </Card>
        )
    }

    function getContentUI() {
        const date = collection ? new Date(Date.parse(collection.creationDate)) : new Date();
        return (
            <Layout>
                <Layout style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center", padding: 8 }}>
                    <Layout style={{ marginTop: 8 }}>
                        <Text appearance="hint" category="label">Hiện trên trang chủ:</Text>
                        <Switch
                            style={{ marginLeft: 0, alignSelf: "flex-start" }}
                            value={showOnMainPage}
                            onValueChange={setShowOnMainPage}
                        />
                    </Layout>
                    <Layout>
                        <Text appearance="hint" category="label" >Ngày tạo bộ sưu tập:</Text>
                        <Text>{formatDate(date)}</Text>
                    </Layout>
                </Layout>
                <Input
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    label="Tên bộ sưu tập"
                    maxLength={100}
                />
                {getProductsUI()}
            </Layout>
        );
    }

    return (
        <DetailsManagementTemplateScreen
            route={route}
            createFunction={createCollection}
            updateFunction={updateCollection}
            resetInputFunction={resetInputValues}
            canAdd={canAdd}
            contentUI={getContentUI()}
        />
    );
}