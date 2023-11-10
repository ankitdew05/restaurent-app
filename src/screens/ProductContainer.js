import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
  RefreshControl,
  ToastAndroid
} from "react-native";
import { Container, Header, Item, Input, Text } from "native-base";
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios';
import ProductList from "./ProductList";
import SearchedProduct from './SearchedProduct'
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
import baseURL from "../../assets/baseUrl";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { checkAuthToken } from "../../Context/actions/Auth.actions";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { BannerAdSize, BannerAd, AppOpenAd, TestIds, AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';


import Background from "../components/Background";
import DotBackground from "../components/DotBackground";
var { height } = Dimensions.get('window');

export default function ProductContainer(props) {
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true)
  const context = useContext(AuthGlobal);
  const [refreshing, setRefreshing] = React.useState(false);
  const [length, setlenght] = useState();
  useEffect(() => [
    checkAuthToken(context.dispatch)
  ], [])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData();
      console.log(products.length)
      ToastAndroid.show('Profiles Refreshed', ToastAndroid.SHORT);
      setRefreshing(false)

    }, 2000);
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();

      return () => {
        // Clean up any necessary resources
      };
    }, [fetchData])
  );

  const fetchData = useCallback(() => {
    setFocus(false);
    setActive(-1);

    try {
      axios
        .get(`${baseURL}products`)
        .then((res) => {
          console.log('Api call', res.data);
          setProducts(res.data);
          setlenght(res.data.length)
          console.log(res.data.length)
          setProductsFiltered(res.data);
          setProductsCtg(res.data);
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Api call error', error);
        });

      // Categories
      axios
        .get(`${baseURL}categories`)
        .then((res) => {
          setCategories(res.data);
        })
        .catch((error) => {
          console.log('Api call error');
        });
      setFocus(false);
      setActive(-1);
    } catch (error) {
      console.log('FError', error);
    }

    return () => {
      // setProducts([]);
      // setProductsFiltered([]);
      // setFocus();
      // setCategories([]);
      // setActive();
      // setInitialState();
    };
  }, []);




  // Product Methods
  const searchProduct = (text) => {

    setProductsFiltered(

      products.filter((i) => i.courses.toLowerCase().includes(text.toLowerCase()))
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

  return (
    <>

      {loading == false ? (
        <Container >
          <Header searchBar rounded>
            <Item>
              <Icon name="search" size={30} color="blue" />
              <Input
                placeholder="Search Courses "
                onFocus={openList}
                onChangeText={(text) => searchProduct(text)}
              />
              {focus == true ? <Icon onPress={onBlur} size={30} color="red" name="close" /> : null}
            </Item>
          </Header>
          {focus == true ? (
            <SearchedProduct
              navigation={props.navigation}
              productsFiltered={productsFiltered} />
          ) : (
            <ScrollView refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
              <View>
            
                <View>
                  <CategoryFilter
                    categories={categories}
                    categoryFilter={changeCtg}
                    productsCtg={productsCtg}
                    active={active}
                    setActive={setActive}
                  />
                </View>
                {productsCtg.length > 0 ? (
                  <View style={styles.listContainer}>
                    {productsCtg.map((item) => {
                      return (
                        <ProductList
                          navigation={props.navigation}
                          key={item.name}
                          item={item}
                          isAnkit="false"
                        />
                      )
                    })}
                  </View>
                ) : (
                  <View style={[styles.center, { height: height / 2 }]}>
                    <Text>No products found</Text>
                  </View>
                )}

              </View>
            </ScrollView>
          )}
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
  }
});

