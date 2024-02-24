import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit} from "firebase/firestore";
import { db, auth } from '../firebase';
import ChatBubble from "./ChatBubble"
import SignOut from './SignOut';
import all from '../images/all.png';

function ChatApp() {

    const containerRef = useRef(); // To enable scroll when a message has been added

    const [msg, setMsg] = useState(""); // Current Message
    const [messages, setMessageArray] = useState([]); // Array of fetched messages

    const [database, setDatabase] = useState("messages"); // Database name state default "messages"
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
                    <div className='allChatDiv' onClick={() => setDatabase("messages")}>
                        <img src={all} alt="All Chat" />
                        <p>All Chat</p>
                    </div>
                    <div className='animalsChatDiv' onClick={() => setDatabase("animals")}>
                        <img src={all} alt="Animals Chat" />
                        <p>Animals Chat</p>
                    </div>
                    <div className='gamesChatDiv' onClick={() => setDatabase("games")}>
                        <img src={all} alt="Games Chat" />
                        <p>Games Chat</p>
                    </div>
                    <div className='sportsChatDiv' onClick={() => setDatabase("sports")}>
                        <img src={all} alt="Sports Chat" />
                        <p>Sports Chat</p>
                    </div>
                </div>
            </div>
            <div className='chatWrapper'>
                <div className='chatNavBar'></div>
                <div className="chatArea" ref={containerRef}>
                    {messages.map(object =>
                        <ChatBubble message={object} />
                    )}
                </div>
                <div className="messageButton">
                    <form onSubmit={createMessage} className="messageForm">
                        <input id="inputArea" type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Let's chat!" />
                        <button className="input-button">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatApp;
