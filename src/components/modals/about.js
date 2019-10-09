import React from 'react';


export default (props) => (
  <div id="about" className="modal modal-fixed-footer">
      <div className="modal-content">
          <h4 className="center">{props.about}</h4>
          {props.aboutContent.map((line, i) => <p key={i}>{line}</p>)}
          {props.author}<a target="_blank" rel="noopener noreferrer" href="https://github.com/DavidGildour">Maciej B. Nowak</a>
      </div>
      <div className="modal-footer">
          <a href="#!" className="modal-close btn-flat">{props.close}</a>
      </div>
  </div>
)