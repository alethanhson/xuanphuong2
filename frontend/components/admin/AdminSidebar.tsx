'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Sản phẩm', path: '/admin/products', icon: Package },
    { name: 'Đơn hàng', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Khách hàng', path: '/admin/customers', icon: Users },
    { name: 'Cài đặt', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div 
      className={`bg-primary text-primary-foreground h-screen 
        ${collapsed ? 'w-16' : 'w-64'} 
        transition-width duration-300 ease-in-out
        flex flex-col relative
      `}
    >
      <div className="py-6 px-4 flex items-center justify-between">
        {!collapsed && (
          <div className="font-bold text-xl">Xuân Phương</div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 bg-primary-foreground/10 rounded hover:bg-primary-foreground/20 ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 py-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`
                      flex items-center p-2 rounded-md
                      ${isActive 
                        ? 'bg-primary-foreground/20 text-primary-foreground' 
                        : 'text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                      }
                      transition-colors
                    `}
                  >
                    <Icon size={20} />
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      <div className="p-4 border-t border-primary-foreground/10">
        {!collapsed && <div className="text-xs opacity-50">Trang quản trị</div>}
      </div>
    </div>
  );
}