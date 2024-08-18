import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './pages/Layout/Layout';
import './index.css';
import App from './App';
import { Homepage } from './pages/Homepage/Homepage';
import { Registration } from './pages/Registration/Registration';
import { Login } from './pages/Login/Login';
import { Provider } from 'react-redux';
import store from './redux/store';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                path: '/',
                element: <Homepage />,
            },
            {
                path: '/registration',
                element: <Registration />,
            },
            {
                path: '/login',
                element: <Login />,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </HelmetProvider>
    </React.StrictMode>,
);
