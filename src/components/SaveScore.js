import React from 'react';

export default function(props) {
  return (
    <button onClick={props.onClick}
        className="btn-floating tooltipped"
        data-position="right"
        data-tooltip="Save changes"
    >
        <i className="material-icons">save</i>
    </button>
  )
}