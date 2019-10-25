import React from 'react';
import M from 'materialize-css/dist/js/materialize.min';


export default class extends React.Component {
  get DEFAULT_STATE() {
    return {
      loaded: false,
      users: [],
      page: 1,
      max_pages: 0,
      users_per_page: 10,
      paginator: null,
    }
  }
  state = this.DEFAULT_STATE;

  componentDidUpdate = (prevProps) => {
    if (this.state.loaded === true) M.Collapsible.init(document.querySelector('#userlist .collapsible'));
    if (JSON.stringify(this.props.users) !== JSON.stringify(prevProps.users)) {
      const links = [];
      let users_total = this.props.users.length;
      let page = 1;
      while (users_total > 0) {
        const val = page;
        const link = 
          <li id={'page' + val} key={page} className={val === 1 ? 'active teal lighten-2' : 'waves-effect'}>
            <a onClick={() => this.turnPage(val)} href="#!">{page++}</a>
          </li>;
        links.push(link);
        users_total -= this.state.users_per_page;
      }
      this.setState({
        users: this.props.users.sort((a, b) => new Date(a.registration_date) > new Date(b.registration_date)),
        loaded: true,
        max_pages: links.length,
        paginator: links.length < 2 ? null :
          <ul className="pagination center">
            <li id="page_prev" className="disabled">
              <a href="#!" onClick={() => this.turnPage(this.state.page -1)}>
                <i className="material-icons">chevron_left</i>
              </a>
            </li>
            {links}
            <li id="page_next" className={links.length === 1 ? 'disabled' : 'waves-effect'}>
              <a href="#!" onClick={() => this.turnPage(this.state.page + 1)}>
                <i className="material-icons">chevron_right</i>
              </a>
            </li>
          </ul>
      })
    }
  }

  closeAllCollapsibles = () => {
    const collapsibles = M.Collapsible.getInstance(document.querySelector('#userlist .collapsible'));
    for (let i = 0; i < document.querySelectorAll('#userlist .collapsible li').length; i++) {
      collapsibles.close(i);
    }
  }

  turnPage = page => {
    if (page < 1 || page > this.state.max_pages || page === this.state.page) return;
    this.closeAllCollapsibles();
    const paginator = document.querySelector('.pagination');
    const links = paginator.getElementsByTagName('li');
    for (const link of links) {
      const id = link.getAttribute('id');
      if (id === 'page' + page) link.className = 'active teal lighten-2';
      else link.className = 'waves-effect';
    }
    if (page === 1) document.getElementById('page_prev').className = "disabled";
    if (page === this.state.max_pages) document.getElementById('page_next').className = "disabled";
    this.setState({
      page: page,
    })
  }

  close = () => {
    M.Modal.getInstance(document.getElementById('userlist')).close();
    this.props.clearUserList();
    this.setState(this.DEFAULT_STATE);
  }

  deleteUser = (id) => {
    this.props.deleteUser(id);
    this.closeAllCollapsibles();
    this.setState(state => ({
      ...state,
      users: state.users.filter(user => user.id !== id),
    }))
  }

  render = () => {
    const users_total = this.state.users.length;
    const list = users_total > 0 ? 
    this.state.users
    .slice((this.state.page-1)*this.state.users_per_page, (this.state.page)*this.state.users_per_page)
    .map((user, i) => (
      <li key={i}>
        <div className="collapsible-header teal lighten-4 row">
          <div className="col s1">
            {(this.state.page-1)*this.state.users_per_page + i+1}.
          </div>
          <div className="col s7">
            {user.username}
          </div>
          <div className="col s4">
            {user.id}
          </div>
        </div>
        <div className="collapsible-body teal lighten-5">
          <table className="highlighted">
            <tbody>
              <tr>
                <td>{this.props.text.user.role}:</td>
                <td>{user.role_id === 1 ? 'ADMIN' : 'USER'}</td>
              </tr>
              <tr>
                <td>{this.props.text.user.email}:</td>
                <td>{user.email}</td>
              </tr>
              <tr style={{border: 'none'}}>
                <td>{this.props.text.user.registered}:</td>
                <td>{user.registration_date}</td>
                <td>
                  <button id="delete_user" className="btn waves-effect red fill" onClick={() => this.deleteUser(user.id)}>
                    {this.props.text.user.delete}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </li>
    )) : <span>No users to display. What are you doing here?</span>;
    const content = this.state.loaded ?
    <div className="modal-content">
      <div className="red-text center">{this.props.message}</div>
      <h4 className="center">{this.props.text.header}:</h4>
      <ul className="collapsible popout">
        <div className="list-header row teal lighten-3 z-depth-1">
          <div className="col s1">
            {this.props.text.table.no}.
          </div>
          <div className="col s7">
            {this.props.text.table.username}
          </div>
          <div className="col s4">
            ID
          </div>
        </div>
        {list}
      </ul>
      {this.state.paginator}
    </div>
    : 
    <div className="modal-content">
      <span className="red-text">{this.props.message}</span>
      <h4 className="center">{this.props.text.loading}...</h4>
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    </div>;
    return (
      <div id="userlist" className="modal modal-fixed-footer collapsible-list">
        {content}
        <div className="modal-footer">
          <a href="#!" className="btn-flat" onClick={this.close}>{this.props.text.close}</a>
        </div>
      </div>
    )
  }
}
