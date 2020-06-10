import React, { useState } from "react";
import { Layout, Input, Button, Text, Card, CardHeader, Icon } from "@ui-kitten/components";
import { Switch, Divider } from "react-native-paper";
import { styles } from "../../../../styles";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";
import { formatDate } from "../../../../../core/utilities";
import { ProductVerticalListItem } from "../../../../components/products";
import { CollectionService, CollectionDetailsService } from "../../../../../core/services";

export default function CollectionDetailsManagementScreen({ route, navigation }) {

    const collection = route ? route.params.collection : null;
    const collections = route ? route.params.collections : null;
    const [name, setName] = useState(collection ? collection.name : null);
    const [showOnMainPage, setShowOnMainPage] = useState(collection ? collection.showOnMainPage : true);
    const [details, setDetails] = useState(collection ? collection.details : []);
    const [nameMessage, setNameMessage] = useState("");

    async function createCollection() {
        if (!validateInputs())
            return { error: true };

        alert(JSON.stringify({
            name, showOnMainPage, details
        }, null, 2));
        return { error: "Dang cap nhat" };
    }

    async function updateCollection() {
        if (!validateInputs())
            return { error: true };

        for(const detail of collection.details) {
            if (!details.includes(detail))
                CollectionDetailsService.delete(detail.id);
        }

        collection.name = name;
        collection.showOnMainPage = showOnMainPage;
        collection.details = details;
        const result = await CollectionService.update(collection);
        return result;
    }

    function validateInputs() {
        for(const c of collections) {
            if (c.name == name && (!collection || collection.name != c.name)) {
                setNameMessage("Tên bộ sưu tập đã tồn tại.");
                return false;
            }
        }
        return true;
    }

    function removeDetail(detail) {
        setDetails(details.filter(d => d.id !== detail.id));
    }

    function resetInputValues() {
        setName("");
        setProducts([]);
        setNameMessage("");
    }

    function canAdd() {
        return name && name !== "";
    }

    function getHeader() {
        return (
            <Layout style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
                <Text category="h6" style={{ marginLeft: 8 }}>Sản phẩm</Text>
                <Button 
                    size="tiny"
                    appearance="ghost"
                    icon={(style) => <Icon {...style} name="plus-outline" />}
                    onPress={() => alert("Đang cập nhật...")}
                />
            </Layout>
        );
    }

    function getProductsUI() {
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
                        <Button 
                            appearance="ghost"
                            status="danger"
                            size="tiny"
                            icon={(style) => <Icon {...style} name="trash-outline" />}
                            style={{ position: "absolute", right: 0, top: 16 }}
                            onPress={() => removeDetail(d)}
                        />
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
                    caption={nameMessage}
                    status={(nameMessage && nameMessage != "") ? "danger" : "basic"}
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
            navigation={navigation}
            route={route}
            createFunction={createCollection}
            updateFunction={updateCollection}
            resetInputFunction={resetInputValues}
            canAdd={canAdd}
            contentUI={getContentUI()}
        />
    );
}