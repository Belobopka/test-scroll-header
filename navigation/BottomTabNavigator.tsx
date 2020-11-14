import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";
import {
  View,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

import { BottomTabParamList } from "../types";

import {
  TransformProvider,
  TransformConsumer,
  HeaderWrapper,
  ScrollWrapper,
} from "../lib";
import { PanWrapper } from "../lib/Pan";
import { PanGestureHandler } from "react-native-gesture-handler";

type Partia = Partial<any>;

const HEADER_HEIGHT = 250;

const routes = {
  tabOne: "TabOne",
  tabTwo: "TabTwo",
};

const Header = TransformConsumer(
  ({
    interpolatedValue,
    maxHeight,
    minHeight,
  }: {
    interpolatedValue: Animated.AnimatedInterpolation;
    maxHeight: number;
    minHeight: number;
  }) => {
    return (
      <PanWrapper>
        {({ onGestureEvent, handlePanStateChange }) => (
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={handlePanStateChange}
          >
            <Animated.View
              style={[
                styles.header,
                {
                  transform: [
                    {
                      translateY: interpolatedValue,
                    },
                  ],
                  top: 0,
                  backgroundColor: "orange",
                },
              ]}
            >
              <View style={[styles.bar, { height: maxHeight }]}>
                <Text style={styles.title}>Title</Text>
              </View>
            </Animated.View>
          </PanGestureHandler>
        )}
      </PanWrapper>
    );
  }
);

const TabBar = TransformConsumer(
  ({ navigation, interpolatedValue, maxHeight }: any) => {
    const onPress = (routeName: string) => () => {
      const event = navigation.emit({
        type: "tabPress",
        target: routeName,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.navigate(routeName);
      }
    };
    return (
      <Animated.View
        style={[
          { top: maxHeight },
          {
            position: "absolute",
            width: "100%",
            backgroundColor: "red",
            zIndex: 1,
            flexDirection: "row",
            transform: [{ translateY: interpolatedValue }],
          },
        ]}
      >
        <TouchableOpacity onPress={onPress(routes.tabOne)}>
          <Text>{routes.tabOne}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress(routes.tabTwo)}>
          <Text>{routes.tabTwo}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

const NavTabScreen = (options: any) => <ResponsiveScroll {...options} />;

const ResponsiveScroll = (props: any) => {
  const data = React.useMemo(() => generateItems(25), []);
  return (
    <PanWrapper withScroll>
      <ScrollWrapper>
        {({ maxHeight, minHeight, interpolatedValue }: any) => {
          return (
            <Animated.View
              style={{
                minHeight: Dimensions.get("screen").height - maxHeight,
                transform: [
                  {
                    translateY: interpolatedValue.interpolate({
                      inputRange: [-maxHeight, minHeight],
                      outputRange: [minHeight, maxHeight],
                    }),
                  },
                ],
              }}
            >
              {data.map((datum, index) => {
                return (
                  <View
                    key={datum.id}
                    style={{
                      width: "100%",
                      height: 100,
                      backgroundColor: datum.color,
                      padding: 15,
                      marginVertical: 15,
                    }}
                  >
                    <Text>{index + 1}</Text>
                  </View>
                );
              })}
            </Animated.View>
          );
        }}
      </ScrollWrapper>
    </PanWrapper>
  );
};

const BottomTab = createMaterialTopTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <TransformProvider minHeight={0} maxHeight={HEADER_HEIGHT}>
      <View style={{ flex: 1 }}>
        <BottomTab.Navigator tabBar={TabBar}>
          <BottomTab.Screen name="TabOne">
            {(options) => <NavTabScreen tabName="TabOne" {...options} />}
          </BottomTab.Screen>
          <BottomTab.Screen name="TabTwo">
            {(options) => <NavTabScreen tabName="TabTwo" {...options} />}
          </BottomTab.Screen>
        </BottomTab.Navigator>
        <Header />
      </View>
    </TransformProvider>
  );
}

const generateItems = (length: number) => {
  return new Array(length).fill(0).map((_, index) => ({
    id: index,
    // color: "darkblue",
    color: generateRandomColor(),
  }));
};

const generateRandomColor = () => {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return (
    "rgba(" +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    r().toFixed(1) +
    ")"
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#03A9F4",
    overflow: "hidden",
  },
  bar: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: 18,
  },
});
