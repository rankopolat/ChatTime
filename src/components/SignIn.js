import React from 'react';
import {GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase';



function SignIn(){

    const signInWithGoogle = () => {
        const prov = new GoogleAuthProvider();
        signInWithPopup(auth, prov);

    }

    return (
    
        <div className ="signInDivWrapper">
          <div className ="signInDiv">
            <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
            <p>Press this to sign In if you dare</p>
          </div>
        </div>
      )

}

export default SignIn;