import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
    return (
        <>
            {/* <Header /> */}
            <Outlet />
            {/* <Footer /> */}
        </>
    );
};
