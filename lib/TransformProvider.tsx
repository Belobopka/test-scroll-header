import React, { FC } from "react";
import { Animated } from "react-native";

type TransformProviderProps = {
  children: JSX.Element;
  maxHeight: number;
  minHeight: number;
  transformDuration?: number;
};

export type WithInnerValue<Type> = Type & {
  _value: number;
};

export type DiffClampType = WithInnerValue<Animated.AnimatedDiffClamp>;
export type AnimatedValue = WithInnerValue<Animated.Value>;

export type ContextValue = {
  interpolatedValue: Animated.AnimatedInterpolation;
  minHeight: number;
  maxHeight: number;
  headerOffset: Animated.Value;
  preserveHeader?: boolean;
  changeOffset: (item: number) => void;
  diffClampScroll: Animated.AnimatedDiffClamp;
};

export const TransformContext = React.createContext<ContextValue>({
  interpolatedValue: new Animated.Value(0),
  diffClampScroll: new Animated.Value(0),
  minHeight: 0,
  maxHeight: 250,
  headerOffset: new Animated.Value(0),
  changeOffset: () => {},
});

const TransformProvider: FC<TransformProviderProps> = ({
  children,
  maxHeight,
  minHeight,
}: TransformProviderProps) => {
  const [headerOffset] = React.useState(new Animated.Value(0));
  const [diffClampScroll, changeDiffClampScroll] = React.useState(
    Animated.diffClamp(headerOffset, minHeight, maxHeight)
  );
  const interpolate = React.useMemo(
    () =>
      diffClampScroll.interpolate({
        inputRange: [minHeight, maxHeight],
        outputRange: [minHeight, -maxHeight],
      }),
    [diffClampScroll]
  );

  const changeOffset = React.useCallback((item) => {
    Animated.timing(headerOffset, {
      toValue: item + (headerOffset as AnimatedValue)._value,
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, []);

  const value = {
    interpolatedValue: interpolate,
    diffClampScroll,
    minHeight,
    maxHeight,
    headerOffset,
    changeOffset,
  };
  return (
    <TransformContext.Provider value={value}>
      {children}
    </TransformContext.Provider>
  );
};

export default TransformProvider;
