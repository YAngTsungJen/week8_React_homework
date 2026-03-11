import AdminLayout from '../pages/backend/AdminLayout';
import AdminOrders from '../pages/backend/AdminOrders';
import AdminProducts from '../pages/backend/AdminProducts';
import Layout from '../pages/frontend/Layout';
import Home from '../pages/frontend/Home';
import Carts from '../pages/frontend/Carts';
import Checkout from '../pages/frontend/Checkout';
import Products from '../pages/frontend/Products';
import SingleProduct from '../pages/frontend/SingleProduct';
import NotFound from '../pages/NotFound';
import Login from '../pages/frontend/Login';
import ProtectedRoutes from '../components/ProtectedRoutes';
import ConfirmOrders from '../pages/frontend/ConfirmOrders';
import CompleteOrders from '../pages/frontend/CompleteOrders';
import WishList from '../pages/frontend/WishList';
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'carts',
        element: <Carts />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'confirmorders/:orderId',
        element: <ConfirmOrders />,
      },
      {
        path: 'completeorders',
        element: <CompleteOrders />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'singleProduct/:id',
        element: <SingleProduct />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'wishlist',
        element: <WishList />,
      }
    ],
  },
  {
    path: 'admin',
    element: (
      <ProtectedRoutes>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: 'adminProducts',
        element: <AdminProducts />,
      },
      {
        path: 'adminOrders',
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
