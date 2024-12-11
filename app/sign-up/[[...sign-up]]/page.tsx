import React from 'react';
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div className={`w-full h-screen flex justify-center items-center`}>
      <span>Ai Verse</span>
      <SignUp />
    </div>
  );
};

export default SignUpPage;
