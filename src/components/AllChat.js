import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit} from "firebase/firestore";
import { db, auth } from '../firebase';
import ChatBubble from "./ChatBubble"


function AllChat(){
    
    const containerRef = useRef(); //To enable scroll when a message has been added

    const [msg, setMsg] = useState(""); //Current Message
    const [messages, setMessageArray] = useState([]); //Array of fetched messages
    const { uid, photoURL } = auth.currentUser; //Grab current logged in users info


    useEffect(() => {

        const fetchMessages = async () => {
            try {
    
                const q = query(collection(db, "messages"), orderBy('timeStamp','desc'),limit(30));
                
                const unsub = onSnapshot(q, (querySnapshot) => {
                    const fetchedTodos = [];
                    querySnapshot.forEach((doc) => {
                        fetchedTodos.push({ id: doc.id, ...doc.data() });
                });
    
                setMessageArray(fetchedTodos.reverse()); //Setting the array to the Fetched snapShot
               
               
            });

            return() => unsub();
    
            } catch (error) {
                console.error("Error fetching Messages: ", error);
            }
        };

        fetchMessages();


    },[])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const createMessage = async (e) => {

        e.preventDefault(); //Disable auto refresh when message is created
        
        try { //Insert message into firestore document
            await addDoc(collection(db, messages), {
                message: msg, 
                timeStamp: serverTimestamp(),
                uid: uid,
                pic: photoURL
            });

            setMsg(""); // Clear input field after adding msg
        
            
        } catch (error) {
            console.error("Error adding message into document: ", error);
        }
    };

    return (
    <>
            <div className='chatWrapper'>

                <div className='chatNavBar'>
                    
                </div>
                <div class = "chatArea" ref = {containerRef}>
                    {messages.map( object => 
                        <ChatBubble key={object.id} message = {object} />
                    )}

                </div>
                
                <div class = "messageButton">

                    <form onSubmit={createMessage} class= "messageForm">

                        <input id = "inputArea" type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Lets chat!"/>
                        <button class="input-button">Send</button>
                        
                    </form>

                </div>

            </div>
    
    </>
    );
}

export default AllChat;