import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    if (
      path.startsWith('/_next') ||
      path.startsWith('/api') ||
      path.startsWith('/favicon.ico') ||
      path.startsWith('/manifest') ||
      path.includes('.')
    ) {
      return response
    }

    const isProtectedPath =
      path.startsWith('/admin') ||
      path.startsWith('/trainer') ||
      path.startsWith('/client') ||
      path.startsWith('/onboarding')

    const isAuthPath = path.startsWith('/login') || path.startsWith('/register')

    if (!user && isProtectedPath) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', path)
      return NextResponse.redirect(loginUrl)
    }

    if (user) {
      const { data: perfil } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      const role = perfil?.role || 'client'
      const onboardingCompleto = !!perfil?.full_name

      if (isAuthPath) {
        if (role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        if (role === 'trainer') {
          return NextResponse.redirect(new URL('/trainer', request.url))
        }
        return NextResponse.redirect(new URL(onboardingCompleto ? '/client' : '/onboarding', request.url))
      }

      if (path.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
      }

      if (path.startsWith('/trainer') && role !== 'trainer') {
        return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
      }

      if (path.startsWith('/client') && !onboardingCompleto && role === 'client') {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
  } catch (error) {
    console.error('❌ Proxy runtime error:', error)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
