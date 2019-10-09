import React from 'react';


export default class extends React.Component {
  toggleAnim = id => {
    const elem = document.querySelector(`.custom-collapsible#${id}`)
    switch(elem.className) {
      case 'custom-collapsible collapse':
      elem.className = 'custom-collapsible expand';
      break;
      case 'custom-collapsible expand':
      elem.className = 'custom-collapsible collapse';
      break;
      default:
      elem.className = 'custom-collapsible expand';
    }
  }

  cleanUp = () => {
    this.props.clearMessage();
    const elems = document.getElementsByClassName('custom-collapsible');
    for (const elem of elems) {
      elem.className = 'custom-collapsible';
    }
  }

  render = () => (
    <div id="user-info" className="modal user-info modal-fixed-footer">
      <div className="modal-content">
        <div className="lime-text text-darken-2 center-align">{this.props.message}</div>
        <h5 className="center-align">{this.props.text.user_info}:</h5>
        <ul className="collection">
          <li className="collection-item">
            <div>
              {this.props.text.username}: <span className="secondary-content">{this.props.user.username}</span>
            </div>
          </li>
          <li className="collection-item">
            <div>
              {this.props.text.email}: <span className="secondary-content">{this.props.user.email}</span>
            </div>
          </li>
          <li className="collection-item">
          <div id='password' className="custom-collapsible">
            {this.props.text.password}: 
            <span className="secondary-content" style={{cursor: 'pointer'}} onClick={() => this.toggleAnim('password')}>
              {this.props.text.change}<i className="material-icons right">create</i>
            </span>
            <div className="content">
              <form className="center-align" onSubmit={(e) => {this.props.editUser(e);this.toggleAnim('password')}}>
                <input id="old_password" type="password" placeholder={this.props.text.old_password} />
                <input id="password1" type="password" placeholder={this.props.text.new_password} />
                <input id="password2" type="password" placeholder={this.props.text.repeat_password} />
                <input type="submit" style={{display: 'none'}} />
                <button className="btn waves-effect waves-light" onClick={(e) => {e.preventDefault();this.toggleAnim('password')}}>{this.props.text.cancel}</button>&nbsp;
                <button className="btn waves-effect waves-light" type="submit">{this.props.text.change}</button>
              </form>
            </div>
          </div>
          </li>
          <li className="collection-item">
            <div>
              {this.props.text.registration_date}: <span className="secondary-content">{this.props.user.registration_date}</span>
            </div>
          </li>
        </ul>
        <div id='delete-box' className="custom-collapsible">
          <button style={{zIndex: 11}} onClick={() => this.toggleAnim('delete-box')} className="btn red waves-effect waves-light fill" id="delete">{this.props.text.delete.delete}</button>
          <div className="content" style={{bottom: '-3em'}}>
            <div id="info" className="card red lighten-4">
              <div className="card-content">
                <span className="card-title">{this.props.text.delete.message_header}</span>
                <p>{this.props.text.delete.message_content}</p>
              </div>
              <div className="card-action">
                <div className="row">
                  <div className="col s6">
                    <button onClick={() => this.toggleAnim('delete-box')} className="fill btn green waves-effect" id="cancel">{this.props.text.cancel}</button>
                  </div>
                  <div className="col s6">
                    <button onClick={this.props.deleteMe} className="fill btn red waves-effect" id="confirm">{this.props.text.delete.confirm}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <a href="#!" onClick={this.cleanUp} className="modal-close btn-flat">{this.props.close}</a>
      </div>
    </div>
  );
}
