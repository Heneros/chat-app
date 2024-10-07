import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ChatModal } from '@/shared/types';

import './ModalCreateChatStyle.css';
import { useCreateChatMutation } from '@/features/messages/messagesSlice';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

const ModalCreateChat: React.FC<ChatModal> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [createChat, { isLoading, isSuccess, errorCreateChat }] =
        useCreateChatMutation();

    useEffect(() => {
        if (isSuccess) {
            onClose();
        }
    }, [onClose, isSuccess]);

    if (!isOpen) return null;

    return (
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                submit: null,
            }}
            validationSchema={Yup.object().shape({
                firstName: Yup.string()
                    .max(35)
                    .required('firstName is required'),
                lastName: Yup.string().max(35).required('lastName is required'),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
                try {
                    setSubmitting(false);
                    setStatus({ success: true });
                    await dispatch(createChat(values).unwrap());
                } catch (error) {
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
                        {errorCreateChat && (
                            <div className="error-message">
                                {getErrorMessage(errorCreateChat)}
                            </div>
                        )}

                        <form
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                        >
                            <h2>Create Chat</h2>
                            <div className="form-group">
                                {/* {errors.firstName} */}
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
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-submit"
                            >
                                Create Chat
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

export default ModalCreateChat;
