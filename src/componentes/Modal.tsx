import React, { Component } from "react";

interface nameProps{
    'data-name': string;
}

export const createModal = (text: string)=>{
    console.log(text);
    return <h1>{text}</h1>
}

class Modal extends Component<nameProps>{

    state = {
        userName: "",
    }

    render(){
        return (
            createModal(this.props["data-name"])
        )
    }
}

export default Modal;