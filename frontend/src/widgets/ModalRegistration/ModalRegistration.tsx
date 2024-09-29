import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import './ModalRegistration.css';
import { useRegistrationMutation } from '@/features/user/userApiSlice';
import { logIn } from '@/features/auth/auth';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { ChatModal } from '@/shared/types';

export const ModalRegistration: React.FC<ChatModal> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    const [registerUser, { isLoading, isSuccess, error: errorReg }] =
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

                    // console.log('Error!');
                    setStatus({ success: false });
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, values, handleSubmit, handleChange, isSubmitting }) => (
                <div className="modal-overlay" onClick={onClose}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Registration</h2>
                        <form
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                        >
                            {errorReg && (
                                <div className="error-message">
                                    {getErrorMessage(errorReg)}
                                </div>
                            )}
                            <div className="form-group">
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
                                disabled={isSubmitting}
                                className="btn-submit"
                            >
                                Submit
                            </button>
                        </form>
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
