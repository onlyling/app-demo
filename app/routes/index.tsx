import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "@/app/pages/home";
import List from "@/app/pages/list";
import User from "@/app/pages/user";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        headerShown: false,
      },
    },
    User,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Index: {
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    },
    List,
  },
});

export const NavigationStack = createStaticNavigation(RootStack);

export type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
