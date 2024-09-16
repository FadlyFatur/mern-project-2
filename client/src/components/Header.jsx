import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
    const {currentUser} = useSelector((state) => state.user);
    console.log(currentUser);
    
  return (
    <div className='bg-slate-200'>
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            < Link to='/'>
                <h1 className='font-bold text-xl'>FdlyDev</h1>
            </Link>
            <ul className='flex gap-4'>
                <Link to="/">
                    <li>Home</li>
                </Link>
                <Link to="/about">
                    <li>About</li>
                </Link>
                <Link to="/profile">
                    {
                        currentUser ? (
                            <img className='h-7 w-7 rounded-full object-cover' src={currentUser.profilePic} alt="profile-pic" />
                        ) : (
                            <li>Sign In</li>
                        )
                    }
                </Link>
                <Link to="sign-up">
                    <li>Sign Up</li>
                </Link>
            </ul>
        </div>
    </div>
  )
}
