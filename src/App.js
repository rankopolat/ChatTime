import "./App.css";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase'; // Import the initialized Firebase app
import SignIn from "./components/SignIn";
import ChatApp from "./components/ChatApp";


function App(){

    const [user] = useAuthState(auth);

    return (
        <div className="App">

          <section>
            {user ? <ChatApp /> : <SignIn />}
          </section>
    
        </div>
      );
    }


export default App;