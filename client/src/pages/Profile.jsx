import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, Signout } from '../redux/userSlice';

export default function Profile() {
  const {currentUser, loading, error} = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [img, setImg] = useState(null);
  const [imgPercent, setImgPercent] = useState(0);
  const [imgError, setImgError] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

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

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  console.log(formData);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          "content-type": 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data));
        return;
      }  

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      console.log(err); 
      dispatch(updateUserFailure(err));
    }
  }

  const handleDeleteAccount = async()=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }

      console.log(data);
      dispatch(deleteUserSuccess());
    } catch (err) {
      console.log(err);
      dispatch(deleteUserFailure(err));
    }
  }

  const handleSignOut = async() => {
    try {
      await fetch('/api/auth/signout');
      dispatch(Signout());
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} name="profilPic" hidden accept='image/*' onChange={(e)=> setImg(e.target.files[0])} />
        <img onClick={() => fileRef.current.click()} 
        src={ formData.profilePic || currentUser.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} 
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
        <input onChange={handleChange} defaultValue={currentUser.username} type="text" name="username" id="username" className='bg-slate-100 rounded-lg p-3' placeholder='Username'/>
        <input onChange={handleChange} defaultValue={currentUser.email} type="text" name="email" id="email" className='bg-slate-100 rounded-lg p-3' placeholder='Email'/>
        <input onChange={handleChange} type="password" name="password" id="password" className='bg-slate-100 rounded-lg p-3' placeholder='Password'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75' disabled={loading ? true : false}>{loading? 'Updating...' : 'update'}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteAccount} className='text-red-700 cursor-pointer'>Delete an account?</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error && "Somethink went wrong!"}</p>
      <p className='text-green-700 mt-5'>{updateSuccess && "Update Profile Success!"}</p>
    </div>
  )
}
