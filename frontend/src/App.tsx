import { Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
// const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Login = lazy(() => import('./pages/Login'));
// const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
// const Profile = lazy(() => import('./pages/Profile'));
// const Orders = lazy(() => import('./pages/Orders'));
// const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
// const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
// const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          {/* <Route path="/products/:id" element={<ProductDetails />} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          {/* TODO: Add routes for OrderConfirmation, Profile, Orders, Admin, etc. */}
                  </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
