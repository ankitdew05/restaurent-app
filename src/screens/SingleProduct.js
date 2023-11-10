import {
  View,
  Text,
  ScrollView,
  Button,
  Image,
  StyleSheet,
  Linking, Touchable, TouchableOpacity, Alert, ImageBackground, Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Left, Right, Container, H1 } from "native-base";
import * as actions from "../../Redux/Actions/cartActions";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import { CardField, PlatformPay, PlatformPayButton, usePlatformPay, useStripe } from '@stripe/stripe-react-native';
import baseURL from "../../assets/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import axios from "axios";
import { BannerAdSize, BannerAd } from 'react-native-google-mobile-ads';
var { height, width } = Dimensions.get('window')
const SingleProduct = (props) => {
  const context = useContext(AuthGlobal);
  console.log("Single", props.route.params.item)
  const [item, setItem] = useState(props.route.params.item);
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailabilityText] = useState("");

  const adUnitId = "ca-app-pub-5658970061204469/6129707077";
  // const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  //   requestNonPersonalizedAdsOnly: true,
  //   keywords: ['fashion', 'clothing'],
  // });
  // const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  //   requestNonPersonalizedAdsOnly: true,
  //   keywords: ['finance', 'trading'],
  // });
  useEffect(() => {
    if (props.route.params.item.countInStock == 0) {
      setAvailability(<TrafficLight unavailable></TrafficLight>);
      setAvailabilityText("Unavailable");
    } else if (props.route.params.item.countInStock <= 5) {
      setAvailability(<TrafficLight limited></TrafficLight>);
      setAvailabilityText("Limited Stock");
    } else {
      setAvailability(<TrafficLight available></TrafficLight>);
      setAvailabilityText("Available");
    }
    // const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    //   rewarded.show();
    // });
    // const unsubscribeEarned = rewarded.addAdEventListener(
    //   RewardedAdEventType.EARNED_REWARD,
    //   reward => {
    //     console.log('User earned reward of ', reward);
    //   },
    // );

    // // Start loading the rewarded ad straight away
    // rewarded.load();

    // // Unsubscribe from events on unmount
    // const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    //   interstitial.show();
    // });
    // // Start loading the interstitial straight away
    // interstitial.load();
    // // Unsubscribe from events on unmount

    return () => {
      // unsubscribeLoaded();
      // unsubscribeEarned();
      //unsubscribe();
      setAvailability(null);
      setAvailabilityText("");
    };
  }, []);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay();
  const setup = async () => {
    if (!(await isPlatformPaySupported())) {
      Alert.alert(
        'Error',
        `${Plateform.OS === 'android' ? 'Google' : 'Apple'
        } Pay is not supported`,
      );
      return;
    }
  }
  async function buy() {
    const { error } = await confirmPlatformPayPayment(clientSecret, {
      googlePay: {
        cartItems: {
          label: 'Course',
          amount: '1',
          paymentType: PlatformPay.PaymentType.Immediate
        },
        merchantCountryCode: 'IN',
        currencyCode: 'INR'
      }
    })
  }
  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${baseURL}payment-sheet/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 2900 })
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };
  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
    } = await fetchPaymentSheetParams();


    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
      googlePay: {
        merchantCountryCode: 'IN',
        //testEnv: true, // use test environment
      },
    });
    if (!error) {
      setLoading(true);
    }
  };
  const openPaymentSheet = async () => {
    if (
      context.stateUser.isAuthenticated === false ||
      context.stateUser.isAuthenticated === null
    ) {
      props.navigation.navigate("LoginScreen")
    } else {
      const { error } = await presentPaymentSheet();
      if (error) {
        postTransaction(false)
        Alert.alert(`Error code: ${error.code} ->`, error.message);
        props.navigation.navigate("Chat", { item: item, status: true, message: `Hey you just missed ${item.name} as your trading partner, please try agin connecting with ${item.name} ` })
      } else {
        postTransaction(true)
        Alert.alert('Success', 'Your order is confirmed!,');
        props.navigation.navigate("Chat", { item: item, status: true, message: `"Huree" you just Found ${item.name} as your trading partner, His telegram ID is ${item.socialId} you can contact him and Enjoy ` })
      }
    }


  };

  const postTransaction = (status) => {


    const order = {
      user: context.stateUser.user.userId,
      userto: item.user._id,
      status: status,
      product: item.id,
      transactionId: "123"
    }

    axios.post(`${baseURL}transactions`, order).then((res) => {
      if (res.status == 200 || res.status == 201) {
        Alert.alert("Order Added")
        setTimeout(() => {
          if (
            context.stateUser.user.share === false
          ) {
            props.navigation.navigate('UserProfile');
          } else {
            props.navigation.navigate('Bookmark');
          }

        }, 500);
      }

    })
      .catch((error) => {
        Alert.alert("Error to Send Order", error)
      })
  }
  const makeOffer = () => {
    if (
      context.stateUser.isAuthenticated === false ||
      context.stateUser.isAuthenticated === null
    ) {
      props.navigation.navigate("LoginScreen")
    } else {
      console.log("order called")
      const order = {
        user: context.stateUser.user.userId,
        userto: item.user._id,
        product: item.id,
        totalPrice: 0
      }

      const data = {
        token: item.user.pushToken,
        title: `Hello, ${item.user.name}! You have a new friend request from userId ${context.stateUser.user.userId}.`,
        description: `Accept the request promptly and verify your profile to connect with this sathi (companion) without delay!`
      }

      axios.post(`${baseURL}test-send`, data).then((res) => {
        if (res.status == 200 || res.status == 201) {
          console.log('PushToken Sussesfull')
          //Alert.alert("Error to Send PushToken", error)
        }
      })
        .catch((error) => {
          Alert.alert("Error to Send PushToken", error)
        })

      axios.post(`${baseURL}orders`, order).then((res) => {
        if (res.status == 200 || res.status == 201) {
          Alert.alert("Request Sent Succesfully")
          setTimeout(() => {
            if (
              context.stateUser.user.share === false
            ) {
              props.navigation.navigate('UserProfile');
            } else {
              props.navigation.navigate('Request');
            }

          }, 500);
        }
      })
        .catch((error) => {
          Alert.alert("Error to Send Request", error)
        })
    }

  }
  useEffect(() => {
    initializePaymentSheet();
    setup();
  }, []);

  return (

    <Container style={styles.container}>
      <View style={styles.container}>
        <ImageBackground
          source={{
            uri: "https://wallpapers.com/images/hd/profile-picture-background-82fwxjbuatdle05w.jpg",
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {item.isVerified ? (
            <View style={styles.verifiedBadge}>

              <Image
                style={styles.verifiedIcon}
                resizeMode="contain"
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/7595/7595571.png" }} // Replace with your verified icon image source
              />
            </View>) : null}
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: item.image
              ? item.image
              : "https://klemobucket.s3.ap-northeast-1.amazonaws.com/Avatar+(2).png",
    
              }}
              style={styles.profileImage}
              resizeMode="cover"
            />



          </View>
          <ScrollView style={styles.scroll}>
            <View style={styles.cardContainer}>
              <Text style={styles.profileName}>{item.name}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
            <View style={styles.cardContainer}>
              <Text style={styles.cardTitle}>Courses</Text>
              <Text style={[styles.cardText, styles.courseTakenText]}>Course Taken: {item.courses}</Text>
              <Text style={styles.cardText}>Course Interest: {item.courseInterest}</Text>
            </View>
            <View style={styles.cardContainer1}>
              <View style={styles.cardSection}>
                <Text style={styles.sectionTitle}>Friends</Text>
                <Text style={styles.sectionText}>{item.price}</Text>
              </View>
              <View style={styles.cardSection}>
                <Text style={styles.sectionTitle}>Rating</Text>
                <Text style={styles.sectionText}>{item.rating}</Text>
              </View>
              <View style={styles.cardSection}>
                <Text style={styles.sectionTitle}>Review</Text>
                <Text style={styles.sectionText}>{item.numReviews}</Text>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>

      </View>
      <View style={styles.container1}>
        {item.isVerified ? (<View style={styles.buttonContainer}>
          <EasyButton primary onPress={openPaymentSheet}>

            <Text style={styles.connectButtonText}>Contact 29Rs</Text>
            <Icon style={styles.icon} name="shopping-cart" size={20}></Icon>
          </EasyButton>
        </View>) : (<View style={styles.buttonContainer}>
          <EasyButton primary onPress={() => Alert.alert("User not verified Send Him a Connection Offer")}>
            <Text style={styles.connectButtonText}>Contact 29Rs</Text>
            <Icon style={styles.icon} name="shopping-cart" size={20}></Icon>
          </EasyButton>
        </View>)}

        <View style={styles.buttonContainer}>
          <EasyButton primary onPress={makeOffer}>
            <Text style={styles.connectButtonText}>Show Interest</Text>
            <Icon style={styles.icon} name="person-add" size={20}></Icon>
          </EasyButton>
        </View>
      </View>
    </Container>

  );
};
{/* <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
            keywords: ['finance', 'trading', 'stocks',]
          }}
        /> */}
const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (product) =>
      dispatch(actions.addToCart({ quantity: 1, product })),
  };
};

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 60
  },
  cardContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 5,
  },
  cardSection: {
    alignItems: 'center',
    //marginBottom: 10,
  },
  sectionTitle: {
    alignItems: 'center',
    color: '#474747',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 60,
    left: 105,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
    borderRadius: 25,
    zIndex: 2
  },
  verifiedIcon: {
    width: 35,
    height: 35,
    elevation: 1
  },
  icon: {
    marginTop: 3
  },
  container2: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  container1: {

    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    backgroundColor : 'white',
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
    height: height / 6,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    height: height / 9,
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 15,
    justifyContent: 'flex-start',
    // marginBottom: 20,
    marginTop: 30,
  },
  profileImage: {
    backgroundColor : 'blue',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    color: '#474747',
    fontSize: 24,
    fontWeight: 'bold',
    // marginTop: 10,
  },
  cardContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    color: '#474747',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    // marginHorizontal: 20,
    color: '#707070',
    marginRight: 20,
    width: width / 1.1,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 16,
    // padding: 10
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
  },
  connectButtonContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  connectButtonText: {
    marginRight: 7,
    color: "white",
    fontSize: 18,
  },
});

export default connect(null, mapDispatchToProps)(SingleProduct);
