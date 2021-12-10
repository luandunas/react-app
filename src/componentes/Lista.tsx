import { Component } from 'react';
import '../css/lista.css';
import {createModal} from './Modal';

const api = `https://www.mocky.io/v2/5d531c4f2e0000620081ddce`;

interface User {
    id: string;
    name: string;
    img: string;
    username: string;
}


class Lista extends Component<User>{

    state = {
        users: [],
    }

    componentDidMount = async () => {
        const response = await fetch(api);
        const obj: User = await response.json();

        this.setState({users: obj});
    }


    createLi() {
        return this.state.users.map((user: User, index) => {
            console.log(user.name)
            return (
                <li className="user" key={user.id} id={user.id} data-name={user.name}>
                    <img className="userAvatar" src={user.img} alt="" />
                    <div className="userInfo">
                        <div>
                            <p className="username">{user.name}</p>
                            <p className="userID">ID: {user.id} - Username: {user.username}</p>
                        </div>
                        <div className="payButton">
                        <button onClick={() => {createModal(user.name)}}>Pagar</button>
                        </div>
                    </div>
                </li>
            )
        });
    }

    render() {
        return (
            <ul>
                {this.createLi()}
            </ul>
        )
    }
}


export default Lista;