
// src/hooks/usePermissions.js
import { useEffect, useState } from 'react';
import { decryptData } from './cryptoUtils';
import { Redirect, Route } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';

const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const encryptedPermissions = localStorage.getItem('permissions');

    if (encryptedPermissions) {

      try {
        const storedPermissions = decryptData(encryptedPermissions);
        
        // Filter permissions to get only those with a value of true
        const filteredPermissions = storedPermissions.filter(permission => {
          const key = Object.keys(permission)[0];
          return permission[key] === true;
        });
        setPermissions(filteredPermissions);
      } catch (error) {
        console.error('Failed to decrypt permissions', error);
      }
    }
  }, []);

  return permissions;
};

export default usePermissions;

export const hasPermission = (permissions, permissionKey) => {
  return permissions.some(permission => permission[permissionKey] === true);
};

export const ProtectedRoute = ({ component: Component, requiredPermission, ...rest }) => {
  const permissions = usePermissions();

  return (           
    <Route
      {...rest}
      render={props => {
  

        if (hasPermission(permissions, requiredPermission)) {
          return <Component {...props} />;
        } else {
          toast.dismiss();
toast.error("You do not have permission to access this page.");
          return <Redirect to="/errorpage" />;
        }
      }}
    />
  );
};
