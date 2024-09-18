import React from 'react'

export default function About() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='mb-28 text-5xl text-slate-800 font-bold'>This web build on..</h1>
      <div className='flex gap-4'>
        <img className='h-26 w-auto self-center object-cover mt-2' src="/asset/node+express.png" alt="node and express.js" />
        <img className='h-26 w-auto self-center object-cover mt-2' src="/asset/react.png" alt="react.js" />
        <img className='h-26 w-auto self-center object-cover mt-2' src="/asset/tailwind.png" alt="tailwind" />
        <img className='h-26 w-auto self-center object-cover mt-2' src="/asset/redux.png" alt="redux" />
      </div>
    </div>
  )
}
