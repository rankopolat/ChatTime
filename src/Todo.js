import "./App.css";
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from './firebase'; // Import the initialized Firebase app

function Todo(){
    
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);

    const addTodo = async (e) => {
        e.preventDefault();
        
        try {
            const docRef = await addDoc(collection(db, "todos"), {
                message: todo, timeStamp: serverTimestamp()
            });

            setTodos([...todos, { id: docRef.id, todo: todo }]);
            setTodo(""); // Clear input field after adding todo
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    async function fetchTodos(){
        try {

            const q = query(collection(db, 'todos'), orderBy('timeStamp'));
            const querySnapshot = await getDocs(q);

            const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id }));

            setTodos(newData);
        } catch (error) {
            console.error("Error fetching todos: ", error);
        }
    }

    useEffect(() => {
        fetchTodos();
    }, []); 


    return (
        <div class = "textWrapper">
            <form onSubmit={addTodo}>
                <input
                    type="text"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    placeholder="Add Todo"
                />
                <button type="submit">Add</button>
            </form>
            <div>
                {todos.map((message) => (
                    <p key={message.id}>{message.message}</p>
                ))}
            </div>
        </div>
    );
}

export default Todo;