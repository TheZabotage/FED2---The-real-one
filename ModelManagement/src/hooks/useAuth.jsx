import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
//Implemented here from AuthContext.jsx so React Fast Refresh works as intended
// ToDO: is th
export const useAuth = () => {
    return useContext(AuthContext);
};