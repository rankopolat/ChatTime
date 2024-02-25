import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit} from "firebase/firestore";
import { db, auth } from '../firebase';
import ChatBubble from "./ChatBubble"
import SignOut from './SignOut';
import all from '../images/all.png';
import send from '../images/send.png';


function toggleHover(selected){

    console.log(selected);
    var divs = document.querySelectorAll(".ChatDiv");

    divs.forEach(function(div) {
        div.style.backgroundColor = "";
    });

    selected.style.backgroundColor = "grey";
}

function ChatApp() {

    const containerRef = useRef(); // To enable scroll when a message has been added

    const [msg, setMsg] = useState(""); // Current Message
    const [messages, setMessageArray] = useState([]); // Array of fetched messages

    const [database, setDatabase] = useState(""); // Database name state default "messages"
    const { uid, photoURL } = auth.currentUser; // Grab current logged-in user's info

    useEffect(() => {

        const fetchMessages = async () => {
            try {
                const q = query(collection(db, database), orderBy('timeStamp', 'desc'), limit(30));
                const unsub = onSnapshot(q, (querySnapshot) => {
                    const fetchedTodos = [];
                    querySnapshot.forEach((doc) => {
                        fetchedTodos.push({ id: doc.id, ...doc.data() });
                    });
                    setMessageArray(fetchedTodos.reverse()); // Set the array to the Fetched snapshot
                });
                return () => unsub();
            } catch (error) {
                console.error("Error fetching Messages: ", error);
            }
        };

        fetchMessages();
    }, [database]); // Trigger useEffect whenever database changes

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const createMessage = async (e) => {
        e.preventDefault(); // Disable auto refresh when message is created
        try {
            // Insert message into Firestore document
            await addDoc(collection(db, database), {
                message: msg,
                timeStamp: serverTimestamp(),
                uid: uid,
                pic: photoURL
            });
            setMsg(""); // Clear input field after adding message
        } catch (error) {
            console.error("Error adding message into document: ", error);
        }
    };

    return (

        <div className="textWrapper">
            <div className="sideNav">
                <div className="buttonWrapper">
                    <SignOut />
                </div>
                <div className='chatRoomsWrapper'>
                    <div className='ChatDiv' onClick={(e) => {setDatabase("messages"); toggleHover(e.currentTarget);}}>
                        <img src={all} alt="All Chat" />
                        <p>All Chat</p>
                    </div>
                    <div className='ChatDiv' onClick={(e) => {setDatabase("animals"); toggleHover(e.currentTarget);}}>
                        <img src={all} alt="Animals Chat" />
                        <p>Animals Chat</p>
                    </div>
                    <div className='ChatDiv' onClick={(e) => {setDatabase("games"); toggleHover(e.currentTarget);}}>
                        <img src={all} alt="Games Chat" />
                        <p>Games Chat</p>
                    </div>
                    <div className='ChatDiv' onClick={(e) => {setDatabase("sports"); toggleHover(e.currentTarget);}}>
                        <img src={all} alt="Sports Chat" />
                        <p>Sports Chat</p>
                    </div>
                </div>
            </div>

            <section className='chatWrapper'>

                {database === "" ?  

                    <div className='unselectedChat'>
                        <p>Please Select A Chat Group</p>
                    </div> 
                    
                    : 

                    <div className='chatWrapper'>                                  
                            <div className='chatNavBarWrapper'>
                                <p>Taijis Chat Rooms</p>
                            </div>
                            <div className="chatArea" ref={containerRef}>
                                {messages.map(object =>
                                    <ChatBubble message={object} />)}
                            </div>
                            <div className="messageButton">
                                <form onSubmit={createMessage} className="messageForm">
                                    <input id="inputArea" type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Let's chat!" />
                                    <input src={send} type="image" className='input-button' alt="Send"/>
                                </form>
                            </div>        
                    </div>
                }

            </section>
                

        </div>

    );
}

export default ChatApp;
