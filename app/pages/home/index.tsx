import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCallback, useMemo, useRef, useState } from "react";
import List, { ListProps } from "./components/list";
import Notice, { noticeHeight } from "./components/notice";
import TabLinks, { tabLinksHeight } from "./components/tab-links";
import Weather, { WeatherProps, weatherSize } from "./components/weather";

/**
 * tab 选项的高度
 */
const tabHeight = 40;
/**
 * 天气组件可以变动的大小
 * @description 大卡与小卡的高度差
 */
const weatherGap = weatherSize.normal - weatherSize.mini;
/**
 * 手势滚动最大的距离
 * @description 天气组件的变化值+tab 导航的高度
 */
const maxScrollTop = weatherGap + tabLinksHeight;

/**
 * 获取合法范围内的手势滑动距离
 * @param n 当前最大手势滑动距离
 */
const getScrollTop = (n: number) => {
  if (n >= maxScrollTop) {
    return maxScrollTop;
  }
  if (n <= 0) {
    return 0;
  }
  return n;
};

/**
 * 获取合法范围内的天气组件高度
 * @param n 当前天气组件的高度
 */
const getWeatherHeight = (n: number) => {
  if (n >= weatherSize.normal) {
    return weatherSize.normal;
  }
  if (n <= weatherSize.mini) {
    return weatherSize.mini;
  }
  return n;
};

/**
 * 获取合法范围内的导航组件高度
 * @param n 当前导航组件的高度
 */
const getTabLinksHeight = (n: number) => {
  if (n >= tabLinksHeight) {
    return tabLinksHeight;
  }
  if (n <= 0) {
    return 0;
  }
  return n;
};

const Home = () => {
  const insets = useSafeAreaInsets();
  // 页面可视范围高度
  const [pageHeight, setPageHeight] = useState(0);
  // 列表是否可以滚动
  const [scrollEnabled, setScrollEnabled] = useState(false);
  // 天气卡片的尺寸
  const [weatherType, setWeatherType] =
    useState<WeatherProps["type"]>("normal");
  // 通知栏是否展示
  const [showNotice, setShowNotice] = useState(true);
  // 动态计算列表高度
  const listHeight = useMemo(() => {
    return (
      pageHeight -
      insets.top -
      weatherSize.mini -
      tabHeight -
      (showNotice ? noticeHeight : 0)
    );
  }, [insets.top, pageHeight, showNotice]);

  /**
   * 页面已滚动的距离，用来计算天气组件、导航组件的高度
   */
  const scrollTop = useRef(0);
  /**
   * 天气组件的动画实例
   */
  const weatherAnimated = useRef(
    new Animated.Value(weatherSize.normal),
  ).current;
  /**
   * 导航组件的动画实例
   */
  const tabLinksAnimated = useRef(new Animated.Value(tabLinksHeight)).current;
  /**
   * 是否锁住页面的手势滑动
   * @description 子组件列表没有滚动到顶部，页面的手势滑动不生效
   */
  const scrollPageLocked = useRef(false);

  /**
   * 最外层 View 的 onLayout 回调，获取可视区域的高度
   */
  const onLayoutPage = useCallback((e: LayoutChangeEvent) => {
    setPageHeight(e.nativeEvent.layout.height);
  }, []);

  /**
   * 通知关闭完成的回调
   */
  const onNoticeClosed = useCallback(() => {
    setShowNotice(false);
  }, []);

  /**
   * 列表的 onScroll 回调
   */
  const onListScroll = useCallback<Exclude<ListProps["onScroll"], undefined>>(
    (e) => {
      scrollPageLocked.current = e.nativeEvent.contentOffset.y > 0;
    },
    [],
  );

  /**
   * 页面的手势滑动事件
   */
  const panResponder = useMemo(() => {
    return PanResponder.create({
      // 滑动式是否响应手势回调
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 子组件已经有滑动，外层不启用手势滑动
        if (scrollPageLocked.current) {
          return false;
        }

        // 外层滑动的距离没有到最大值，可以启动手势滑动
        if (scrollTop.current < maxScrollTop) {
          return true;
        }

        // 已经是最大值了，只有往下滑动才启用手势滑动
        // 往下滑是打开已关闭的导航组件、天气组加你
        return gestureState.dy > 0;
      },
      // 手势滑动过程中
      // 修改天气组件、导航栏组件的高度
      onPanResponderMove: (_, gestureState) => {
        /**
         * 当前安全的手势滑动距离
         */
        const currentScrollTop = getScrollTop(
          scrollTop.current - gestureState.dy,
        );
        /**
         * 当前安全的天气组件高度
         */
        const currentWeatherHeight = getWeatherHeight(
          weatherSize.normal - currentScrollTop,
        );
        // 更新组件高度
        weatherAnimated.setValue(currentWeatherHeight);
        // 修改天气组件类型
        setWeatherType(
          currentWeatherHeight === weatherSize.mini ? "mini" : "normal",
        );
        
        /**
         * 当前安全的到含量组件高旭
         */
        const currentTabLinksHeight = getTabLinksHeight(
          weatherGap + tabLinksHeight - currentScrollTop,
        );
        // 更新组件高度
        tabLinksAnimated.setValue(currentTabLinksHeight);
      },
      // 停止滑动
      onPanResponderRelease: (_, gestureState) => {
        const currentScrollTop = getScrollTop(
          scrollTop.current - gestureState.dy,
        );
        // 更新手势滑动的距离
        scrollTop.current = currentScrollTop;
        // 列表组件是否可以滚动
        setScrollEnabled(currentScrollTop >= maxScrollTop);
      },
    });
  }, [tabLinksAnimated, weatherAnimated]);

  return (
    <View
      style={styles.page}
      onLayout={onLayoutPage}
      {...panResponder.panHandlers}
    >
      {/* 背景 */}
      <View style={styles.pageBg} />

      {/* 内容盒子，在背景的 zIndex 上方 */}
      <View style={styles.pageCtx}>
        {/* 头部安全边距 */}
        <View style={{ height: insets.top }} />
        
        {/* 天气组件 */}
        <Animated.View style={[styles.dynamicBox, { height: weatherAnimated }]}>
          <Weather type={weatherType} />
        </Animated.View>

        {/* 通知栏 */}
        {showNotice ? <Notice onClosed={onNoticeClosed} /> : null}

        {/* 内容区域，有一个圆角设计 */}
        <View style={styles.pageCard}>
          {/* 导航栏 */}
          <Animated.View
            style={[styles.dynamicBox, { height: tabLinksAnimated }]}
          >
            <TabLinks />
          </Animated.View>

          {/* tab 栏 */}
          <View style={styles.tab}>
            <Text>Tab</Text>
          </View>

          {/* 列表，外部写死高度，List 自适应父节点高度 */}
          <View style={{ height: listHeight, overflow: "hidden" }}>
            <List scrollEnabled={scrollEnabled} onScroll={onListScroll} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  pageBg: {
    height: 300,
    backgroundColor: "#098",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
  },
  pageCtx: {
    position: "relative",
    zIndex: 2,
  },
  // 高度会变化的 View
  // flex-end 让内容贴下边距排列，高度变化的时候头部先消失，看起来向上移动的
  dynamicBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    overflow: "hidden",
    backgroundColor: "#000",
  },
  pageCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  tab: {
    height: tabHeight,
    backgroundColor: "#777",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Home;
