import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { Layout, Input, Icon, Card, Tab, TabView, Button } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { ProductService } from "../../../../core/services";
import { ProductVerticalListItem } from "../../../components/products";

export default function DiscountScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [tabViewIndex, setTabViewIndex] = useState();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setIsLoading(true);
      const result =
        !searchValue || searchValue == ""
          ? await ProductService.getAll()
          : await ProductService.query({ containsName: searchValue });
      setProducts(result.data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOnSearch(text) {
    setSearchValue(text);
    await loadProducts();
  }

  function handleOnDetailClick(product) {
    navigation.navigate("EmployeeDiscountDetails", { product: product })
  }

  function getProductBottomPanel(product) {
    return (
      <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Button
          appearance="ghost"
          size="tiny"
          icon={(style) => <Icon {...style} name="edit-2-outline" />}
          onPress={() => handleOnDetailClick(product)}
        >
          Chi tiết
        </Button>
      </Layout>
    );
  }

  function getSearchPanel() {
    return (
      <Layout>
        <Input
          icon={(style) => <Icon {...style} name="search-outline" />}
          placeholder="Nhập tên sản phẩm"
          value={searchValue}
          onChangeText={setSearchValue}
          onIconPress={async () => await handleOnSearch(searchValue)}
          style={{ borderRadius: 50, margin: 8, backgroundColor: "white" }}
        />
      </Layout>
    );
  }

  function getContentUI() {
    if (isLoading)
      return (
        <ActivityIndicator
          style={{ flex: 1, margin: 8, alignContent: "center" }}
        />
      );

    return (
      <TabView
        style={{ flex: 1 }}
        indicatorStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        selectedIndex={tabViewIndex}
        onSelect={setTabViewIndex}
      >
        <Tab title="Đang khuyến mãi">
          <FlatList
            data={products.filter((p) => p.isDiscount)}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Card
                disabled
                style={{ margin: 16 }}
                header={() => (
                  <ProductVerticalListItem
                    product={item}
                    showCategory={false}
                  />
                )}
              >
                {getProductBottomPanel(item)}
              </Card>
            )}
          />
        </Tab>
        <Tab title="Không khuyến mãi">
          <FlatList
            data={products.filter((p) => !p.isDiscount)}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Card
                disabled
                style={{ margin: 16 }}
                header={() => (
                  <ProductVerticalListItem
                    product={item}
                    showCategory={false}
                  />
                )}
              >
                {getProductBottomPanel(item)}
              </Card>
            )}
          />
        </Tab>
      </TabView>
    );
  }

  return (
    <Layout style={{ flex: 1, padding: 8 }}>
      {getSearchPanel()}
      {getContentUI()}
    </Layout>
  );
}
