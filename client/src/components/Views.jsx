import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import SignUp from '../pages/SignUp';

const Views = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default Views;
