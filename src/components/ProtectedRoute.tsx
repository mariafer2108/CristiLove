
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({
  children,
}: Readonly&lt;{
  children: React.ReactNode;
}&gt;) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() =&gt; {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      &lt;div className="min-h-screen flex items-center justify-center"&gt;
        &lt;div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"&gt;&lt;/div&gt;
      &lt;/div&gt;
    );
  }

  return &lt;&gt;{children}&lt;/&gt;;
}
