import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron';
import PreviewModal from '../../components/modal/PreviewModal';
import SingleCourseLessons from '../../components/cards/SingleCourseLessons';
import { Context } from '../../context/index';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

const SingleCourse = ({ course }) => {
  // state
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});

  // context
  const {
    state: { user },
  } = useContext(Context);

  // router
  const router = useRouter();

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    console.log('CHECK ENROLLMENT => ', data);
    setEnrolled(data);
  };

  const paidEnrollmentHandler = async () => {
    try {
      setLoading(true);
      // check if user is logged in
      if (!user) return router.push('/login');
      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);

      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({ sessionId: data });
      setLoading(false);
    } catch (err) {
      toast.error('Enrollment failed. Try again.');
      console.log(err);
      setLoading(false);
    }
  };
  const freeEnrollmentHandler = async (event) => {
    event.preventDefault();
    try {
      // check if user is logged in
      setLoading(true);
      if (!user) return router.push('/login');
      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      toast.success(data.message);
      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      toast.error('Enrollment failed. Try again.');
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        setShowModal={setShowModal}
        setPreview={setPreview}
        user={user}
        loading={loading}
        freeEnrollmentHandler={freeEnrollmentHandler}
        paidEnrollmentHandler={paidEnrollmentHandler}
        enrolled={enrolled}
        setEnrolled={enrolled}
      />

      <PreviewModal
        preview={preview}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export const getServerSideProps = async ({ query }) => {
  try {
    const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
    return { props: { course: data } };
  } catch (err) {
    console.log(err);
  }
};

export default SingleCourse;
