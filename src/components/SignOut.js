import React from 'react';
import { auth } from '../firebase';
import logout from '../images/logout.png';


function SignOut() {
    return auth.currentUser && (
        <div className = "signOutWrapper" onClick={() => auth.signOut()}>
            <p>logout</p>
            <img src = {logout} alt ="" className='sign-out' />
        </div>
    )
}

export default SignOut;