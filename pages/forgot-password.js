import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import GForm from '../components/UI/GForm';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Context } from '../context/index';

const ForgotPassword = () => {
  //state
  const [email, setEmail] = useState('mailtesttinguser@gmail.com');
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // global state
  const {
    state: { user },
  } = useContext(Context);

  // router
  const router = useRouter();

  // redirect if user is logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/forgot-password`, {
        email,
      });
      setSuccess(true);
      toast.success('Check you email for the secret code');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data);
    }
  };

  const resetPasswordHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/reset-password`, {
        email,
        code,
        newPassword,
      });
      setEmail('');
      setCode('');
      setNewPassword('');
      setLoading(false);
      toast.success('Great! Now you can login with your new password');
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data);
    }
  };

  const emailOnChangeHandler = (event) => {
    setEmail(event.target.value);
  };
  const codeOnChangeHandler = (event) => {
    setCode(event.target.value);
  };
  const newPasswordOnChangeHandler = (event) => {
    setNewPassword(event.target.value);
  };

  const forgotPasswordFormElements = [
    {
      type: 'email',
      value: email,
      required: true,
      onChange: emailOnChangeHandler,
      placeholder: 'Enter email',
      isVisible: true,
    },
    {
      type: 'text',
      required: success ? true : false,
      value: code,
      onChange: codeOnChangeHandler,
      placeholder: 'Enter secret code',
      isVisible: success ? true : false,
    },
    {
      type: 'password',
      required: success ? true : false,
      value: newPassword,
      onChange: newPasswordOnChangeHandler,
      placeholder: 'Enter new password',
      isVisible: success ? true : false,
    },
  ];

  return (
    <>
      <GForm
        inputFormElements={forgotPasswordFormElements}
        formTitle="Forgot Password"
        submitLegend="Submit"
        submitHandler={success ? resetPasswordHandler : submitHandler}
        loading={loading}
      />
    </>
  );
};

export default ForgotPassword;
