import React, { Component } from "react";
import '../css/modal.css';

//Definindo interface para os props que a classe vai receber.
interface props {
    'data-name'?: string;
    user_id: number;
    show: boolean;
    onClose: Function,
}

// Definindo interface para o Payload que vai ser passado no POST para a API
interface TransactionPayload {
    // Card Info
    card_number: string;
    cvv: number;
    expiry_date: string;

    // Destination User ID
    destination_user_id: number;

    // Value of the Transaction
    value: number;
}

//cartões para exibir como pagamento.
let cards = [
    // valid card
    {
        card_number: '1111111111111111',
        cvv: 789,
        expiry_date: '01/18',
    },
    // invalid card
    {
        card_number: '4111111111111234',
        cvv: 123,
        expiry_date: '01/20',
    },
];

//API para fazer a requisição passando as informações de pagamento.
const api = `https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989`;

//Criando classe do componente Modal.
class Modal extends Component<props>{

    //Definindo state com card_index -1, pois será usado em um objeto Array onde o número 0, por padrão, pode criar conflitos
    state = {
        card_index: -1,
    }

    //Função para formatar o input do usuário para moeda, mesma função utilizada no projeto solo de HTML, CSS e JavaScript.
    formatCurrency(e: any) {
        const letterPattern = /[^0-9]/;
        if (letterPattern.test(e.key)) {
            //console.log(e.key)
            e.preventDefault();
            return;
        }
        if (!e.currentTarget.value) return;

        let valor = e.currentTarget.value.toString();
        valor = valor.replace(/[\D]+/g, '');
        valor = valor.replace(/([0-9]{1})$/g, ",$1");

        if (valor.length >= 6) {
            while (/([0-9]{4})[,|.]/g.test(valor)) {
                valor = valor.replace(/([0-9]{1})$/g, ",$1");
                valor = valor.replace(/([0-9]{3})[,|.]/g, ".$1");
            }
        }

        e.currentTarget.value = valor;
    }

    //Função para requisitar a API passando as informações de pagamento do Usuário.
    payUser(id: number, valueToPay: number, card_index: number) {
        //console.log(id, valueToPay, cards[card_index]);

        //Pegando o titulo do Modal e definindo como um elemento paragrafo de HTML (condutas do typescript)
        let headerTitle = document.getElementById("headerTitle") as HTMLParagraphElement

        //Criando um objeto com base na interface de Payload
        let payload: TransactionPayload = {
            card_number: cards[card_index].card_number,
            cvv: cards[card_index].cvv,
            expiry_date: cards[card_index].expiry_date,
            destination_user_id: id,
            value: valueToPay
        }

        //Criando requisição para a API e passando o objeto definido anteriormente como corpo da requisição.
        fetch(api, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        }).then((response) => {
            return response.json();
        }).then((data) => {
            //O titulo do modal é definido aqui para evitar que o titulo do Modal mude antes do retorno da requisição.
            headerTitle.textContent = "Recibo de pagamento";
            //Verificando de o pagamento foi efetuado com sucesso.
            if (data.success) {
                //Definindo texto se ocorreu tudo certo.
                document.getElementsByClassName("modalBody")[0].innerHTML = '<p class="paymentStatus">O pagamento foi concluido com sucesso.</p>';
            } else {
                //Definindo texto de algo deu errado
                document.getElementsByClassName("modalBody")[0].innerHTML = '<p class="paymentStatus">O pagamento <strong>não</strong> foi concluido com sucesso.</p>';
            }
        }).catch((err) => {
            //Definindo texto e titulo do modal se houver algum erro.
            headerTitle.textContent = "Recibo de pagamento";
            document.getElementsByClassName("modalBody")[0].innerHTML = '<p class="paymentStatus">O pagamento <strong>não</strong> foi concluido com sucesso.</p>';
        });
    }

    createModal() {
        //Verificando se é para mostrar o Modal, por default é false;
        if (!this.props.show) {
            return null;
        }

        //console.log(this.state.card_index)

        //Retornando Modal case o show seja definido para True;
        return (
            //Definindo div modal e função para fechar o modal quando clicar fora, ressaltas para a função no onclick que chama função definiado no componente Lista.tsx e altera o State do componente Lista.tsx
            <div className="modal" onClick={() => { this.props.onClose() }}>
                {/* Criando header do Modal e definindo a função stopPropagation no click para evitar que os filhos herdem função de cliques do pai. */}
                <div className="modalHeader" onClick={e => e.stopPropagation()}>
                    {/* Definindo titulo do Header utilizando os props passado pelo componente Lista.tsx*/}
                    <p id="headerTitle">Pagamento para <span className="username">{this.props["data-name"]}</span></p>
                    {/* Criando botão para fechar o  modal, utilzando a função definida para mudar o state do component Lista.tsx*/}
                    <button className="closeBtn" onClick={() => { this.props.onClose() }}>Fechar</button>
                </div>
                {/* Criando corpo do Modal e definindo a função stopPropagation no click para evitar que os filhos herdem função de cliques do pai. */}
                <div className="modalBody" onClick={e => e.stopPropagation()}>
                    {/* Criando input definindo placeholder e evento onKeyPress para formatar o input do usuário conforme ele digita. */}
                    <input placeholder="R$ 0,00" type="text" onKeyPress={(event) => { this.formatCurrency(event) }} />
                    {/* Criando menu de seleção dos cartões. */}
                    <select name="creditCards" id="creditCards">
                        {
                            //Utiliznado o objeto cards para definir as options do select.
                            cards.map((card, index) => {
                                return (
                                    //Definindo um parametro "data-key" com o index do objeto e criando texto com os 4 números finais do cartão.
                                    <option data-key={index} key={index} value={card.card_number}>{`Cartão com final ${card.card_number.slice(card.card_number.length - 4)}`}</option>
                                )
                            })
                        }
                    </select>
                    <button onClick={() => {
                        //Botão de pagar usuário
                        //filtrando apenas os números do input.
                        let valueToPay = document.getElementsByTagName('input')[0].value.replace(/[^0-9]/g, "");
                        //console.log(Number(valueToPay.substring(0, valueToPay.length-2) + "." + valueToPay.substring(valueToPay.length-2)))
                        let finalValue;
                        //Verificando se existe mais que 1 digito no número, para evitar que pague centavos em vez de unidades de reais.
                        if (valueToPay.length > 1) {
                            //se for maior que um, adicione "." antes dos dois ultimos números para definir os centavos
                            finalValue = Number(valueToPay.substring(0, valueToPay.length - 2) + "." + valueToPay.substring(valueToPay.length - 2));
                        } else {
                            //Se não, pague apenas as unidades de reais;
                            finalValue = Number(valueToPay);
                        }
                        //Pegando o elemento select como um HTMLSelectElement (conduta do typescript)
                        let selectElement = document.getElementById("creditCards") as HTMLSelectElement;
                        //Pegando qual elemento que está selecionado no menu select e então pegando seu atributo "data-key" que contém o index do cartão selecionado na opção.
                        let card_index = Number(selectElement.options[selectElement.selectedIndex].getAttribute("data-key"));
                        if (finalValue) {
                            //Se houver algum número no input, chama a função de pagamento.
                            this.payUser(this.props.user_id, finalValue, card_index)
                        } else {
                            //Se não, foca no campo do input.
                            document.getElementsByTagName('input')[0].focus();
                        }
                    }}>Pagar</button>
                </div>
            </div>
        )
    }

    render() {
        return (
            this.createModal()
        )
    }
}

export default Modal;