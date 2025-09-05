import { memo } from "react";
import { FlatList, FlatListProps, StyleSheet, Text, View } from "react-native";

export interface ListProps
  extends Pick<FlatListProps<any>, "onScroll" | "scrollEnabled"> {
  scrollEnabled: boolean;
}

const mockData = new Array(100).fill(0).map((_, index) => ({
  id: `${index}`,
  title: `标题呢 - ${index}`,
}));

const List: React.FC<ListProps> = ({ onScroll, scrollEnabled }) => {
  return (
    <FlatList
      onScroll={onScroll}
      scrollEnabled={scrollEnabled}
      bounces={false}
      data={mockData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        return (
          <View style={styles.item}>
            <Text style={styles.text}>{item.title}</Text>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  item: {
    height: 100,
    backgroundColor: "#f5f5f5",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#098",
  },
  text: {
    fontSize: 40,
    color: "#666",
  },
});

export default memo(List);
