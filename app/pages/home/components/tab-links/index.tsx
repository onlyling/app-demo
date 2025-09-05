import { useNavigation } from "@react-navigation/native";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const tabLinksHeight = 100;

const TabItem: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.item}
      onPress={() => {
        navigation.navigate("List");
      }}
    >
      <View>
        <View style={styles.icon} />
        <Text>2432</Text>
      </View>
    </Pressable>
  );
};

const TabLinks = () => {
  return (
    <View style={styles.box}>
      <TabItem />
      <TabItem />
      <TabItem />
      <TabItem />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: "#157",
    flexDirection: "row",
    overflow: "hidden",
    height: tabLinksHeight,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 60,
    height: 60,
    backgroundColor: "#000",
  },
});

export default memo(TabLinks);
