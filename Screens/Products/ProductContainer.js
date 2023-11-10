import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import { Container, Header, Item, Input, Text } from "native-base";
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios';

import ProductList from "./ProductList";
import SearchedProduct from './SearchedProduct'
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
import baseURL from "../../assets/baseUrl";
import Icon from "react-native-vector-icons/MaterialIcons";
import MenuModal from "../../Shared/MenuModel";
import Button from "../../src/components/Button";
var { height } = Dimensions.get('window');
const productsPerPage = 10;
const ProductContainer = (props) => {
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // useEffect(() => {
  //   axios
  //     .get(`${baseURL}products`, {
  //       params: {
  //         _page: currentPage,
  //         _limit: productsPerPage,
  //       }
  //     })
  //     .then((res) => {
  //       setProducts(prevProducts => [...prevProducts, ...res.data.products]);
  //       setTotalPages(res.data.totalPages);
  //       setProductsFiltered(prevProducts => [...prevProducts, ...res.data.products]);
  //       setProductsCtg(prevProducts => [...prevProducts, ...res.data.products]);
  //       setInitialState(prevProducts => [...prevProducts, ...res.data.products]);
  //       if (res.data.products.length < productsPerPage) {
  //         setHasMore(false);
  //       }
  //       setLoading(false)
  //     })
  //     .catch((error) => {
  //       console.log('Api call error', error)
  //     })
  //     return () => {
  //       setProducts([]);
  //       setProductsFiltered([]);
  //       setFocus();
  //       setActive();
  //       setInitialState([]);
  //     };
  // }, [currentPage])

  useFocusEffect((
    useCallback(
      () => {
        setFocus(false);
        setActive(-1);

        //Products
        axios
          .get(`${baseURL}products`, {
            params: {
              _page: currentPage,
              _limit: productsPerPage,
            }
          })
          .then((res) => {
            setProducts(prevProducts => [...prevProducts, ...res.data.products]);
            setTotalPages(res.data.totalPages);
            setProductsFiltered(prevProducts => [...prevProducts, ...res.data.products]);
            setProductsCtg(prevProducts => [...prevProducts, ...res.data.products]);
            setInitialState(prevProducts => [...prevProducts, ...res.data.products]);
            if (res.data.products.length < productsPerPage) {
              setHasMore(false);
            }
            setLoading(false)
          })
          .catch((error) => {
            console.log('Api call error', error)
          })

        // Categories
        axios
          .get(`${baseURL}categories`)
          .then((res) => {
            setCategories(res.data)
          })
          .catch((error) => {
            console.log('Api call error')
          })
        return () => {
          setProducts([]);
          setProductsFiltered([]);
          setFocus();
          setCategories([]);
          setActive();
          setInitialState([]);
        };
      },[]
    )
  ))



  // Product Methods
  const searchProduct = (text) => {
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  // Categories
  const changeCtg = (ctg) => {
    {
      ctg === "all"
        ? [setProductsCtg(initialState), setActive(true)]
        : [
          setProductsCtg(
            products.filter((i) => i.category._id === ctg),
            setActive(true),
            console.log(products.filter((i) => i.category.id === ctg)),
            console.log('hi'),
            console.log(ctg === 'all'),
            console.log(products)
          ),
        ];
    }
  };
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };
  const handleLoadMore = () => {
    console.log("called")
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <>
      {loading == false ? (
        <Container >
          <Header backgroundColor="white" searchBar rounded >
            <Item style={{ backgroundColor: "gainsboro" }}>
            <Icon onPress={openList} size={30} name="search" /> 
              <Input
                onPress={onBlur}
                placeholder="Search for dishes"
                style={{ textAlign: "center" }}
                onFocus={openList}
                onChangeText={(text) => searchProduct(text)}
              />
             
              {focus == true ? <Icon onPress={onBlur} size={30} name="close" /> : null}
            </Item>
          </Header>
          {focus == true ? (
            <SearchedProduct
              navigation={props.navigation}
              productsFiltered={productsFiltered} />
          ) : (
            <ScrollView >
              <View>
                <View>
                  <Banner />
                </View>

                <View>
                  <CategoryFilter
                    categories={categories}
                    categoryFilter={changeCtg}
                    productsCtg={productsCtg}
                    active={active}
                    setActive={setActive}
                  />
                </View >
                <FlatList
                  data={productsCtg}
                  renderItem={({ item }) => (
                    <ProductList navigation={props.navigation} item={item} key={item.name} />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.5}
                  ListEmptyComponent={
                    <View style={[styles.center, { height: height / 2 }]}>
                      <Text>No products found</Text>
                    </View>
                  }
                />

              </View>
            </ScrollView>
          )}
          <TouchableOpacity onPress={toggleMenu} style={styles.floatingButton}>
            <Icon name="book" size={24} color="white" />
            <Text style={{ color: "grey", fontWeight: "bold", fontSize: 15 }}>Menu</Text>
          </TouchableOpacity>
          <MenuModal categories={categories}
            categoryFilter={changeCtg}
            productsCtg={productsCtg}
            active={active}
            setActive={setActive}
            isVisible={isMenuVisible}
            onClose={toggleMenu} />
        </Container>
      ) : (
        // Loading
        <Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
          <ActivityIndicator size="large" color="red" />
        </Container>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "white",

  },
  listContainer: {
    height: '100%',
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "white"
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 35,
    width: 75,
    height: 75,
    borderRadius: 35,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4, // Adds a shadow for iOS
  },
});

export default ProductContainer;