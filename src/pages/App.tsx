import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import OrdersPage from './OrdersPage';
import OrderDetailsPage from './OrderDetailsPage';
import CreateOrderPage from './CreateOrderPage';
import FAQPage from './FAQPage';
import PricesPage from './PricesPage';
import FeedbacksPage from './FeedbacksPage';
import ProfilePage from './ProfilePage';
import ReferralsPage from './ReferralsPage';
import LoginPage from './LoginPage';
import EmailLoginPage from './EmailLoginPage';
import RegisterPage from './RegisterPage';
import ClientChatPage from './ClientChatPage';
import Layout from '../ui/Layout';
import { AuthProvider, useAuth } from '../state';

const Protected: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
  <AuthProvider>
    <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/email-login" element={<EmailLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/orders" element={<Protected><OrdersPage /></Protected>} />
            <Route path="/orders/new" element={<Protected><CreateOrderPage /></Protected>} />
            <Route path="/orders/:id" element={<Protected><OrderDetailsPage /></Protected>} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/prices" element={<PricesPage />} />
            <Route path="/support" element={<Protected><ClientChatPage /></Protected>} />
            <Route path="/feedbacks" element={<FeedbacksPage />} />
            <Route path="/referrals" element={<Protected><ReferralsPage /></Protected>} />
            <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
          </Routes>
    </Layout>
    </AuthProvider>
  );
}
