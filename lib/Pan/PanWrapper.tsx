import React, { FC } from "react";
import { RefObject } from "react";
import { Dimensions } from "react-native";
import { View, PanResponder, Animated, ScrollView } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State,
} from "react-native-gesture-handler";
import { TransformConsumer } from "..";

import {
  AnimatedValue,
  ContextValue,
  DiffClampType,
} from "../TransformProvider";

const offset = 2;

const PanWrapper: FC<
  ContextValue & {
    withScroll?: boolean;
    style?: any;
  }
> = ({
  children,
  changeOffset,
  minHeight,
  maxHeight,
  diffClampScroll,
  withScroll = false,
  prevValue,
  changePrevValue,
  style = {},
}) => {
  const [scroll] = React.useState(new Animated.Value(0));
  // const [prevValue] = React.useState(new Animated.Value(0));

  const [decay] = React.useState(new Animated.Value(0));
  const [scrollHeight, changeScrollHeight] = React.useState(0);

  const scrollViewRef = React.useRef<ScrollView>() as RefObject<ScrollView>;

  const [decayDiff] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    let decayPrev = 0;
    decay.addListener(({ value }) => {
      const testDiffVal =
        (decayDiff as AnimatedValue)._value + value - decayPrev;
      scrollViewRef?.current?.scrollTo?.({
        x: 0,
        y: testDiffVal,
        animated: true,
      });
      decayDiff.setValue(
        testDiffVal >= scrollHeight
          ? scrollHeight
          : testDiffVal <= 0
          ? 0
          : testDiffVal
      );
      decayPrev = value;
    });
    return () => decay.removeAllListeners();
  }, [decay, decayDiff, scrollViewRef, scrollHeight]);

  const _onPanGestureEvent = React.useCallback(
    ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
      const value = nativeEvent.translationY;
      const { velocityY } = nativeEvent;
      const diff = (prevValue as AnimatedValue)._value - value;
      const diffClampScrollValue = (diffClampScroll as AnimatedValue)._value;
      console.log("value", value);
      changeOffset?.(diff);
      if (
        withScroll &&
        ((velocityY <= 0 && diffClampScrollValue >= maxHeight - offset) ||
          (velocityY >= 0 && diffClampScrollValue <= minHeight + offset))
      ) {
        if (scrollHeight <= 0) {
          return;
        }
        Animated.decay(decay, {
          velocity: -nativeEvent.velocityY / 1000,
          deceleration: 0.997,
          useNativeDriver: false,
        }).start();
      }
      changePrevValue(value);
      // prevValue.setValue(value);
    },
    [prevValue, diffClampScroll, decay, scrollHeight]
  );

  const handlePanStateChange = React.useCallback(
    ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
      if (nativeEvent.state === 5) {
        changePrevValue(0);
        // prevValue.setValue(0);
        scroll.setValue(0);
      }
    },
    [prevValue, scroll]
  );

  const onContentSizeChange = React.useCallback(
    (_, height) => {
      if (!scrollHeight || scrollHeight !== height) {
        changeScrollHeight(height - Dimensions.get("screen").height);
      }
    },
    [scrollHeight]
  );

  return withScroll ? (
    <PanGestureHandler
      onHandlerStateChange={handlePanStateChange}
      activeOffsetY={[-5, 5]}
      onGestureEvent={_onPanGestureEvent}
    >
      <ScrollView onContentSizeChange={onContentSizeChange} ref={scrollViewRef}>
        {children}
      </ScrollView>
    </PanGestureHandler>
  ) : (
    typeof children === "function" &&
      children({
        onGestureEvent: _onPanGestureEvent,
        onHandlerStateChange: handlePanStateChange,
        onContentSizeChange,
      })
  );
};

export default TransformConsumer(PanWrapper);
