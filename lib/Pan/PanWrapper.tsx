import React, { FC } from "react";
import { View, PanResponder, Animated, ScrollView } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { TransformConsumer } from "..";

const PanWrapper = ({ children, changeOffset }) => {
  const [scroll] = React.useState(new Animated.Value(0));
  React.useEffect(() => {
    let prevValue = scroll._value;
    let scrollPrev = 0;
    scroll.addListener(({ value }) => {
      // console.log("dlt");
      changeOffset?.(prevValue - value);
      console.log("value", prevValue - value);
      // if (value >= 250 || value <= 0) {
      //   scrollViewRef.current.scrollTo({
      //     x: 0,
      //     y: value - scrollPrev,
      //     animated: true,
      //   });
      //   scrollPrev = value - prevValue;
      // }
      prevValue = value;
    });
  }, []);

  const scrollViewRef = React.useRef();

  const _onPanGestureEvent = (event) => {
    console.log(event.nativeEvent);
    return Animated.event([{ nativeEvent: { translationY: scroll } }], {
      useNativeDriver: false,
    })(event);
  };

  const handlePanStateChange = ({ nativeEvent }) =>
    console.log("handlePanStateChange", nativeEvent.state);

  // const _onPanGestureEvent = (event) => console.log(event.nativeEvent);

  return (
    <PanGestureHandler
      onHandlerStateChange={handlePanStateChange}
      // failOffsetY={-100}
      onGestureEvent={_onPanGestureEvent}
    >
      <ScrollView ref={scrollViewRef}>{children}</ScrollView>
    </PanGestureHandler>
  );
};

export default TransformConsumer(PanWrapper);
