import React, { useEffect } from 'react';
import './ModalLogin.css';

import * as Yup from 'yup';

import { Formik } from 'formik';
import { useLoginMutation } from '@/features/user/userApiSlice';
import { logIn } from '@/features/auth/auth';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { ChatModal } from '@/shared/types';
import { useAppDispatch } from '@/shared/lib/store';

export const ModalLogin: React.FC<ChatModal> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const [loginUser, { isLoading, isSuccess, error }] = useLoginMutation();

    useEffect(() => {
        if (isSuccess) {
            onClose();
        }
    }, [isSuccess, onClose]);

    const google = () => {
        window.open('http://localhost:4000/api/v1/users/google', '_self');
    };

    if (!isOpen) return null;

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
                submit: null,
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email().required('Email is required'),
                password: Yup.string().required('Password is required'),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
                try {
                    const getUserCredentials = await loginUser(values).unwrap();
                    dispatch(
                        logIn({
                            ...getUserCredentials,
                        }),
                    );
                    setSubmitting(false);
                    setStatus({ success: true });
                    //     console.log('Success!');
                } catch (error) {
                    console.log(error);
                    console.log('errorLog!', error);

                    setStatus({ success: false });
                    setSubmitting(false);
                }
            }}
        >
            {({
                errors,
                values,
                handleSubmit,
                handleChange,
                touched,
                isSubmitting,
            }) => (
                <div className="modal-overlay" onClick={onClose}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Login</h2>
                        <form
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                        >
                            {error && (
                                <div className="error-message">
                                    {getErrorMessage(error)}
                                </div>
                            )}
                            <div className="form-group">
                                {touched.email && errors.email && (
                                    <div className="error-message">
                                        {errors.email}
                                    </div>
                                )}
                                <label htmlFor="email">
                                    Email
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                {touched.password && errors.password && (
                                    <div className="error-message">
                                        {errors.password}
                                    </div>
                                )}
                                <label htmlFor="password">
                                    Password
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={!values.email || !values.password}
                                className="btn-submit"
                            >
                                Login
                            </button>
                        </form>
                        <button onClick={google} type="button">
                            Google btn
                        </button>
                        <button
                            type="submit"
                            className="btn-close"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </Formik>
    );
};
