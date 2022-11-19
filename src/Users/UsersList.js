import React from 'react';
import User from './User';

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

export default UsersList;