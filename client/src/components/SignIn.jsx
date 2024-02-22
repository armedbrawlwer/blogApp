import { Alert, Button, Label, TextInput, Spinner } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'
import OAuth from './OAuth'


function SignIn() {

  const [formData, setFormData] = useState({})
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    console.log(formData)
  }


  // const [errormessage, seterrormessage] = useState(null)
  const { loading, error: errorMessage } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("fill out all fields"))
    }
    try {
      // setloading(true)
      // seterrormessage(null)

      //with use of redux
      dispatch(signInStart())

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      // setloading(false)
      if (data.success == false) {
        dispatch(signInFailure(data.message))
      }

      // setloading(false)
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate('/home')
      }

    }
    catch (e) {
      console.log(e)
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        {/* leftside */}
        <div className='flex-1'>
          <Link to='/' className=' text-4xl  font-semibold' >
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
         via-purple-500 to-pink-400 rounded-lg text-white '>Abhishek</span>
            Blog
          </Link>
          <p className='text-sm mt-5'>This is a demo project u can sign in with ur email or
            password
            or with google
          </p>
        </div>
        {/* rightside */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='email'
                id='email'
                onChange={handleChange} />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='********'
                id='password'
                onChange={handleChange} />
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
              <OAuth/>
          </form>
          <div className='flex gap-3 text-sm mt-3'>
            <span>Dont Have an account?</span>
            <Link to='/sign-up' className='text-blue-300'>
              Sign up
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'
            >{errorMessage}</Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignIn