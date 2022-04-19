import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';

const UserNav = () => {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);
  return (
    <div className="nav flex-column nav-pills ">
      <NextLink href="/user">
        <a className={`nav-link ${current === '/user' && 'active'}`}>
          Dashboard
        </a>
      </NextLink>
    </div>
  );
};

export default UserNav;
