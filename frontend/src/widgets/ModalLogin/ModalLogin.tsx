import React, { useEffect } from 'react';
import './ModalLogin.css';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useLoginMutation } from '@/features/user/userApiSlice';
import { logIn } from '@/features/auth/auth';

export const ModalLogin = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    // const [loginUser, { isLoading, isSuccess, error: errorLog }] =
    //     useLoginMutation();
    const [loginUser, { isLoading, isSuccess, error: errorLog }] =
        useLoginMutation();

    useEffect(() => {
        if (isSuccess) {
            onClose();
        }
    }, [isSuccess, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null,
                }}
                onSubmit={async (values, { setStatus, setSubmitting }) => {
                    try {
                        const getUserCredentials =
                            await loginUser(values).unwrap();
                        dispatch(
                            logIn({
                                ...getUserCredentials,
                            }),
                        );
                        setSubmitting(false);
                        setStatus({ success: true });
                        console.log('Success!');
                    } catch (error) {
                        console.log(error);

                        // console.log('Error!');
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
                    isSubmitting,
                }) => (
                    <div className="modal-overlay" onClick={onClose}>
                        <div
                            className="modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Login</h2>

                            <form
                                noValidate
                                autoComplete="off"
                                onSubmit={handleSubmit}
                            >
                                {errorLog && (
                                    <div className="error-message">
                                        {errorLog?.data?.message ||
                                            'Error during auth'}
                                    </div>
                                )}
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-submit"
                                >
                                    Login
                                </button>
                            </form>
                            <button className="btn-close" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
};
