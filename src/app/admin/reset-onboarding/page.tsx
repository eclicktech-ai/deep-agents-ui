'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SeenOSLogo } from '@/app/components/SeenOSLogo';

export default function ResetOnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [userId, setUserId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // 检查认证状态
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // 未登录，跳转到登录页
      router.push('/login?redirect=/admin/reset-onboarding');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleReset = async () => {
    if (!userId.trim()) {
      setResult({
        type: 'error',
        message: 'User ID is required',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await apiClient.resetOnboardingStatus(
        userId.trim(),
        projectId.trim() || undefined
      );

      setResult({
        type: 'success',
        message: response.message || 'Onboarding status reset successfully',
      });

      // 清空表单
      setUserId('');
      setProjectId('');
    } catch (error: any) {
      setResult({
        type: 'error',
        message: error.message || 'Failed to reset onboarding status',
      });
    } finally {
      setLoading(false);
    }
  };

  // 等待认证加载
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <SeenOSLogo />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // 检查管理员权限
  const isAdmin = user?.isAdmin ?? false;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <SeenOSLogo />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Reset Onboarding Status</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Admin tool to reset user onboarding progress
          </p>
        </div>

        {/* 当前用户信息 */}
        {user && (
          <div className="rounded-lg border bg-card p-4 text-sm">
            <p className="font-semibold">Current User</p>
            <p className="mt-1 text-muted-foreground">{user.email}</p>
            <p className="mt-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  isAdmin
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {isAdmin ? '✓ Admin' : '✗ Not Admin'}
              </span>
            </p>
          </div>
        )}

        {/* 权限不足提示 */}
        {!isAdmin && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="font-semibold text-destructive">⛔ Permission Denied</p>
            <p className="mt-2 text-sm text-destructive">
              You need administrator privileges to access this page.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please login with an admin account:
            </p>
            <p className="mt-1 text-xs font-mono text-muted-foreground">
              seenos@admin.com
            </p>
            <Button
              onClick={() => router.push('/login?redirect=/admin/reset-onboarding')}
              variant="destructive"
              className="mt-4 w-full"
            >
              Go to Login
            </Button>
          </div>
        )}

        {/* Form - 只有管理员可以看到 */}
        {isAdmin && (
          <>
            <div className="space-y-6 rounded-lg border bg-card p-8 shadow-sm">
              <div className="space-y-2">
                <Label htmlFor="userId">
                  User ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectId">Project ID (Optional)</Label>
                <Input
                  id="projectId"
                  type="text"
                  placeholder="Enter project ID (optional)"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to reset for the current/default project
                </p>
              </div>

              <Button
                onClick={handleReset}
                disabled={loading || !userId.trim()}
                className="w-full"
              >
                {loading ? 'Resetting...' : 'Reset Onboarding Status'}
              </Button>

              {/* Result message */}
              {result && (
                <div
                  className={`rounded-md border p-4 ${
                    result.type === 'success'
                      ? 'border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200'
                      : 'border-destructive bg-destructive/10 text-destructive'
                  }`}
                >
                  <p className="text-sm font-medium">
                    {result.type === 'success' ? '✓ Success' : '✗ Error'}
                  </p>
                  <p className="mt-1 text-sm">{result.message}</p>
                </div>
              )}
            </div>

            {/* Info box */}
            <div className="rounded-lg border border-amber-500/50 bg-amber-50 p-4 text-sm dark:bg-amber-950">
              <p className="font-semibold text-amber-900 dark:text-amber-200">⚠️ Important</p>
              <ul className="mt-2 space-y-1 text-amber-800 dark:text-amber-300">
                <li>• This action clears all onboarding progress</li>
                <li>• User context data (singletons, items, etc.) will NOT be deleted</li>
                <li>• User will need to start the onboarding process again</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

