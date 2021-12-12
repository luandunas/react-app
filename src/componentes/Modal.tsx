import React, { Component } from "react";
import '../css/modal.css';

//Definindo interface para os props que a classe vai receber.
interface props {
    'data-name'?: string;
    user_id: number;
    show: boolean;
    onClose: Function,
}

// Payload:

// interface TransactionPayload {
//     // Card Info
//     card_number: string;
//     cvv: number;
//     expiry_date: string;
  
//     // Destination User ID
//     destination_user_id: number;
  
//     // Value of the Transaction
//     value: number;
//   }

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

//Criando classe do componente Modal.
class Modal extends Component<props>{

    state = {
        card_index: -1,
    }

    formatCurrency(e: any){
        const letterPattern = /[^0-9]/;
                        if(letterPattern.test(e.key)){
                            //console.log(e.key)
                            e.preventDefault();
                            return;
                        }
                        if(!e.currentTarget.value) return;
                    
                        let valor = e.currentTarget.value.toString();
                        valor = valor.replace(/[\D]+/g, '');
                        valor = valor.replace(/([0-9]{1})$/g, ",$1");
                    
                        if(valor.length >= 6){
                            while(/([0-9]{4})[,|.]/g.test(valor)){
                                valor = valor.replace(/([0-9]{1})$/g, ",$1");
                                valor = valor.replace(/([0-9]{3})[,|.]/g, ".$1");
                            }
                        }
                    
                        e.currentTarget.value = valor;
    }

    payUser(id: number, valueToPay: number, card_index: number){
        console.log(id, valueToPay, cards[card_index]);

        document.getElementsByClassName("modalBody")[0].innerHTML = "<h1>Pagamento Efetuado com sucesso!</h1>"
    }

    createModal() {
        if (!this.props.show) {
            return null;
        }

        //console.log(this.state.card_index)

        return (
            <div className="modal">
                <div className="modalHeader">
                    <p>Pagamento para <span className="username">{this.props["data-name"]}</span></p>
                    <button className="closeBtn" onClick={() => { this.props.onClose() }}>Fechar</button>
                </div>

                <div className="modalBody">
                    <input type="text" onKeyPress={(event) => {this.formatCurrency(event)}} />
                    <select name="creditCards" id="creditCards">
                        {
                            cards.map((card, index) => {
                                return (
                                    <option data-key={index} key={index} value={card.card_number}>{`Cartão com final ${card.card_number.slice(card.card_number.length - 4)}`}</option>
                                )
                            })
                        }
                    </select>
                    <button onClick={() =>{
                        let valueToPay = document.getElementsByTagName('input')[0].value.replace(/[^0-9]/g, "");
                        //console.log(Number(valueToPay.substring(0, valueToPay.length-2) + "." + valueToPay.substring(valueToPay.length-2)))
                        let finalValue = Number(valueToPay.substring(0, valueToPay.length-2) + "." + valueToPay.substring(valueToPay.length-2));
                        let selectElement = document.getElementById("creditCards") as HTMLSelectElement;
                        let card_index = Number(selectElement.options[selectElement.selectedIndex].getAttribute("data-key"));
                        this.payUser(this.props.user_id, finalValue, card_index)
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