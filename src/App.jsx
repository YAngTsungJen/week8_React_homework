import { createHashRouter, RouterProvider } from 'react-router';
import routes from './routes/index';
import Toast from './components/Toast.jsx';

const router = createHashRouter(routes);
function App() {
  return (
    <>
      <Toast />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
