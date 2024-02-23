import React from 'react';
import { auth } from '../firebase';



function ChatBubble(props){

    const { uid, message, pic } = props.message;

    const messageCheck = uid === auth.currentUser.uid ? 's' : 'r'
    console.log(messageCheck)

    return(
        <div className={`chatMessage ${messageCheck}`}>
            <img src={pic} alt = ""/>
            <p>{message}</p>
        </div>
    )

}

export default ChatBubble;