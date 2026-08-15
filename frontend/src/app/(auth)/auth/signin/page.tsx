'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { FullPageSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { GoogleIcon } from '@/components/ui/GoogleIcon'
import { PasswordToggle } from '@/components/ui/PasswordToggle'

export default function SignInPage() {
  const router = useRouter()
  const { user, loading, signInWithEmail, signInWithGoogle } = useAuth()

  // Presentation-only: toggles the input's `type`. Does not touch the
  // registered value, so form state and validation are unaffected.
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [loading, user, router])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('verification') === 'sent') {
      toast.success('Verification email sent. Verify your email, then sign in.')
    }
  }, [])

  if (loading) return <FullPageSpinner />

  const onSubmit = async (data: LoginInput) => {
    try {
      await signInWithEmail(data.email, data.password)
      toast.success('Signed in successfully')
      router.replace('/dashboard')
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('email-not-verified')) {
        toast.error('Please verify your email before signing in.')
      } else {
        toast.error('Invalid email or password')
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true)
    try {
      await signInWithGoogle()
      router.replace('/dashboard')
    } catch {
      toast.error('Google sign-in failed. Please try again.')
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  const busy = isSubmitting || isGoogleSubmitting

  return (
    <div>
      <header className="space-y-2">
        <h1 className="display text-ink text-3xl">Sign in</h1>
        <p className="text-ink-muted text-sm">Enter your credentials to continue.</p>
      </header>

      <Button
        type="button"
        variant="outline"
        size="lg"
        block
        onClick={handleGoogleSignIn}
        disabled={busy}
        className="mt-8"
      >
        {isGoogleSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </Button>

      <div className="relative my-7">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <span className="border-line w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface text-ink-subtle px-3 text-xs tracking-[0.14em] uppercase">
            or
          </span>
        </div>
      </div>

      {/* No `noValidate` here, deliberately: adding it would suppress the
          browser's native constraint checks and change validation behaviour,
          which is out of scope per the spec. See follow-ups in the handover. */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field htmlFor="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="you@example.com"
            {...register('email')}
          />
        </Field>

        <Field htmlFor="password" label="Password" error={errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              placeholder="••••••••"
              className="pr-11"
              {...register('password')}
            />
            <PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>
        </Field>

        <Button type="submit" size="lg" block disabled={busy} className="mt-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-ink-muted mt-8 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/signup"
          className="text-ink decoration-line-strong hover:decoration-ink rounded-sm font-medium underline underline-offset-4 transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
