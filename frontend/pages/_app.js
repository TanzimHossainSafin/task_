import '../styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from '../store/slices/authSlice';

function AppContent({ Component, pageProps }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AppContent Component={Component} pageProps={pageProps} />
    </Provider>
  );
}

export default MyApp;
