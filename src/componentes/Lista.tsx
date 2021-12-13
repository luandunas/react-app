import { Component } from 'react';
import '../css/lista.css';
import Modal from './Modal';

//Link da API para fazer o GET dos usuários
const api = `https://www.mocky.io/v2/5d531c4f2e0000620081ddce`;

//Modelo de interface que a API vai retornar.
interface User {
    id: string;
    name: string;
    img: string;
    username: string;
}

//Componente lista para gerar a lista com os usuários
class Lista extends Component<User>{

     //state para fazer a funcionalidade do modal e da lista.
    state = {
        //item para armazenar os usuários que serão retornados da API para então usar funcionalidade de array.
        users: [],
        //item para definir se o modal está visivel ou não
        show: false,
        //item para definir o nome do usuário que será pago.
        modalUsername: "",

        user_id: 0,
    }

    //Requisitar API quando a página terminar de carregar.
    componentDidMount = async () => {
        //armazenado a resposta da requisição na API.
        const response = await fetch(api);
        //definido a interface que deve conter nos dados retornado pela API.
        const obj: User = await response.json();
        //Definindo o item "users" do state para o objeto retornado pela API;
        this.setState({ users: obj });
    }

    //Função para criar a Lista
    createLi() {
        //Criando um map no item users do State, passando a interface como modelo.
        return this.state.users.map((user: User, index) => {
            //console.log(user.name)
            return (
                //Criando li para cada usuário, contendo parametro "key", "id" e um parametro customizado "data-name"
                <li className="user" key={user.id} id={user.id} data-name={user.name}>
                    {/* Imagem do usuário */}
                    <img className="userAvatar" src={user.img} alt="" />
                    {/* Informações do Usuário */}
                    <div className="userInfo">
                        <div>
                            <p className="username">{user.name}</p>
                            <p className="userID">ID: {user.id} - Username: {user.username}</p>
                        </div>
                        {/* Botão de pagamento */}
                        <div className="payButton">
                            <button onClick={() => {
                                // Definindo visibilidade do modal e informações do usuário no objeto state.
                                this.setState({ show: true, modalUsername: user.name, user_id: user.id })
                            }}>Pagar</button>
                        </div>
                    </div>
                </li>
            )
        });
    }

    render() {
        return (
            <div>
                {/* Chamando o Modal passando props para a estrutura dele. Ressalta para o props "onClose" que passa uma função para alterar o state DESTE componente em outro componente*/}
                <Modal user_id={this.state.user_id} data-name={this.state.modalUsername} show={this.state.show} onClose={() => {this.setState({show: false})}}></Modal>
                <ul>
                    {/* Chamando função para criar as li. */}
                    {this.createLi()}
                </ul>
            </div>
        )
    }
}


export default Lista;