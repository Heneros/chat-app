import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './index.css';

import { Layout } from './pages/Layout/Layout';
import { Homepage } from './pages/Homepage/Homepage';
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
