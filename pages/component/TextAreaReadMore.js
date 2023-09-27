import React from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import Colors from "../rewards/styles/colors";

export default class TextAreaReadMore extends React.Component {
  state = {
    measured: false,
    shouldShowReadMore: false,
    showAllText: false,
  };

  async componentDidMount() {
    this._isMounted = true;
    await nextFrameAsync();

    if (!this._isMounted) {
      return;
    }

    // Get the height of the text with no restriction on number of lines
    const fullHeight = await measureHeightAsync(this._text);
    this.setState({ measured: true });
    await nextFrameAsync();

    if (!this._isMounted) {
      return;
    }

    // Get the height of the text now that number of lines has been set
    const limitedHeight = await measureHeightAsync(this._text);

    if (fullHeight > limitedHeight) {
      this.setState({ shouldShowReadMore: true }, () => {
        this.props.onReady && this.props.onReady();
      });
    } else {
      this.props.onReady && this.props.onReady();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { measured, showAllText } = this.state;

    let { numberOfLines } = this.props;

    var contents;
    let tokens = this.props.children;
    tokens = tokens.split(/(\s){1}/);

    contents = tokens.map((token, i) => {
      let hasSpace = i !== tokens.length - 1;
      let maybeSpace = hasSpace ? " " : "";

      if (token.match(/^(https?|ftp|file)\:\//)) {
        return (
          <Text
            key={i}
            style={{ color: "blue" }}
            onPress={() => {
              Linking.openURL(token);
            }}
          >
            {token}
            {maybeSpace}
          </Text>
        );
      } else {
        return <Text>{token}</Text>;
      }
    });

    return (
      <View>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          style={this.props.textStyle}
          ref={(text) => {
            this._text = text;
          }}
        >
          {contents}
        </Text>

        {this._maybeRenderReadMore()}
      </View>
    );
  }

  _handlePressReadMore = () => {
    this.setState({ showAllText: true });
  };

  _handlePressReadLess = () => {
    this.setState({ showAllText: false });
  };

  _maybeRenderReadMore() {
    let { shouldShowReadMore, showAllText } = this.state;

    if (shouldShowReadMore && !showAllText) {
      if (this.props.renderTruncatedFooter) {
        return this.props.renderTruncatedFooter(this._handlePressReadMore);
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadMore}>
          Read more
        </Text>
      );
    } else if (shouldShowReadMore && showAllText) {
      if (this.props.renderRevealedFooter) {
        return this.props.renderRevealedFooter(this._handlePressReadLess);
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadLess}>
          Hide
        </Text>
      );
    }
  }
}

function measureHeightAsync(component) {
  return new Promise((resolve) => {
    component.measure((x, y, w, h) => {
      resolve(h);
    });
  });
}

function nextFrameAsync() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

const styles = StyleSheet.create({
  button: {
    color: Colors.primary,
    marginTop: 5,
  },
});
