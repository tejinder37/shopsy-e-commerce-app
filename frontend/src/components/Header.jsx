import { Navbar, Nav,  NavDropdown, Badge } from 'react-bootstrap';
import { FaFire, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // NOTE: here we need to reset cart state for when a user logs out so the next
      // user doesn't inherit the previous users cart and shipping
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className='mb-5'>
      <nav class="navbar navbar-expand-lg shadow-sm bg-body-tertiary position-fixed w-100 z-3 top-0">
        <div class="container">
          <Navbar.Brand className='d-flex gap-2 justify-content-start align-items-center' as={Link} to='/'>
            <FaFire className='fs-3' />
            <span className='fw-bold'>Shopsy</span>
          </Navbar.Brand>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <Nav.Link className='text-black' as={Link} to='/cart'>
                  <FaShoppingCart className='fs-5' /> Cart
                  {cartItems?.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px', }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </li>

              <li class="nav-item dropdown">
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title='Admin' id='adminmenu'>
                    <NavDropdown.Item className='text-black' as={Link} to='/admin/productlist'>
                      Products
                    </NavDropdown.Item>
                    <NavDropdown.Item className='text-black' as={Link} to='/admin/orderlist'>
                      Orders
                    </NavDropdown.Item>
                    <NavDropdown.Item className='text-black' as={Link} to='/admin/userlist'>
                      Users
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </li>
              <li class="nav-item">
                {userInfo ? (
                  <>
                    <NavDropdown title={userInfo.name} id='username'>
                      <NavDropdown.Item className='text-black' as={Link} to='/profile'>
                        Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item className='text-black' onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <Nav.Link className='text-black' as={Link} to='/login'>
                    <FaUser /> Sign In
                  </Nav.Link>
                )}
              </li>
            </ul>
            <SearchBox />

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
