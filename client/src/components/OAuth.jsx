import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'


function OAuth() {

    const auth = getAuth(app)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleGoogleCheck = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL
                })
            })

            const data = await res.json()
            console.log(data);

            if(res.ok)
            {
                dispatch(signInSuccess(data))
                navigate('/')
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline
            onClick={handleGoogleCheck}>
            <AiFillGoogleCircle className='w-6 h-6 p-3 mr-2' />
            Continue with google
        </Button>
    )
}

export default OAuth