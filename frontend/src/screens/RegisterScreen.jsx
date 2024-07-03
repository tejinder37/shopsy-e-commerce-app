import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import login from '../assets/login.jpg'
import { FaFire } from 'react-icons/fa';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col col-xl-10">
          <div className="card rounded-3">
            <div className="row align-align-items-stretch g-0">
              <div className="col-md-6 col-lg-5 d-none d-md-block">
                <img src={login}
                  alt="login form" className="img-fluid h-100 object-fit-contain" style={{ borderRadius: '1rem 0 0 1rem' }} />
              </div>
              <div className="col-md-6 col-lg-7 d-flex align-items-center">
                <div className="card-body p-4 p-lg-5 text-black">

                  <div className='form_box'>

                    <div className="d-flex align-items-center mb-3 pb-1">
                    <FaFire className='fs-1 me-2 text-black'/>
                      <span className="h1 fw-bold mb-0">Register</span>
                    </div>

                    <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Create Your New Account</h5>
                    <Form onSubmit={submitHandler}>
                      <Form.Group classNameName='my-2' controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          className="form-control form-control-lg"
                          type='name'
                          placeholder='Enter name'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group classNameName='my-2' controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          className="form-control form-control-lg"
                          type='email'
                          placeholder='Enter email'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group classNameName='my-2' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          className="form-control form-control-lg"
                          type='password'
                          placeholder='Enter password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group classNameName='my-2 ' controlId='confirmPassword'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          className="form-control form-control-lg"
                          type='password'
                          placeholder='Confirm password'
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <div className='my-3'>
                        <Button className='btn btn-dark btn-lg btn-block' disabled={isLoading} type='submit' variant='primary'>
                          Register
                        </Button>
                      </div>
                      {isLoading && <Loader />}
                    </Form>
                    <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Don't have an account?  <Link style={{ color: '#393f81' }} to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                      Login
                    </Link></p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterScreen;
