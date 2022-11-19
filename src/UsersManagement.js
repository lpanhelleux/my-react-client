import React from 'react';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.id = props.id;
        this.state = {
            style : {},
            removed: false,
            modifyOn : false,
            name: props.name
         };
    }

    mouseOver () {
        var style = {color : "red", fontStyle : "italic" };
        this.setState({ style : style})
    }

    mouseOut () {
        var style = {color : "", fontStyle : "" };
        this.setState({ style : style})
    }

    handlerDeleteUser() {
        this.props.app.deleteUser(this);
    }

    modifyUser() {
        this.setState({modifyOn : true });
    }

    handlerChange(event) {
        this.setState({name: event.target.value})
    }

    handlerKeyDownCapture(event) {
        if (event.keyCode === 13) {
            this.setState({modifyOn: false});
            this.props.app.modifyUser(this, event.target.value);
        }
    }

    render() {
        return (
            this.state.removed ? null :
            <li style={this.state.style}
                onMouseOver={this.mouseOver.bind(this)}
                onMouseOut={this.mouseOut.bind(this)}
                onDoubleClick={this.modifyUser.bind(this)}>
                { this.state.modifyOn === true
                    ? <input type="text" value={this.state.name}
                        onChange={this.handlerChange.bind(this)}
                        onKeyDownCapture={this.handlerKeyDownCapture.bind(this)}/>
                    : <span style={{margin: "2px"}}>{this.state.name}</span>
                }
                <button style={{margin:"4px", fontSize:"10px"}} onClick={this.handlerDeleteUser.bind(this)}>
                    Delete
                </button>
            </li>
        )
    }
}

class UsersList extends React.Component {
    render() {
        return (
            <ul>
            {
                this.props.users.map((user, index) => {
                    var { id, name } = user;
                    return <User key={id} id={id} name={name} app={this.props.app} />
                })
            }
            </ul>
        )
    }
}

class UsersManagement extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        users: [],
        userName: '',
      };

      this.handleClick = this.handleClick.bind(this);
    }

    getUsers() {
        fetch("https://localhost:7196/users")
        .then(res => res.json())
        .then(
            result => {
                this.setState({
                    isLoaded: true,
                    users: result.value
                });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            error => {
                this.setState({
                isLoaded: true,
                error
                });
            }
        )
    }

    insertUser(id, name) {
        var users = this.state.users;
        var user = { name : name, id : id};
        users.push(user);
        this.setState({ users : users});
    }

    removeUser (userToRemove) {
        var users = this.state.users;        
        users = users.filter(function(user) {
            return userToRemove.id !== user.id;
        });
        this.setState({ users : users });
    }

    updateUser (userToModify, newName) {
        var users = this.state.users;
        users = users.map(function(user) {
            if (userToModify.id === user.id) user.name = newName;
            return user;
        });
        this.setState({ users : users, userName: '' });
    }

    modifyUser(userToModify, newName) {
        const data = { id: userToModify.id, name: newName };
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch('https://localhost:7196/users/'+ userToModify.id, requestOptions)
            .then(                
                result => {
                    this.updateUser(userToModify, newName);                    
                },
                error => {
                    this.setState({
                    error
                    });
                }
            )
        }

    deleteUser(userToRemove) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('https://localhost:7196/users/'+ userToRemove.id, requestOptions)
            .then(                
                result => {
                    if (result.status === 200) {
                        this.removeUser(userToRemove);
                    }
                    else {
                        var error = {message : result.status}
                        this.setState({
                            error
                        });
                    }
                },
                error => {
                    this.setState({
                    error
                    });
                }
            )
    }

    addUser() {
        const data = { name: this.state.userName };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch('https://localhost:7196/users', requestOptions)
            .then(res => res.json())
            .then(                
                result => {
                    this.insertUser(result.id, result.name);
                },
                error => {
                    this.setState({
                    error
                    });
                }
            )
    }
  
    componentDidMount() {
        this.getUsers();
    }
  
    handleChange = event => {
        this.setState({
            userName: event.target.value
        });
    }

    handleClick() {
        this.addUser();        
    }

    handleRefreshButtonClick() {
        this.getUsers();
    }

    render() {
      const { error, isLoaded, users, userName} = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
            <div>
                <div>
                    <h1>Add a new user</h1>
                    <input type="text" onChange={this.handleChange} value={userName} />
                    <button style={{margin: "4px"}} onClick={this.handleClick} >Add</button>
                </div>
                <div>
                    <h1>List  of users</h1>
                    <button onClick={this.handleRefreshButtonClick.bind(this)}>Refresh</button>
                    <UsersList users={users} app={this} />
                </div>
            </div>
        );
      }
    }
  }

  export default UsersManagement;