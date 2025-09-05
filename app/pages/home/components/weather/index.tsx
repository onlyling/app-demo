import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface WeatherProps {
  type: "normal" | "mini";
}

export const weatherSize = {
  normal: 100,
  mini: 60,
};

const Weather: React.FC<WeatherProps> = ({ type }) => {
  return (
    <View style={[styles.box, type === "mini" ? styles.boxMini : undefined]}>
      <View>
        <Text>天气1</Text>
      </View>
      <View>
        <Text>天气2</Text>
      </View>
      <View>
        <Text>天气3</Text>
      </View>
      <View>
        <Text>天气4</Text>
      </View>
      <View>
        <Text>天气5</Text>
      </View>
      <View>
        <Text>天气6</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: "#654",
    height: weatherSize.normal,
  },
  boxMini: {
    backgroundColor: "#123",
    height: weatherSize.mini,
  },
});

export default memo(Weather);
