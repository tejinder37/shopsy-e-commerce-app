import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useAddItemToCartMutation,
  useRemoveItemFromCartMutation,
} from '../slices/cartApiSlice';

import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addItemToCart] = useAddItemToCartMutation();
  const [removeItemFromCart] = useRemoveItemFromCartMutation();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // NOTE: no need for an async function here as we are not awaiting the
  // resolution of a Promise

  const addToCartHandler = async (product, qty) => {
    try {
      const itemToAdd = {
        product: product._id, // Add this line
        name: product.name,
        qty,
        price: product.price,
        image: product.image,
      };

      await addItemToCart(itemToAdd).unwrap();
      dispatch(addToCart({ ...product, qty }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const removeFromCartHandler = async (id) => {
    try {
      await removeItemFromCart(id).unwrap();
      dispatch(removeFromCart(id));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item
                className='border border-1 rounded-3 mb-3'
                key={item._id}
              >
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link
                      className='text-decoration-none text-black'
                      to={`/product/${item._id}`}
                    >
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <h2 style={{ marginBottom: '20px' }}>Subtotal Count</h2>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block bg-light text-black border-black'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
