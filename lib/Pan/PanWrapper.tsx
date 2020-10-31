import React, { FC } from "react";
import { View, PanResponder, Animated, ScrollView } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { TransformConsumer } from "..";

import { ContextValue } from "../TransformProvider";

const offset = 2;

const PanWrapper: FC<ContextValue> = ({
  children,
  changeOffset,
  minHeight,
  maxHeight,
  interpolatedValue,
  diffClampScroll,
  headerOffset,
}) => {
  const [scroll] = React.useState(new Animated.Value(0));
  const [prevValue] = React.useState(new Animated.Value(0));
  const [scrollVal] = React.useState(new Animated.Value(0));

  const [decay] = React.useState(new Animated.Value(0));
  // React.useEffect(() => {
  //   scroll.addListener(({ value }) => {
  //     let diff = prevValue._value - value;
  //     console.log("diffClampScroll", diffClampScroll);
  //     changeOffset?.(diff);
  //     if (
  //       diffClampScroll._value >= maxHeight - offset ||
  //       diffClampScroll._value <= minHeight + offset
  //     ) {
  //       scrollViewRef.current.scrollTo({
  //         x: 0,
  //         y: scrollVal._value,
  //         animated: true,
  //       });
  //       scrollVal.setValue(scrollVal._value + diff);
  //     }
  //     prevValue.setValue(value);
  //   });
  // }, []);

  const scrollViewRef = React.useRef();

  decay.addListener(({ value }) => {
    console.log("decay", value);
    return scrollViewRef.current.scrollTo({
      x: 0,
      y: value,
      animated: true,
    });
  });

  // TODO add limiter for decay, change _value access to native drivers true only
  const _onPanGestureEvent = ({ nativeEvent }) => {
    console.log(nativeEvent);
    const value = nativeEvent.translationY;
    const { velocityY } = nativeEvent;
    console.log(velocityY);
    let diff = prevValue._value - value;
    console.log("diffClampScroll", diffClampScroll);
    changeOffset?.(diff);
    if (
      (velocityY <= 0 && diffClampScroll._value >= 230) ||
      (velocityY >= 0 && diffClampScroll._value <= 20)
    ) {
      // scrollViewRef.current.scrollTo({
      //   x: 0,
      //   y: scrollVal._value,
      //   animated: true,
      // });
      // decay.setValue(scrollVal._value);
      Animated.decay(decay, {
        velocity: -nativeEvent.velocityY / 1000,
        deceleration: 0.997,
        useNativeDriver: false,
      }).start();
      // scrollVal.setValue(scrollVal._value + diff);
    }
    prevValue.setValue(value);
    // return Animated.event([{ nativeEvent: { translationY: scroll } }], {
    //   useNativeDriver: false,
    // })(event);
  };

  const handlePanStateChange = ({ nativeEvent }) => {
    console.log(nativeEvent.state);
    if (nativeEvent.state === 5) {
      // decay.setValue(nativeEvent.translationY);
      // Animated.decay(decay, {
      //   velocity: -nativeEvent.velocityY / 10000,
      //   deceleration: 0.997,
      //   useNativeDriver: false,
      // }).start();
      prevValue.setValue(0);
      scroll.setValue(0);
    }
  };

  // const _onPanGestureEvent = (event) => console.log(event.nativeEvent);

  return (
    <PanGestureHandler
      onHandlerStateChange={handlePanStateChange}
      // failOffsetY={-100}
      // minDist={100}
      activeOffsetY={[-5, 5]}
      onGestureEvent={_onPanGestureEvent}
    >
      <ScrollView ref={scrollViewRef}>{children}</ScrollView>
    </PanGestureHandler>
  );
};

export default TransformConsumer(PanWrapper);
