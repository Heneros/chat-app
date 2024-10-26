import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import './ModalRegistration.css';

import { useRegistrationMutation } from '@/features/user/userApiSlice';
import { logIn } from '@/features/auth/auth';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { ChatModal } from '@/shared/types';
import { useAppDispatch } from '@/shared/lib/store';
import GoogleLoginButton from '@/features/auth/ui/GoogleLoginButton';
import GithubLoginButton from '@/features/auth/ui/GithubLoginButton';

export const ModalRegistration: React.FC<ChatModal> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();

    const [registerUser, { isLoading, isSuccess, error }] =
        useRegistrationMutation();

    useEffect(() => {
        if (isSuccess) {
            onClose();
        }
    }, [isSuccess, onClose]);

    if (!isOpen) return null;

    return (
        <Formik
            initialValues={{
                username: '',
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                passwordConfirm: '',
                submit: null,
            }}
            validationSchema={Yup.object().shape({
                username: Yup.string().max(35).required('Username is required'),
                firstName: Yup.string().required('First Name is required'),
                lastName: Yup.string().required('Last Name is required'),
                email: Yup.string().email().required('Email is required'),
                password: Yup.string().required('Password is required'),
                passwordConfirm: Yup.string()
                    .required('Password is required')
                    .oneOf([Yup.ref('password')], 'Passwords must match'),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
                try {
                    const getUserCredentials =
                        await registerUser(values).unwrap();
                    //   alert(`User registred ${getUserCredentials.username}`);
                    dispatch(
                        logIn({
                            ...getUserCredentials,
                        }),
                    );
                    setSubmitting(false);
                    setStatus({ success: true });
                    // console.log('Success!');
                } catch (error) {
                    console.log(error);
                    console.log('errorReg!', error);
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
                        <h2>Registration</h2>
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
                                {touched.username && errors.username && (
                                    <div className="error-message">
                                        {errors.username}
                                    </div>
                                )}
                                <label htmlFor="username">
                                    Username
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={values.username}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
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
                                {touched.firstName && errors.firstName && (
                                    <div className="error-message">
                                        {errors.firstName}
                                    </div>
                                )}
                                <label htmlFor="firstName">
                                    First Name
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={values.firstName}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                {touched.lastName && errors.lastName && (
                                    <div className="error-message">
                                        {errors.lastName}
                                    </div>
                                )}
                                <label htmlFor="lastName">
                                    Last Name
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={values.lastName}
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
                            <div className="form-group">
                                {touched.passwordConfirm &&
                                    errors.passwordConfirm && (
                                        <div className="error-message">
                                            {errors.passwordConfirm}
                                        </div>
                                    )}
                                <label htmlFor="passwordConfirm">
                                    Confirm Password
                                    <input
                                        type="password"
                                        id="passwordConfirm"
                                        name="passwordConfirm"
                                        value={values.passwordConfirm}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={
                                    !values.username ||
                                    !values.email ||
                                    !values.firstName ||
                                    !values.lastName ||
                                    !values.password ||
                                    !values.passwordConfirm
                                }
                                className="btn-submit"
                            >
                                Submit
                            </button>
                        </form>
                        <GoogleLoginButton />
                        <GithubLoginButton />
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
