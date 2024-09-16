import React from 'react'
import { useSelector } from 'react-redux';

export default function Profile() {
  const {currentUser} = useSelector(state => state.user);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-5'>
        <img src={currentUser.profilePic} alt="profilePic" className='h-23 w-23 self-center rounded-full cursor-pointer object-cover mt-2' />
        <input defaultValue={currentUser.username} type="text" name="username" id="username" className='bg-slate-100 rounded-lg p-3' placeholder='Username'/>
        <input defaultValue={currentUser.email} type="text" name="email" id="email" className='bg-slate-100 rounded-lg p-3' placeholder='Email'/>
        <input type="password" name="password" id="password" className='bg-slate-100 rounded-lg p-3' placeholder='Password'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75'>update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete an account?</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
