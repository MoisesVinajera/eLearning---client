import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';

const InstructorNav = () => {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills">
      <NextLink href="/instructor">
        <a className={`nav-link ${current === '/instructor' && 'active'}`}>
          Dashboard
        </a>
      </NextLink>
      <NextLink href="/instructor/course/create">
        <a
          className={`nav-link ${
            current === '/instructor/course/create' && 'active'
          }`}
        >
          Create Course
        </a>
      </NextLink>
      <NextLink href="/instructor/revenue">
        <a
          className={`nav-link ${
            current === '/instructor/revenue' && 'active'
          }`}
        >
          Revenue
        </a>
      </NextLink>
    </div>
  );
};

export default InstructorNav;
