import React, { useState } from 'react'
import {BsFillShieldLockFill, BsTelephoneFill} from 'react-icons/bs';
import OtpInput from 'otp-input-react';
import {CgSpinner} from 'react-icons/cg';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { auth } from './firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { Toaster, toast } from 'react-hot-toast';
const App = () => {
  const [otp,setOtp]= useState('');
  const [phone,setPhone]= useState('');
  const [loading,setLoading]=useState(false);
  const [showOTP,setShowOTP] = useState(false);
  const [user,setUser]=useState(null);


  function onCaptchVerify(){
    if(!window.recaptchaVerifier)
    {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
                onSignup();
        },
        'expired-callback': () => {
       
        }
      }, auth);
    }
  }
 async function onSignup(){
    setLoading(true);
    onCaptchVerify()
    const appVerifier = window.recaptchaVerifier;
    const formatNumber = '+'+phone;
  await  signInWithPhoneNumber(auth, formatNumber, appVerifier)
    .then((confirmationResult) => {
      
      window.confirmationResult = confirmationResult;
    setLoading(false);
      setShowOTP(true);
      toast.success("Otp Send Sucessfully")
      // ...
    }).catch((error) => {
      console.log("🚀 ~ file: App.js:42 ~ .then ~ error:", error)
    setLoading(false);
    // toast.error("Error Occured")


      // Error; SMS not sent
      // ...
    });
  }


  const signOutE=async()=>{
    signOut(auth).then(() => {
      // Sign-out successful.
      toast.success("logout Success")
      setUser(null);

    }).catch((error) => {
      toast.error("Error Occroued"+error.message)
    });
  }

    function onOtpVerified(){
      setLoading(true);
      window.confirmationResult.confirm(otp).then(async(res)=>{
        console.log(res);
        setUser(res.user)
        setLoading(false);
      }).catch((err) => {
        console.log("🚀 ~ file: App.js:63 ~ window.confirmationResult.confirm ~ err:", err)
        setLoading(false);
      toast.error("Invalid OTP or expired OTP")
    
        
      })
    }




  return (
    <>
      <section className="bg-emerald-500 flex items-center justify-center h-screen">
        <div id="recaptcha-container"></div>
<Toaster toastOptions={{
  duration:4000

}} />

      { !user ?   <div className="">
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1 className='text-center leading-normal text-white font-medium text-3xl mb-6'>
              welcome to <br /> Tech Krishna
            </h1>
         {  showOTP ?  <>
            
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label htmlFor="ph" className='font-bold text-2xl text-white text-center'>Enter Your Otp</label>
                <OtpInput value={otp} onChange={setOtp} className="opt-container" OTPLength={6} otpType="number" disabled={false}></OtpInput>

                <button onClick={onOtpVerified} className='bg-emerald-700 w-full flex gap-1 items-center justify-center text-white rounded py-2.5'>
                  {
                    loading &&
                  <CgSpinner size={20}  className='mt-1 animate-spin'/>
                  }
                  <span>Verify Otp</span>
                </button>
            </>

                      :
            <>
            
            <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
              <BsTelephoneFill size={30} />
            </div>
            <label htmlFor="ph" className='font-bold text-2xl text-white text-center'>Verify mobile</label>
         <PhoneInput country={'in'} value={phone} onChange={setPhone} />
            <button onClick={onSignup} className='bg-emerald-700 w-full flex gap-1 items-center justify-center text-white rounded py-2.5'>
              {
                loading &&
              <CgSpinner size={20}  className='mt-1 animate-spin'/>
              }
              <span>Sent code with SMS</span>
            </button>
        </>}
          </div>
        </div>
        :
        <>
        
        <h2 className="text-center leading-normal text-white font-medium text-2xl ">Login Success</h2>
                <button onClick={signOutE} className='bg-emerald-700 w-full flex gap-1 items-center justify-center text-white rounded py-2.5'>logout</button>
        </>
}

      </section>
    </>
  )
}

export default App