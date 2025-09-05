import { useMemoizedFn } from "ahooks";
import { memo, useCallback, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export interface NoticeProps {
  onClosed: () => void;
}

export const noticeHeight = 30;

const Notice: React.FC<NoticeProps> = ({ onClosed }) => {
  const noticeAnimated = useRef(new Animated.Value(noticeHeight)).current;
  const onClosedMemo = useMemoizedFn(onClosed);

  const onPress = useCallback(() => {
    Animated.timing(noticeAnimated, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        console.log("fff");
        onClosedMemo();
      }
    });
  }, [noticeAnimated, onClosedMemo]);

  return (
    <Animated.View style={[styles.box, { height: noticeAnimated }]}>
      <Text style={styles.text}>notice</Text>
      <Pressable onPress={onPress}>
        <View style={styles.icon} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#963",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  text: {
    lineHeight: noticeHeight,
  },
  icon: {
    height: 20,
    width: 20,
    backgroundColor: "#f30",
  },
});

export default memo(Notice);
