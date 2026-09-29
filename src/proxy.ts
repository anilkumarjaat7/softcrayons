import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const ROLE_API_PATHS: Record<string, string[]> = {
  ADMIN: ['/api/admin'],
  INSTRUCTOR: ['/api/instructor'],
  COUNSELOR: ['/api/counselor'],
  HR: ['/api/hr'],
  CONTENT_WRITER: ['/api/content-writer'],
  STUDENT: ['/api/student'],
  AGENT: ['/api/agent'],
};

const PROTECTED_API_PATHS = [
  '/api/admin',
  '/api/instructor',
  '/api/counselor',
  '/api/hr',
  '/api/content-writer',
  '/api/student',
  '/api/agent',
];

function isProtectedApiPath(pathname: string): boolean {
  return PROTECTED_API_PATHS.some((path) => pathname.startsWith(path));
}

function getAllowedPathsForRole(role: string): string[] {
  return ROLE_API_PATHS[role] || [];
}

function isRoleAllowedForPath(role: string, pathname: string): boolean {
  const allowedPaths = getAllowedPathsForRole(role);
  return allowedPaths.some((path) => pathname.startsWith(path));
}

function getRoleFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/api\/([^\/]+)/);
  if (match) {
    const pathRole = match[1];
    const pathToRole: Record<string, string> = {
      admin: 'ADMIN',
      instructor: 'INSTRUCTOR',
      counselor: 'COUNSELOR',
      hr: 'HR',
      'content-writer': 'CONTENT_WRITER',
      student: 'STUDENT',
      agent: 'AGENT',
    };
    return pathToRole[pathRole] || null;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isProtectedApiPath(pathname)) {
    return NextResponse.next();
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - Please sign in',
        },
        { status: 401 }
      );
    }

    const user = session.user;
    const userRole = (user.role as string)?.toUpperCase() || 'STUDENT';

    const requiredRole = getRoleFromPath(pathname);

    if (!requiredRole) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid API path',
        },
        { status: 400 }
      );
    }

    const hasAccess = userRole === 'ADMIN' || userRole === requiredRole;

    if (!hasAccess) {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden - Role ${userRole} cannot access ${requiredRole} APIs`,
        },
        { status: 403 }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-email', user.email || '');
    requestHeaders.set('x-user-name', user.name || '');
    requestHeaders.set('x-user-role', userRole);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication error',
      },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/instructor/:path*',
    '/api/counselor/:path*',
    '/api/hr/:path*',
    '/api/content-writer/:path*',
    '/api/student/:path*',
    '/api/agent/:path*',
  ],
};
