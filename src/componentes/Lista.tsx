import React, { Component } from 'react';
import '../css/lista.css';

const api = `https://www.mocky.io/v2/5d531c4f2e0000620081ddce`;

interface User {
    id: string;
    name: string;
    img: string;
    username: string;
}

class Lista extends Component {

    state = {
        users: []
    }

    componentDidMount = async () => {
        const response = await fetch(api);
        const obj: User = await response.json();

        this.setState({ users: obj });
    }

    gerarLi() {
        return this.state.users.map((user: User, index) => {
            console.log(user.name)
            return (
                <li className="user" key={user.id} id={user.id}>
                    <img className="userAvatar" src={user.img} alt="" />
                    <div className="userInfo">
                        <div>
                            <p className="username">{user.name}</p>
                            <p className="userID">ID: {user.id} - Username: {user.username}</p>
                        </div>
                        <div className="payButton">
                            <button>Pagar</button>
                        </div>
                    </div>
                </li>
            )
        });
    }

    render() {
        return (
            <ul>
                {this.gerarLi()}
            </ul>
        )
    }
}

export default Lista;