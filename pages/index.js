import React, { useEffect, useState } from 'react';
import classes from '../public/css/styles.module.css';
import axios from 'axios';
import CourseCard from '../components/cards/CourseCard';

const Index = ({ courses }) => {
  return (
    <>
      <h1
        className={`p-5 mb-4 text-center bg-primary ${classes.square} ${classes.jumbotron}`}
      >
        Online Education Marketplace
      </h1>
      <div className="container-fluid">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const { data } = await axios.get(`${process.env.API}/courses`);
    return {
      props: {
        courses: data,
      },
    };
  } catch (err) {
    console.log(err);
  }
};

export default Index;
