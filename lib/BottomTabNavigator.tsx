import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";
import {
  View,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { BottomTabParamList } from "../types";

import {
  TransformProvider,
  TransformConsumer,
  HeaderWrapper,
  ScrollWrapper,
} from "@beloboka/rn-animated";

const routes = {
  tabOne: "TabOne",
  tabTwo: "TabTwo",
};

const Header = () => (
  <HeaderWrapper>
    {({
      interpolatedValue,
      maxHeight,
    }: {
      interpolatedValue: Animated.AnimatedInterpolation;
      maxHeight: number;
    }) => (
      <Animated.View
        style={{
          backgroundColor: "red",
          width: "100%",
          height: maxHeight,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          elevation: 100,
          transform: [{ translateY: interpolatedValue }],
        }}
      ></Animated.View>
    )}
  </HeaderWrapper>
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
        style={{
          position: "absolute",
          backgroundColor: "orange",
          width: "100%",
          top: maxHeight,
          transform: [{ translateY: interpolatedValue }],
          zIndex: 101,
          flexDirection: "row",
        }}
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

const NavTabScreen = (options: any) => (
  <ResponsiveScroll
    {...options}
    style={{
      position: "absolute",
      height: Dimensions.get("screen").height,
      width: "100%",
    }}
  />
);

const ResponsiveScroll = (props: any) => {
  return (
    <ScrollWrapper>
      {({ onChangeFocus, handleOnScroll }: any) => {
        React.useEffect(() => {
          props.navigation.addListener("focus", (e: any) => {
            if (e.target.indexOf(props.tabName) !== -1) {
              onChangeFocus();
            }
          });
        }, []);

        const data = React.useMemo(() => generateItems(25), []);
        return (
          <Animated.ScrollView
            style={props.style}
            contentContainerStyle={{
              paddingTop: HEADER_HEIGHT,
            }}
            onScroll={(event) => {
              return handleOnScroll(event);
            }}
          >
            {data.map((datum) => {
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
                ></View>
              );
            })}
          </Animated.ScrollView>
        );
      }}
    </ScrollWrapper>
  );
};

const BottomTab = createMaterialTopTabNavigator<BottomTabParamList>();

const HEADER_HEIGHT = 250;

export default function BottomTabNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        style={{
          position: "absolute",
          top: 0,
          height: HEADER_HEIGHT + Dimensions.get("screen").height,
          flex: 1,
          width: "100%",
        }}
      >
        <>
          <Animated.View
            style={{
              backgroundColor: "red",
              width: "100%",
              height: HEADER_HEIGHT,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              elevation: 100,
              // transform: [{ translateY: interpolatedValue }],
            }}
          ></Animated.View>
          <BottomTab.Navigator style={{ flex: 1 }} tabBar={TabBar}>
            <BottomTab.Screen name="TabOne">
              {(options) => <NavTabScreen tabName="TabOne" {...options} />}
            </BottomTab.Screen>
            <BottomTab.Screen name="TabTwo">
              {(options) => <NavTabScreen tabName="TabTwo" {...options} />}
            </BottomTab.Screen>
          </BottomTab.Navigator>
        </>
      </Animated.ScrollView>
    </View>
  );
}

// export default function BottomTabNavigator() {
//   return (
//     <View style={{ flex: 1 }}>
//       <TransformProvider minHeight={0} maxHeight={HEADER_HEIGHT}>
//         <>
//           <Header />
//           <BottomTab.Navigator style={{ flex: 1 }} tabBar={TabBar}>
//             <BottomTab.Screen name="TabOne">
//               {(options) => <NavTabScreen tabName="TabOne" {...options} />}
//             </BottomTab.Screen>
//             <BottomTab.Screen name="TabTwo">
//               {(options) => <NavTabScreen tabName="TabTwo" {...options} />}
//             </BottomTab.Screen>
//           </BottomTab.Navigator>
//         </>
//       </TransformProvider>
//     </View>
//   );
// }

const generateItems = (length: number) => {
  return new Array(length).fill(0).map((_, index) => ({
    id: index,
    color: "darkblue",
    // color: generateRandomColor(),
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
