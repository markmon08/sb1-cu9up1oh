import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBagIcon,
  HomeIcon,
  UserIcon,
  ShoppingCartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {children}
      
      <nav className="nav-bar">
        <Link to="/market" className="nav-item">
          <ShoppingCartIcon />
          <span>Market</span>
        </Link>
        <Link to="/misc" className="nav-item">
          <SparklesIcon />
          <span>Misc</span>
        </Link>
        <Link to="/" className="nav-item">
          <div className="w-10 h-10 bg-black rounded-full -mt-8 flex items-center justify-center">
            🕷️
          </div>
          <span>Spider</span>
        </Link>
        <Link to="/bag" className="nav-item">
          <ShoppingBagIcon />
          <span>Bag</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <UserIcon />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default Layout;