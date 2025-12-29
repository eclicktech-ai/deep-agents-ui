import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/client';

/**
 * 将 OAuth 授权码交换为访问令牌
 * 调用后端 API: POST /api/auth/oauth/gsc/exchange
 */
async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type?: string;
  scope?: string;
}> {
  try {
    const response = await apiClient.post<{
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      token_type?: string;
      scope?: string;
    }>('/auth/oauth/gsc/exchange', {
      code,
    });
    return response;
  } catch (error: any) {
    console.error('[GSC] Failed to exchange code for tokens:', error);
    throw new Error(`Failed to exchange code for tokens: ${error.message || 'Unknown error'}`);
  }
}

/**
 * 获取用户在 Google Search Console 中授权的站点列表
 * 调用 Google Search Console API
 */
async function listGSCSites(accessToken: string): Promise<Array<{
  siteUrl: string;
  permissionLevel: string;
}>> {
  try {
    const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Google Search Console API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    // Google Search Console API 返回格式: { siteEntry: [{ siteUrl, permissionLevel }] }
    return data.siteEntry || [];
  } catch (error: any) {
    console.error('[GSC] Failed to list sites:', error);
    throw new Error(`Failed to list GSC sites: ${error.message || 'Unknown error'}`);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.json({ error: `Google OAuth error: ${error}` }, { status: 400 });
    }

    if (!code || !state) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    // Decode state
    const { userId, conversationId } = JSON.parse(Buffer.from(state, 'base64').toString());

    if (!userId) {
      return NextResponse.json({ error: 'Invalid state: missing userId' }, { status: 400 });
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    const expiryDate = Date.now() + (tokens.expires_in * 1000);

    // Get authorized sites
    const sites = await listGSCSites(tokens.access_token);

    // Save tokens and sites to backend (if API endpoint exists)
    // Note: This assumes the backend has an endpoint to save GSC credentials
    // If not, you may need to add this functionality to the backend first
    try {

      console.log('[GSC] Tokens and sites retrieved:', {
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        sitesCount: sites.length,
        expiryDate: new Date(expiryDate).toISOString(),
      });
    } catch (saveError) {
      // 如果保存失败，记录错误但不阻止重定向
      console.warn('[GSC] Failed to save credentials to backend:', saveError);
    }

    // Redirect back to the app (chat page)
    const redirectUrl = new URL('/', req.url);
    if (conversationId) redirectUrl.searchParams.set('c', conversationId);
    redirectUrl.searchParams.set('gsc_success', 'true');

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('[GSC Callback] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to complete GSC authorization',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

