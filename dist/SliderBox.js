import React, { Component, useEffect, useRef } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";

import Carousel, { Pagination } from "react-native-snap-carousel"; //Thank From distributer(s) of this lib
import styles from "./SliderBox.style";
import Pinchable from "react-native-pinchable";

// -------------------Props--------------------
// images
// onCurrentImagePressed
// sliderBoxHeight
// parentWidth
// dotColor
// inactiveDotColor
// dotStyle
// paginationBoxVerticalPadding
// circleLoop
// autoplay
// ImageComponent
// ImageLoader
// paginationBoxStyle
// resizeMethod
// resizeMode
// ImageComponentStyle,
// imageLoadingColor = "#E91E63"
// firstItem = 0
// activeOpacity
// autoplayInterval = 3000

const width = Dimensions.get("window").width;

export class SliderBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImage: props.firstItem || 0,
      loading: [],
    };
    this.onCurrentImagePressedHandler =
      this.onCurrentImagePressedHandler.bind(this);
    this.onSnap = this.onSnap.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this.scrollViewRef = React.createRef();
  }

  componentDidMount() {
    //let a = [...Array(this.props.images.length).keys()].map((i) => false);
  }

  onCurrentImagePressedHandler() {
    if (this.props.onCurrentImagePressed) {
      this.props.onCurrentImagePressed(this.state.currentImage);
    }
  }

  onSnap(index) {
    this._ref.snapToItem(index);
    const { currentImageEmitter } = this.props;
    this.setState({ currentImage: index }, () => {
      if (currentImageEmitter && typeof currentImageEmitter === "function") {
        currentImageEmitter(this.state.currentImage);
      }
    });
  }

  _renderItem({ item, index }) {
    const {
      ImageComponent,
      ImageComponentStyle = {},
      LoaderComponent,
      sliderBoxHeight,
      disableOnPress,
      resizeMethod,
      resizeMode,
      imageLoadingColor = "#E91E63",
      underlayColor = "transparent",
      activeOpacity = 0.85,
      enablePinchable = false,
      maximumZoomScale = 10,
      minimumZoomScale = 1,
    } = this.props;

    return (
      <View
        style={{
          position: "relative",
          justifyContent: "center",
        }}
      >
        <TouchableHighlight
          key={index}
          underlayColor={underlayColor}
          disabled={disableOnPress}
          onPress={this.onCurrentImagePressedHandler}
          activeOpacity={activeOpacity}
        >
          {enablePinchable ? (
            <Pinchable
              minimumZoomScale={minimumZoomScale}
              maximumZoomScale={maximumZoomScale}
            >
              <ImageComponent
                style={[
                  {
                    width: "100%",
                    height: sliderBoxHeight || 200,
                    alignSelf: "center",
                  },
                  ImageComponentStyle,
                ]}
                source={typeof item === "string" ? { uri: item } : item}
                resizeMethod={resizeMethod || "resize"}
                resizeMode={resizeMode || "cover"}
                //onLoad={() => {}}
                //onLoadStart={() => {}}
                onLoadEnd={() => {
                  let t = this.state.loading;
                  t[index] = true;
                  this.setState({ loading: t });
                }}
                {...this.props}
              />
            </Pinchable>
          ) : (
            <ImageComponent
              style={[
                {
                  width: "100%",
                  height: sliderBoxHeight || 200,
                  alignSelf: "center",
                },
                ImageComponentStyle,
              ]}
              source={typeof item === "string" ? { uri: item } : item}
              resizeMethod={resizeMethod || "resize"}
              resizeMode={resizeMode || "cover"}
              //onLoad={() => {}}
              //onLoadStart={() => {}}
              onLoadEnd={() => {
                let t = this.state.loading;
                t[index] = true;
                this.setState({ loading: t });
              }}
              {...this.props}
            />
          )}
        </TouchableHighlight>
        {!this.state.loading[index] && (
          <LoaderComponent
            index={index}
            size="large"
            color={imageLoadingColor}
            style={{
              position: "absolute",
              alignSelf: "center",
            }}
          />
        )}
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    this.scrollViewRef?.current?.scrollTo({
      x: this.state.currentImage * (6 + 3) + 9 / 2 - 75 / 2 + 9,
      animated: true,
    });
  }

  get pagination() {
    const { currentImage } = this.state;
    const {
      images,
      dotStyle,
      dotColor,
      inactiveDotColor,
      paginationBoxStyle,
      paginationBoxVerticalPadding,
    } = this.props;
    return (
      <Pagination
        borderRadius={2}
        dotsLength={images.length}
        activeDotIndex={currentImage}
        dotStyle={dotStyle || styles.dotStyle}
        dotColor={dotColor || colors.dotColors}
        inactiveDotColor={inactiveDotColor || colors.white}
        inactiveDotScale={0.8}
        carouselRef={this._ref}
        inactiveDotOpacity={0.8}
        tappableDots={!!this._ref}
        containerStyle={[
          styles.paginationBoxStyle,
          paginationBoxVerticalPadding
            ? { paddingVertical: paginationBoxVerticalPadding }
            : {},
          paginationBoxStyle ? paginationBoxStyle : {},
        ]}
        renderDots={(activeIndex, total, context) => {
          return (
            <ScrollView
              ref={this.scrollViewRef}
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{ maxWidth: 75 }}
              contentContainerStyle={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {Array.from({ length: total }, (_, i) => (
                <View
                  key={i}
                  style={[
                    {
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      marginHorizontal: 3,
                      backgroundColor:
                        i === activeIndex
                          ? dotColor || colors.dotColors
                          : inactiveDotColor || colors.dotColors,
                    },
                  ]}
                />
              ))}
            </ScrollView>
          );
        }}
        {...this.props}
      />
    );
  }

  render() {
    const {
      images,
      circleLoop,
      autoplay,
      parentWidth,
      loopClonesPerSide,
      autoplayDelay,
      useScrollView,
      autoplayInterval,
    } = this.props;
    const { currentImage } = this.state;
    return (
      <View>
        <Text
          style={{
            position: "absolute",
            right: 20,
            top: 15,
            backgroundColor: "#333",
            color: "white",
            zIndex: 5,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 15,
            fontSize: 12,
          }}
        >
          {currentImage + 1}/{images.length}
        </Text>
        <Carousel
          autoplayDelay={autoplayDelay}
          autoplayInterval={autoplayInterval || 3000}
          layout={"default"}
          useScrollView={useScrollView}
          data={images}
          ref={(c) => (this._ref = c)}
          loop={circleLoop || false}
          enableSnap={true}
          autoplay={autoplay || false}
          itemWidth={parentWidth || width}
          sliderWidth={parentWidth || width}
          loopClonesPerSide={loopClonesPerSide || 5}
          renderItem={this._renderItem}
          onSnapToItem={(index) => this.onSnap(index)}
          {...this.props}
        />
        {images.length > 1 && this.pagination}
      </View>
    );
  }
}

const colors = {
  dotColors: "#BDBDBD",
  white: "#FFFFFF",
};

SliderBox.defaultProps = {
  ImageComponent: Image,
  LoaderComponent: ActivityIndicator,
};
