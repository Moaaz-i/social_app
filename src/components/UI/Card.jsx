import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={twMerge(
        'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
