import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <nav>
        <ul className='pagination'>
          {[...Array(pages).keys()].map((x) => {
            const pageNumber = x + 1;
            const url = !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${pageNumber}`
                : `/page/${pageNumber}`
              : `/admin/productlist/${pageNumber}`;

            return (
              <li
                key={pageNumber}
                className={`page-item ${pageNumber === page ? 'active' : ''}`}
              >
                <Link to={url} className='page-link'>
                  {pageNumber}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    )
  );
};

export default Paginate;
