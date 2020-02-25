import React, { useEffect, useState } from "react";
import TreeView from "react-native-final-tree-view";
import { Button, ButtonGroup, Layout, Icon, Text } from "@ui-kitten/components";
import { ActivityIndicator, Portal, Dialog } from "react-native-paper";
import { CategoryService } from "../../../core/services";
import { CategoryForm } from ".";

export default function CategoryManageView() {

    const [categories, setCategories] = useState(null);
    const [showingDialog, setshowingDialog] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [dialogMode, setDialogMode] = useState(null);
    
    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        const result = await CategoryService.getAllRoot();
        if (result.data) {
            for (const category of result.data) {
                setChildren(category);
            }
            setCategories(result.data);
        } else {
            // TODO: display error, load again button
            alert("Failed to load categories!!");
        }
    }

    function setChildren(category) {
        if (category && category.childrenCategories) {
            category.children = category.childrenCategories;
            for (const child of category.children) {
                setChildren(child);
            }
        }
    }

    /**
     * @param {*} mode "create", "delete", "edit"
     */
    function showDialog(node, mode) {
        setshowingDialog(true);
        setSelectedNode(node);
        setDialogMode(mode);
    }

    function getIndicator(isExpanded, hasChildrenNodes) {
        if (!hasChildrenNodes)
            return;

        if (isExpanded)
            return <Icon name="chevron-down-outline" width={20} height={20} />;

        return <Icon name="chevron-right-outline" width={20} height={20} />;
    }

    function getAddButton() {
        return (
            <Button
                icon={style => <Icon name="plus-outline" {...style} />}
                onPress={() => showDialog(null, "create")}
                size="tiny"
                status="control"
                style={{
                    position: "absolute",
                    right: 8,
                    top: 4,
                }}
            />
        )
    }

    function getButtonGroup(node) {
        const canDelete = (node && node.children) ? true : false;
        
        return (
            <ButtonGroup
                status="control"
                size="tiny"
                style={{ position: "absolute", right: 8 }}
            >
                <Button
                    disabled={canDelete}
                    icon={style => <Icon name="trash-2-outline" {...style} />}
                    onPress={() => showDialog(node, "delete")}
                />
                <Button
                    icon={style => <Icon name="edit-2-outline" {...style} />}
                    onPress={() => showDialog(node, "edit")}
                />
                <Button
                    icon={style => <Icon name="plus-outline" {...style} />}
                    onPress={() => showDialog(node, "create")}
                />
            </ButtonGroup>
        )
    }

    function getHeader() {
        return (
            <Text category="label" style={{ padding: 8 }}>
                Categories
                {getAddButton()}
            </Text>
        );
    }

    function getTreeView() {
        if (!categories)
            return <ActivityIndicator style={{ padding: 8, margin: 8, top: 2 }} />

        return (
            <TreeView
                data={categories}
                getCollapsedNodeHeight={() => 32}
                renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                    return (
                        <Layout style={{ 
                            marginLeft: 16 * level + (hasChildrenNodes ? 0 : 16), 
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            height: 32,
                        }}>
                            {getIndicator(isExpanded, hasChildrenNodes)}
                            <Text>{node.name}</Text>
                            {getButtonGroup(node)}
                        </Layout>
                    );
                }}
            />
        );
    }

    function getDialog() {
        return (
            <Portal>
                <Dialog
                    visible={showingDialog}
                >
                    <CategoryForm
                        mode={dialogMode}
                        category={selectedNode}
                        onCancel={() => setshowingDialog(false)}
                        onOk={async () => {
                            setshowingDialog(false);
                            await loadCategories();
                        }}
                    />
                </Dialog>
            </Portal>
        )
    }

    return (
        <Layout>
            {/* {getHeader()}
            <Divider /> */}
            {getTreeView()}
            {getDialog()}
        </Layout>
    );
}