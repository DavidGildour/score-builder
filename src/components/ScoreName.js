import React from 'react';


export default function(props) {
  return (
    <div className="score-name">
      <div className="input-field inline">
        <span>Score name: </span>
        <input onChange={props.onChange} className="center" type="text" id="name" value={props.name} />
      </div>
    </div>
  )
}