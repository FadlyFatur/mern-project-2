import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';

export default function Profile() {
  const {currentUser} = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [img, setImg] = useState(null);
  const [imgPercent, setImgPercent] = useState(0);
  const [imgError, setImgError] = useState(null);
  const [formData, setFormData] = useState(null);
  console.log(imgPercent);
  // console.log(formData);
  

  useEffect(() => {
    if(img) {
      handleFileUpload(img);
    }
  },[img]);

  const handleFileUpload = async (img) =>{
    // console.log(img);
    const storage = getStorage(app);
    const fileName = new Date().getTime()+'_MERNAUTH_'+img.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, img);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Uploads process : '+progress+'% done');
        setImgPercent(Math.round(progress));
      },
      (error)=>{
        setImgError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({...formData, profilePic: downloadURL});
        });
      },
    );
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-5'>
        <input type="file" ref={fileRef} name="profilPic" hidden accept='image/*' onChange={(e)=> setImg(e.target.files[0])} />
        <img onClick={() => fileRef.current.click()} 
        src={formData.profilePic || currentUser.profilePic} 
        alt="profilePic" 
        className='max-h-32 max-w-32 h-23 w-23 self-center rounded-full cursor-pointer object-cover mt-2' />
        <p className='text-sm self-center'>
          {
            (imgError) 
            ? (<span className='text-red-600'>Error Uploading images! (must be image and less than 2MB)</span>)
            : (imgPercent > 0 && imgPercent < 100) ? (<span className='text-slate-600'>{` Uploading : ${imgPercent}% `}</span> )
            : (imgPercent === 100) ? (<span className='text-green-600'>Image uploaded successfully!</span>) 
            : ''
          }
        </p>
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
