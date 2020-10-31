import React, { FC } from "react";
import { View, PanResponder, Animated } from "react-native";

const PanWrapper = ({ children, style }) => {
  const [blockScroll, changeBlock] = React.useState(true);
  const [headerOffset] = React.useState(new Animated.Value(0));
  const [diffClampScroll, changeDiffClampScroll] = React.useState(
    Animated.diffClamp(headerOffset, 0, 250)
  );
  const interpolatedValue = React.useMemo(
    () =>
      diffClampScroll.interpolate({
        inputRange: [0, 250],
        outputRange: [0, -250],
      }),
    [diffClampScroll]
  );
  // const blockScroll = React.useRef({ blocked: true }).current;
  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      // @ts-ignore
      onScrollSetPanResponderCapture: () => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        console.log("onStartShouldSetPanResponderCapture");
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: () => {
        console.log("onPanResponderTerminationRequest");
        return true;
      },

      onPanResponderGrant: (evt, gestureState) => {
        changeBlock(true);
        console.log("onPanResponderGrant gestureState");
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // Animated.spring(headerOffset, {
        //   toValue: gestureState.moveY,
        //   useNativeDriver: false,
        // });

        if (gestureState.moveY >= 250) {
          changeBlock(false);
        } else {
          headerOffset.setValue(gestureState.moveY);
        }
        console.log("gestureState.moveY", gestureState.moveY);
        // console.log("onPanResponderMove gestureState");
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      // onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        console.log("onPanResponderRelease gestureState");
        // changeBlock(false);
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        console.log("onPanResponderTerminate gestureState");
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    })
  ).current;

  return <>{children(panResponder.panHandlers)}</>;
};

export default PanWrapper;
