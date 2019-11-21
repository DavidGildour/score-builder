import React from 'react';

export default class extends React.Component {
  state = {
    lastChange: this.props.changeIndicator
  }

  onClick = () => {
    this.props.onClick();
    this.setState({
      lastChange: this.props.changeIndicator
    })
  }

  render = () => {
    let icon, text, callback, cls;
    if (this.state.lastChange === this.props.changeIndicator) {
      icon = <i className="material-icons">done</i>;
      text = "Everything's saved!";
      callback = null;
      cls = "btn-floating tooltipped";
    } else {
      icon = <i className="material-icons">save</i>;
      text = "Save changes";
      callback = this.onClick;
      cls = "btn-floating tooltipped deep-orange accent-2";
    }

    return (
      <button onClick={callback}
        className={cls}
        data-position="right"
        data-tooltip={text}
      >
        {icon}
      </button>
    )
  }
}