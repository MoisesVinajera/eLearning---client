import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import classes from '../public/css/styles.module.css';
import { toast } from 'react-toastify';
import GForm from '../components/UI/GForm';
import NextLink from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const Register = () => {
  const [name, setName] = useState('test');
  const [email, setEmail] = useState('mailtesttinguser@gmail.com');
  const [password, setPassword] = useState('1234567');
  const [loading, setLoading] = useState(false);

  // global state
  const {
    state: { user },
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
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });
      setEmail('');
      setName('');
      setPassword('');
      toast.success('Registration successful. Please log');
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  const nameOnChangeHandler = (event) => {
    setName(event.target.value);
  };

  const emailOnChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordOnChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const registerFormElements = [
    {
      type: 'text',
      value: name,
      required: true,
      onChange: nameOnChangeHandler,
      placeholder: 'Enter name',
      isVisible: true,
    },
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
        inputFormElements={registerFormElements}
        formTitle="Register"
        submitLegend="Submit"
        submitHandler={submitHandler}
        loading={loading}
      />
      <p className="text-center">
        Already registered?{' '}
        <NextLink href="/login">
          <a>Login</a>
        </NextLink>
      </p>
    </>
  );
};

export default Register;
