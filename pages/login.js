import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import classes from '../public/css/styles.module.css';
import { toast } from 'react-toastify';
import GForm from '../components/UI/GForm';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Context } from '../context/index';

const Login = () => {
  const [email, setEmail] = useState('mailtesttinguser@gmail.com');
  const [password, setPassword] = useState('1234567');
  const [loading, setLoading] = useState(false);

  // global state
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  // router
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      });
      dispatch({ type: 'LOGIN', payload: data });
      // save in local storage
      window.localStorage.setItem('user', JSON.stringify(data));
      // Redirect
      router.push('/user');
      toast.success('Login successful.');
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  const emailOnChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordOnChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const loginFormElements = [
    {
      type: 'email',
      value: email,
      required: true,
      onChange: emailOnChangeHandler,
      placeholder: 'Enter email',
      isVisible: true,
    },
    {
      type: 'password',
      required: true,
      value: password,
      onChange: passwordOnChangeHandler,
      placeholder: 'Enter password',
      isVisible: true,
    },
  ];

  return (
    <>
      <GForm
        inputFormElements={loginFormElements}
        formTitle="Login"
        submitLegend="Submit"
        submitHandler={submitHandler}
        loading={loading}
      />
      <p className="text-center">
        Not yet registered?{' '}
        <NextLink href="/register">
          <a>Register</a>
        </NextLink>
      </p>
      <p className="text-center ">
        Forgot password?{' '}
        <NextLink href="/forgot-password">
          <a className="text-danger">Reset password</a>
        </NextLink>
      </p>
    </>
  );
};

export default Login;
