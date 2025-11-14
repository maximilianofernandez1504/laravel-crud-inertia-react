import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import Header from '@/components/header';
import { type BreadcrumbItem } from '@/types';
import "leaflet/dist/leaflet.css";
import { type ReactNode } from 'react';
import CartExpirationWatcher from "@/components/cart-expiration-watcher";

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  user?: { name: string } | null;
  cartCount?: number;
  logoUrl: string;
  cartImageUrl: string;
}

export default function AppLayout({
  children,
  breadcrumbs,
  user,
  cartCount = 0,
  logoUrl,
  cartImageUrl,
  ...props
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-yellow-400">

      {/* 🔥 Activamos el watcher global */}
      <CartExpirationWatcher />

      <Header
        user={user}
        cartCount={cartCount}
        logoUrl={logoUrl}
        cartImageUrl={cartImageUrl}
      />

      <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
      </AppLayoutTemplate>
    </div>
  );
}
