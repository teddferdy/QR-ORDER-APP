import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useSearchParams } from 'react-router-dom';
import { Home, ShoppingBag, ListOrdered, Headphones, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useSettingsStore } from '../store/useSettingsStore';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { path: '/', icon: Home, label: 'Menu' },
  { path: '/orders', icon: ListOrdered, label: 'Pesanan' },
  { path: '/cart', icon: ShoppingBag, label: 'Keranjang' },
  { path: '/waiter', icon: Headphones, label: 'Pelayan' },
  { path: '/history', icon: User, label: 'Riwayat' },
];

const NavLinks: React.FC<{ badge?: number }> = ({ badge }) => {
  const location = useLocation();
  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center gap-1 ${
            location.pathname === item.path
              ? 'text-primary'
              : 'text-gray-400'
          }`}
        >
          <div className="relative">
            <item.icon size={24} />
            {item.path === '/cart' && badge && badge > 0 ? (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {badge}
              </span>
            ) : null}
          </div>
          <span className="text-[10px] font-medium">{item.label}</span>
        </Link>
      ))}
    </>
  );
};

const Layout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const totalItems = useCartStore((state) => state.totalItems());
  const { settings, setTableNumber, setStoreId } = useSettingsStore();

  useEffect(() => {
    const table = searchParams.get('table');
    const store = searchParams.get('store');
    if (table) setTableNumber(table);
    if (store) setStoreId(store);
  }, [searchParams, setTableNumber, setStoreId]);

  return (
<div className="min-h-screen bg-secondary md:pb-0 dark:bg-gray-900">
      {/* Desktop Header Nav */}
      <header className="hidden md:block bg-white border-b border-gray-100 sticky top-0 z-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto max-w-2xl px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-display font-bold text-xl text-primary">
            Bisa Makan
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {settings.tableNumber && (
              <span>
                Meja <strong className="text-gray-900 dark:text-gray-100">{settings.tableNumber}</strong>
              </span>
            )}
            {settings.storeId && (
              <span>
                Store <strong className="text-gray-900 dark:text-gray-100">{settings.storeId}</strong>
              </span>
            )}
          </div>
          <nav className="flex items-center gap-6">
            <NavLinks />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-100 sticky top-0 z-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-display font-bold text-lg text-primary">
            Bisa Makan
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {settings.tableNumber && (
              <span>Meja {settings.tableNumber}</span>
            )}
            {settings.storeId && (
              <span>Store {settings.storeId}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/cart" className="relative">
            <ShoppingBag size={24} className="dark:text-gray-300" />
            {totalItems > 0 ? (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            ) : null}
          </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 pt-6 md:pt-4">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex justify-between items-center md:hidden z-50 safe-bottom dark:bg-gray-800 dark:border-gray-700">
        <NavLinks badge={totalItems} />
      </nav>
    </div>
  );
};

export default Layout;