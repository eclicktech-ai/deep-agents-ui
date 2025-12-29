import { NextRequest, NextResponse } from 'next/server';

/**
 * DELETE /api/admin/clear-project-context
 * Proxy endpoint to clear project context (admin only)
 * This bypasses CORS restrictions by making requests from the server side
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get project ID from query params
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    console.log('[Admin API] Clear project context request:', { projectId });

    if (!projectId) {
      console.error('[Admin API] Missing project ID');
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Get authorization token from request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('[Admin API] Missing authorization header');
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Get API base URL
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://seenos.seokit.tech/api';
    const targetUrl = `${apiBaseUrl}/context/admin/projects/${projectId}/context`;
    
    console.log('[Admin API] Calling backend:', { targetUrl, hasAuth: !!authHeader });

    // Make the request to the backend API
    let response: Response;
    try {
      response = await fetch(targetUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });
      console.log('[Admin API] Backend response status:', response.status);
    } catch (fetchError) {
      console.error('[Admin API] Fetch error:', fetchError);
      return NextResponse.json(
        { 
          error: 'Failed to connect to backend API',
          details: fetchError instanceof Error ? fetchError.message : String(fetchError)
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      let errorData: { error?: { code?: string; message?: string }; message?: string; detail?: string } = {};
      try {
        const text = await response.text();
        console.error('[Admin API] Backend error response:', { status: response.status, text });
        if (text) {
          errorData = JSON.parse(text);
        }
      } catch (parseError) {
        console.error('[Admin API] Failed to parse error response:', parseError);
      }

      const errorMessage = errorData.error?.message || errorData.message || errorData.detail || `HTTP ${response.status}`;
      
      return NextResponse.json(
        { error: errorMessage, code: errorData.error?.code, status: response.status },
        { status: response.status }
      );
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        console.log('[Admin API] Success:', data);
        return NextResponse.json(data);
      } catch (parseError) {
        console.error('[Admin API] Failed to parse success response:', parseError);
        return NextResponse.json(
          { error: 'Failed to parse backend response' },
          { status: 500 }
        );
      }
    }

    console.log('[Admin API] Success (no JSON body)');
    return NextResponse.json({ message: 'Project context cleared successfully' });
  } catch (error) {
    console.error('[Admin API] Unexpected error clearing project context:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to clear project context';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorStack,
        type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  }
}

