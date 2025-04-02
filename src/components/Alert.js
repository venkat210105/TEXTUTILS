import React from 'react';  // Explicit React import added
import PropTypes from 'prop-types';

function Alert(props) {
  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  return (
    props.alert && (
      <div 
        className={`alert alert-${props.alert.type} alert-dismissible fade show`} 
        role="alert"
      >
        <strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg}
      </div>
    )
  );
}

Alert.propTypes = {
  alert: PropTypes.shape({
    type: PropTypes.string,
    msg: PropTypes.string
  })
};

export default Alert;