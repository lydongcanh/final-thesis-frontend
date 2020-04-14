import React, { useState } from "react";
import { FlatList } from "react-native";
import { Layout, Input, Button, Card, CardHeader } from "@ui-kitten/components";
import { styles } from "../../../../styles";

export default function AddProductScreen() {
    const [name, setName] = useState();
    const [unitPrice, setUnitPrice] = useState();
    const [mainImage, setMainImage] = useState();
    const [subImages, setSubImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function handleConfirmButton() {
        alert(JSON.stringify({
            name, unitPrice, mainImage, subImages
        }, null, 2))
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
                header={style => <CardHeader {...style} title="Ảnh (đang cập nhật)" />}
            >
                <FlatList
                    data={subImages}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Input
                            value={item}
                            disabled
                        />
                    )}
                />
            </Card>
        );
    }

    function getCategoryUI() {
        return (
            <Card
                style={{ margin: 8 }}
                disabled
                header={style => <CardHeader {...style} title="Loại sản phẩm (đang cập nhật)" />}
            >

            </Card>
        )
    }

    return (
        <Layout style={{ flex: 1, padding: 16, justifyContent: "space-between" }}>
            <Layout>
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
                {getSubImagesUI()}
                {getCategoryUI()}
            </Layout>
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