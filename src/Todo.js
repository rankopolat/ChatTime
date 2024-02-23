import "./App.css";
import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit} from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth} from './firebase'; // Import the initialized Firebase app
import {GoogleAuthProvider, signInWithPopup } from "firebase/auth";


function SignIn(){

    const signInWithGoogle = () => {
        const prov = new GoogleAuthProvider();
        signInWithPopup(auth, prov);

    }

    return (
    
        <div className ="signInDiv">
          <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
          <p>Press this to sign In if you dare</p>
        </div>
      )

}


function SignOut() {
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}



function ChatApp(){
    
    const containerRef = useRef();

    const [msg, setMsg] = useState("");
    const [messages, setMessageArray] = useState([]);
    const { uid, photoURL } = auth.currentUser;


    useEffect(() => {

        const fetchMessages = async () => {
            try {
    
                const q = query(collection(db, 'messages'), orderBy('timeStamp','desc'),limit(20));
                const unsub = onSnapshot(q, (querySnapshot) => {
    
                const fetchedTodos = [];
                querySnapshot.forEach((doc) => {
                    fetchedTodos.push({ id: doc.id, ...doc.data() });
                });
    
                setMessageArray(fetchedTodos.reverse());
               
            });

            return() => unsub();
    
            } catch (error) {
                console.error("Error fetching todos: ", error);
            }
        };

        fetchMessages();


    },[])


    const createMessage = async (e) => {
        e.preventDefault();
        
        try {
            const docRef = await addDoc(collection(db, "messages"), {
                message: msg, 
                timeStamp: serverTimestamp(),
                uid: uid,
                pic: photoURL
            });

            setMessageArray([...messages, { id: docRef.id, message: msg }]);
            setMsg(""); // Clear input field after adding msg
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (<>

        <div class = "textWrapper">

            <main class = "chatArea">
                
                {messages.map( object => 
                    <ChatBubble key={object.id} message = {object} />
                )}

                <span ref = {containerRef}></span>
            
            </main>
            
        
            <div class = "messageButton">
                <form onSubmit={createMessage} class= "messageForm">
                    <input id = "inputArea" type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Add Todo"/>
                    

                </form>
            </div>
        </div>
    
    </>
    );
}

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



function App(){

    const [user] = useAuthState(auth);

    return (
        <div className="App">
            <SignOut/>
          <section>
            {user ? <ChatApp /> : <SignIn />}
          </section>
    
        </div>
      );
    }


export default App;