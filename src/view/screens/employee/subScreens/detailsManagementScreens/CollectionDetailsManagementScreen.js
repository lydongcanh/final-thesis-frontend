import React, { useState } from "react";
import { Layout, Input, Button, Card, CardHeader } from "@ui-kitten/components";
import { styles } from "../../../../styles";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";

export default function CollectionDetailsManagementScreen({ route }) {

    const [name, setName] = useState();
    const [products, setProducts] = useState([]);

    async function createCollection() {
        alert(JSON.stringify({
            name, unitPrice, mainImage, subImages
        }, null, 2));
        return { error: "Dang cap nhat" }
    }

    async function updateCollection() {
        return { error: "Dang cap nhat" }
    }

    function resetInputValues() {
        setName("");
        setProducts([]);
    }

    function canAdd() {
        return name && name !== "" &&
               products && products.length > 0;
    }

    function getProductsUI() {
        return (
            <Card
                style={{ margin: 8 }}
                disabled
                header={style => <CardHeader {...style} title="Sản phẩm (đang cập nhật)" />}
            >

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