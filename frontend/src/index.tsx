import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './index.css';
import store from './redux/store';
import { Layout } from './app/Layout/Layout';

import { Homepage } from './pages/Homepage/Homepage';

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

const container = document.querySelector('#root') as HTMLElement;
const root = createRoot(container);

if (root) {
    root.render(
        <React.StrictMode>
            <HelmetProvider>
                <Provider store={store}>
                    <RouterProvider router={router} />
                </Provider>
            </HelmetProvider>
        </React.StrictMode>,
    );
}
