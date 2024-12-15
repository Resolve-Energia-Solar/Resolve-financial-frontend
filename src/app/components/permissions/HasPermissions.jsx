import React from 'react';
import PropTypes from 'prop-types';

const HasPermission = ({ permissions, userPermissions, children }) => {
  const hasAllPermissions = permissions.every((permission) =>
    userPermissions.includes(permission)
  );

  return hasAllPermissions ? <>{children}</> : null;
};

HasPermission.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default HasPermission;
