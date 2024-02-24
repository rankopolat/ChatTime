import React from 'react';
import { auth } from '../firebase';
import logout from '../images/logout.png';


function SignOut() {
    return auth.currentUser && (
        <div className = "signOutWrapper">
            <p>logout</p>
            <img src = {logout} className='sign-out' onClick={() => auth.signOut()}/>
        </div>
    )
}

export default SignOut;