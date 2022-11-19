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

export default User;