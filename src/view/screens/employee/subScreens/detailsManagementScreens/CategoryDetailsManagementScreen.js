import React, { useState } from "react";
import { Layout, Input, Text } from "@ui-kitten/components";
import { CategoryService } from "../../../../../core/services";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";
import { styles } from "../../../../styles";

export default function CategoryDetailsManagementScreen({ navigation, route }) {

    const { parentNode, level } = route.params;

    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [imagePath, setImagePath] = useState();

    async function createCategory() {
        const newCategory = {
            name: name,
            description: description
        };

        if (parentNode) {
            newCategory.parentCategoryId = parentNode.id;
            newCategory.imagePath = imagePath;
        }

        const result = await CategoryService.create(newCategory);
        return result;
    }

    async function updateCategory() {
        return { error: "Dang cap nhat" };
    }

    function resetInputValues() {
        setName("");
        setDescription("");
        setImagePath("");
    }

    function canAdd() {
        return name && name !== "" &&
               description && description !== "" &&
               (hideImagePath() || (imagePath && imagePath !== ""));
    }

    function hideImagePath() {
        return !parentNode || !level || level < 2;
    }

    function getImageInputUI() {
        if (hideImagePath())
            return;

        return (
            <Input
                label="Ảnh"
                onChangeText={setImagePath}
                value={imagePath}
                maxLength={200}
                style={styles.input}
            />
        );
    }

    function getContentUI() {
        return (
            <Layout>
                <Input
                    label="Tên"
                    onChangeText={setName}
                    value={name}
                    maxLength={50}
                    style={styles.input}
                />
                <Input
                    label="Chú thích"
                    onChangeText={setDescription}
                    value={description}
                    maxLength={100}
                    style={styles.input}
                />
                {getImageInputUI()}
            </Layout>
        );
    }

    return (
        <DetailsManagementTemplateScreen 
            navigation={navigation}
            route={route}
            createFunction={createCategory}
            updateFunction={updateCategory}
            resetInputFunction={resetInputValues}
            canAdd={canAdd}
            contentUI={getContentUI()}
        />
    );
}