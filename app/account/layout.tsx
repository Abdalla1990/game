'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import Loading from './loading';

type AccountLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AccountLayout({ children }: AccountLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();

  const navigationItems = [
    { label: 'Dashboard', path: '/account', icon: '📊' },
    { label: 'Create Round', path: '/account/create-round', icon: '🎮' },
    { label: 'Edit Profile', path: '/account/edit', icon: '✏️' },
    { label: 'Payment Info', path: '/account/payment', icon: '💳' },
    { label: 'Reset Password', path: '/account/reset-password', icon: '🔒' },
    { label: 'Delete Account', path: '/account/delete', icon: '🗑️' },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Account</h2>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={pathname === item.path ? 'primary' : 'secondary'}
                  fullWidth
                  className="justify-start text-left"
                  onClick={() => router.push(item.path)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
              <Button
                variant="danger"
                fullWidth
                className="mt-6"
                onClick={handleSignOut}
              >
                <span className="mr-2">👋</span>
                <span>Sign Out</span>
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
