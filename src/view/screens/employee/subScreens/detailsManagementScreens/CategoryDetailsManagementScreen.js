import React, { useState } from "react";
import { Layout, Input, Text, Button } from "@ui-kitten/components";
import { CategoryService } from "../../../../../core/services";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";
import { styles } from "../../../../styles";
import { ManagementTypes } from "../../../../types";

export default function CategoryDetailsManagementScreen({ navigation, route }) {

    const { mode, node, level, categories } = route.params;

    const [name, setName] = useState((node && mode == ManagementTypes.UPDATE) ? node.name : "");
    const [description, setDescription] = useState((node && mode == ManagementTypes.UPDATE) ? node.description : "");
    const [imagePath, setImagePath] = useState("");
    const [nameMessage, setNameMessage] = useState("");

    async function createCategory() {
        for(const category of getSameLevelCategories()) {
            if (category.name == name) {
                setNameMessage("Tên sản phẩm đã tồn tại.");
                return { error: true }
            }
        }

        const newCategory = {
            name: name,
            description: description
        };

        if (node) {
            newCategory.parentCategoryId = node.id;
            newCategory.imagePath = imagePath;
        }

        const result = await CategoryService.create(newCategory);
        return result;
    }

    async function updateCategory() {
        for(const category of getSameLevelCategories()) {
            if (category.name == name && category.name != node.name) {
                setNameMessage("Tên sản phẩm đã tồn tại.");
                return { error: true }
            }
        }

        node.name = name;
        node.description = description;
        const result = await CategoryService.update(node);
        return result;
    }

    function getSameLevelCategories() {
        if (mode == ManagementTypes.CREATE)
            return node ? node.childrenCategories : categories;

        // Update mode.
        if (level == 0)
            return categories;
        
        if (level == 1) {
            for(const category of categories)
                if (category.id == node.parentCategoryId)
                    return category.childrenCategories
        }

        for(const category of categories)
            for(const childCategory of category.childrenCategories)
                if (childCategory.id == node.parentCategoryId)
                    return childCategory.childrenCategories
    }

    function resetInputValues() {
        setName("");
        setDescription("");
        setImagePath("");
        setNameMessage("");
    }

    function canAdd() {
        return name && name !== "" &&
               description && description !== "";// &&
               //(hideImagePath() || (imagePath && imagePath !== ""));
    }

    function hideImagePath() {
        return !node || !level || level < 2;
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
                    caption={nameMessage}
                    status={(nameMessage && nameMessage != "") ? "danger" : "basic"}
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