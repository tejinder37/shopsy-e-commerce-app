import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = ({ isAdmin = false }) => {
  const { pageNumber = 1, keyword = '' } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
    minPrice,
    maxPrice,
  });

  useEffect(() => {
    refetch(); // Refetch data when URL params change
  }, [pageNumber, keyword, refetch]);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(
      `/?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
  };

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      <Form
        onSubmit={submitHandler}
        className='mb-4 bg-light p-3 rounded-4 shadow-sm'
      >
        <Row>
          <Col md={6} lg={3}>
            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as='select'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=''>All</option>
                <option value='Electronics'>Electronics</option>
                <option value='Clothing'>Clothing</option>
                <option value='Books'>Books</option>
                <option value='Home&Kitchen'>Home & Kitchen</option>
                <option value='Beauty&Personal Care'>
                  Beauty & Personal Care
                </option>
                <option value='Sports&Outdoors'>Sports & Outdoors</option>
                <option value='Toys&Games'>Toys & Games</option>
                <option value='Automotive'>Automotive</option>
                <option value='Grocery'>Grocery</option>
                <option value='Health&Wellness'>Health & Wellness</option>
                <option value='Pet-Supplies'>Pet Supplies</option>
                <option value='Office-Products'>Office Products</option>
                <option value='Other'>Other</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6} lg={3}>
            <Form.Group controlId='minPrice'>
              <Form.Label>Min Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Min Price'
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6} lg={3}>
            <Form.Group controlId='maxPrice'>
              <Form.Label>Max Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Max Price'
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6} lg={3}>
            <Button type='submit' className='mt-4'>
              Filter
            </Button>
          </Col>
        </Row>
      </Form>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1 className='fw-medium'>Latest Products</h1>
          <Row className='align-items-stretch gy-3'>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
            isAdmin={isAdmin}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
