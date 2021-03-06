import React from "react";
import { getServerUrl } from "@atpls/audioset";
import { openFullScreen } from "./fullscreen";
import Icon, { ICONS } from "./icons";
import Keyboard from "./Keyboard";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mute: false, keyboardVisible: false };
    this.toggleMute = this.toggleMute.bind(this);
    this.toggleKeyboard = this.toggleKeyboard.bind(this);
    this.stopAll = this.stopAll.bind(this);
  }
  toggleMute() {
    const mute = !this.state.mute;
    this.setState({ ...this.state, mute });
  }
  toggleKeyboard() {
    const keyboardVisible = !this.state.keyboardVisible;
    this.setState({ ...this.state, keyboardVisible });
  }
  stopAll() {
    this.props.events.emit("/clip/stop-all");
    this.setState({ ...this.state, running: false });
  }
  render() {
    const { mute, keyboardVisible } = this.state;
    const { set, events, url } = this.props;
    const { title, description } = set.meta;
    const controlUrl = getServerUrl(url, "3333") + "/control";
    const isServer = controlUrl.indexOf("127.0.0.1") === -1;
    return (
      <div className="App">
        <header>
          <div className="body">
            {title}: {description}
          </div>
          {isServer && (
            <a href={controlUrl} target="_blank">
              {controlUrl}
            </a>
          )}
          <Icon alt="stop" icon={ICONS.stop} onClick={() => this.stopAll()} />
          <Icon
            alt="stop"
            icon={mute ? ICONS.volumeOff : ICONS.volumeUp}
            onClick={() => this.toggleMute()}
          />
          <Icon
            alt="stop"
            icon={ICONS.keyboard}
            onClick={this.toggleKeyboard}
          />
          <Icon alt="stop" icon={ICONS.fullscreen} onClick={openFullScreen} />
        </header>
        {keyboardVisible && <Keyboard events={events} clips={set.clips} />}
      </div>
    );
  }
}

export default App;
