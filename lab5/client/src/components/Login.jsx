/* eslint-disable jsx-a11y/anchor-is-valid */
import './login.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faEyeSlash,
    faCheck,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';



function Login(props) {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies();
    const { open, setOpen, setUserData, loginContainerRef } = props;
    const [email, setEmail] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [signupData, setSignupData] = useState({
        email: '',
        password: '',
        pib: '',
        group: '',
        id_card: '',
        birthday: '',
    })
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState({
        login: false,
        signup: false,
        signupConfirm: false,
    });
    const [loginStatusText, setloginStatusText] = useState('');
    const [loginSuccess, setloginSuccess] = useState(false);
    const [signUpStatusText, setSignUpStatusText] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const validationRules = {
        pib: /^[A-ZА-ЯІЇЄ][a-zA-ZА-ЯІЇЄа-яіїє]+ [A-ZА-ЯІЇЄ]\.[A-ZА-ЯІЇЄ]\.$/,
        group: /^[A-ZА-ЯІЇЄ][a-zA-ZА-ЯІЇЄа-яіїє]+-\d{2}$/,
        id_card: /^[A-ZА-ЯІЇЄ]{2} №\d{6}$/,
        birthday: /^\d{2}.\d{2}.\d{4}$/,
        email: /^\w+@\w+\.com$/,
    };

    const handleSignupClick = () => {
        const loginText = document.querySelector('.title-text .login');
        const loginForm = document.querySelector('form.login');
        loginForm.style.marginLeft = '-50%';
        loginText.style.marginLeft = '-50%';
    };

    const handleLoginClick = () => {
        const loginText = document.querySelector('.title-text .login');
        const loginForm = document.querySelector('form.login');
        loginForm.style.marginLeft = '0%';
        loginText.style.marginLeft = '0%';
    };

    const handleSignupLinkClick = () => {
        const signupBtn = document.querySelector('label.signup');
        signupBtn.click();
        return false;
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSignupDataChange = (event) => {
        setSignupData(data => ({
            ...data,
            [event.target.id]: event.target.value
        }))
    };

    const handleTogglePasswordVisibility = (field) => {
        setShowPassword((prevShowPassword) => ({
            ...prevShowPassword,
            [field]: !prevShowPassword[field],
        }));
    };

    const handleLoginErrorCancelClick = () => {
        setloginSuccess(false);
        setloginStatusText('');
    };

    const handleSignUpErrorCancelClick = () => {
        setSignUpSuccess(false);
        setSignUpStatusText('');
    };

    function validateField(fieldName, value) {
        return validationRules[fieldName].test(value);
    }


    const handleLoginSubmit = async (event) => {
        event.preventDefault(); // Prevents form submission and page reload

        // Make the API call to the login endpoint
        try {
            const response = await fetch('http://localhost:3005' + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            if (response.status === 200) {
                const responseData = await response.json();

                setCookie('sessionID', responseData.session, {
                    path: '/',
                    httpOnly: false,
                    expires: new Date(responseData.expires)
                })

                setloginSuccess(true);
                setloginStatusText('Successful login');
                setTimeout(() => {
                    window.location.reload(false)
                }, 750)
            } else if (response.status === 401) {
                setloginSuccess(false);
                setloginStatusText('Incorrect email or password');
            } else {
                setloginSuccess(false);
                setloginStatusText('Server error');
                console.log('Some other error');
            }
        } catch (error) {
            setloginSuccess(false);
            setloginStatusText('Server error');
            console.log('Error while logging in', error);
        }
    };

    const handleSignupSubmit = async (event) => {
        event.preventDefault();

        for (const field in validationRules) {
            const value = document.getElementById(field).value;
            const isValidField = validateField(field, value);
            if (!isValidField) {
                setSignUpSuccess(false);
                setSignUpStatusText(`Field ${field} contains incorrect data`);
                return;
            }
        }

        try {
            console.log('data, ', signupData)
            const response = await fetch('http://localhost:3005/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData),
                credentials: 'include'
            });

            if (response.status === 201) {
                // Successful sign-up
                setSignUpSuccess(true);
                setSignUpStatusText('Реєстрація пройшла успішно');
            } else if (response.status === 400) {
                // Handle other response statuses (e.g., validation errors, server errors)
                const responseData = await response.json();
                const error = responseData.error
                if (error.includes('email must be unique')) {
                    setSignUpStatusText('This email was already registered')
                } else {
                    setSignUpStatusText(responseData.error);
                }
                setSignUpSuccess(false);
            } else {
                setSignUpSuccess(false);
                setSignUpStatusText('Server error, try again');
            }
        } catch (error) {
            setSignUpSuccess(false);
            setSignUpStatusText('Server error');
            console.log(error)
        }
    };

    return (
        <Backdrop
            open={open}
            sx={{
                zIndex: (theme) =>
                    Math.max.apply(Math, Object.values(theme.zIndex)) + 1,
            }}

        >
            <div className='loginform' ref={loginContainerRef}>
                <div className='title-text'>
                    <div className='title login'>Authorization</div>
                    <div className='title signup'>Registration</div>
                </div>
                <div className='form-container'>
                    <div className='slide-controls'>
                        <input type='radio' name='slide' id='login' />
                        <input type='radio' name='slide' id='signup' />
                        <label
                            onClick={handleLoginClick}
                            htmlFor='login'
                            className='slide login'
                        >
                            Login
                        </label>
                        <label
                            onClick={handleSignupClick}
                            htmlFor='signup'
                            className='slide signup'
                        >
                            Registration
                        </label>
                        <div className='slider-tab'></div>
                    </div>
                    <div className='form-inner'>
                        <form action='#' className='login'>
                            {loginStatusText && (
                                <div className='field loginStatusField'>
                                    <p
                                        className={
                                            loginSuccess ? 'loginSuccessForm' : 'loginErrorForm'
                                        }
                                    >
                                        {loginStatusText}
                                    </p>
                                    <button
                                        onClick={handleLoginErrorCancelClick}
                                        className={
                                            loginSuccess ? 'closeSuccessButton' : 'closeErrorButton'
                                        }
                                    >
                                        <FontAwesomeIcon icon={loginSuccess ? faCheck : faTimes} />
                                    </button>
                                </div>
                            )}

                            <div className='field'>
                                <input
                                    type='text'
                                    placeholder='Електронна пошта'
                                    onChange={handleEmailChange}
                                    required
                                />
                            </div>
                            <div className='field password-field'>
                                <input
                                    type={showPassword.login ? 'text' : 'password'}
                                    placeholder='Пароль'
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <span
                                    className='password-toggle'
                                    onClick={() => handleTogglePasswordVisibility('login')}
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword.login ? faEyeSlash : faEye}
                                    />
                                </span>
                            </div>

                            <div className='field btn'>
                                <div className='btn-layer'></div>
                                <input type='submit' onClick={handleLoginSubmit} value='Log in' />
                            </div>
                        </form>

                        <form action='#' className='signup'>
                            {signUpStatusText && (
                                <div className='field loginStatusField'>
                                    <p
                                        className={
                                            signUpSuccess ? 'loginSuccessForm' : 'loginErrorForm'
                                        }
                                    >
                                        {signUpStatusText}
                                    </p>
                                    <button
                                        onClick={handleSignUpErrorCancelClick}
                                        className={
                                            signUpSuccess ? 'closeSuccessButton' : 'closeErrorButton'
                                        }
                                    >
                                        <FontAwesomeIcon icon={signUpSuccess ? faCheck : faTimes} />
                                    </button>
                                </div>
                            )}
                            <div className='field'>
                                <input type='text' placeholder='Електронна пошта' id='email' onChange={handleSignupDataChange} required />
                            </div>
                            <div className='field'>
                                <input
                                    type={showPassword.signup ? 'text' : 'password'}
                                    placeholder='password'
                                    id='password'
                                    onChange={handleSignupDataChange}
                                    required
                                />
                                <span
                                    className='password-toggle'
                                    onClick={() => handleTogglePasswordVisibility('signup')}
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword.signup ? faEyeSlash : faEye}
                                    />
                                </span>
                            </div>
                            <div className='field'>
                                <input type='text' placeholder='ПІБ' id='pib' onChange={handleSignupDataChange} required />
                            </div>

                            <div className='field'>
                                <input type='text' placeholder='Група' id='group' onChange={handleSignupDataChange} required />
                            </div>
                            <div className='field'>
                                <input type='text' placeholder='ID-card' id='id_card' onChange={handleSignupDataChange} required />
                            </div>
                            <div className='field'>
                                <input type='text' placeholder='День народження' id='birthday' onChange={handleSignupDataChange} required />
                            </div>

                            <div className='field btn'>
                                <div className='btn-layer'></div>
                                <input type='submit' onClick={handleSignupSubmit} value='Register' />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Backdrop>
    );
}

export default Login;
