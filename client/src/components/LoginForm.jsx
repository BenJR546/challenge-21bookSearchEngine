// client/src/components/LoginForm.jsx
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

import { loginUser } from "../utils/API";
import Auth from "../utils/auth";

const LoginForm = ({ handleModalClose }) => {
    // Set initial form state
    const [userFormData, setUserFormData] = useState({
        email: "",
        password: "",
    });
    // Set state for form validation
    const [validated] = useState(false);
    // Set state for alert
    const [showAlert, setShowAlert] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // Check if form has everything (as per react-bootstrap docs)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        try {
            const response = await loginUser(userFormData);

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const { token, user } = await response.json();
            console.log(user);
            Auth.login(token);

            // Close the modal upon successful login
            handleModalClose();
        } catch (err) {
            console.error(err);
            setShowAlert(true);
        }

        setUserFormData({
            email: "",
            password: "",
        });
    };

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                {/* Show alert if server response is bad */}
                <Alert
                    dismissible
                    onClose={() => setShowAlert(false)}
                    show={showAlert}
                    variant="danger"
                >
                    Something went wrong with your login credentials!
                </Alert>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Your email"
                        name="email"
                        onChange={handleInputChange}
                        value={userFormData.email}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Email is required!
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Your password"
                        name="password"
                        onChange={handleInputChange}
                        value={userFormData.password}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Password is required!
                    </Form.Control.Feedback>
                </Form.Group>
                <Button
                    disabled={!(userFormData.email && userFormData.password)}
                    type="submit"
                    variant="success"
                >
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default LoginForm;
