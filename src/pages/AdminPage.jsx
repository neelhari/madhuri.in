import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminLayout } from '../components/admin/AdminLayout';
import { BannersManager } from '../components/admin/BannersManager';
import { CategoriesManager } from '../components/admin/CategoriesManager';
import { ProductsManager } from '../components/admin/ProductsManager';
import { InventoryManager } from '../components/admin/InventoryManager';
import { OrdersManager } from '../components/admin/OrdersManager';
import { CustomersManager } from '../components/admin/CustomersManager';
import { CouponsManager } from '../components/admin/CouponsManager';
import { StoreSettingsManager } from '../components/admin/StoreSettingsManager';

export const AdminPage = ({ navigate, initialTab = 'products' }) => {
  const { isAdminAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isAdminAuthenticated) {
    return <AdminLoginPage navigate={navigate} />;
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'banners':
        return <BannersManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'products':
        return <ProductsManager />;
      case 'inventory':
        return <InventoryManager />;
      case 'orders':
        return <OrdersManager />;
      case 'customers':
        return <CustomersManager />;
      case 'coupons':
        return <CouponsManager />;
      case 'settings':
        return <StoreSettingsManager />;
      default:
        return <ProductsManager />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      navigate={navigate}
    >
      {renderActiveModule()}
    </AdminLayout>
  );
};

export default AdminPage;
