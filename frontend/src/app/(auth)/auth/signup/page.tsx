'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
import { FullPageSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { GoogleIcon } from '@/components/ui/GoogleIcon'
import { PasswordToggle } from '@/components/ui/PasswordToggle'

export default function SignUpPage() {
  const router = useRouter()
  const { user, loading, signUpWithEmail, signInWithGoogle } = useAuth()

  // Presentation-only state: toggles input `type` and button affordances.
  // Never touches the registered values.
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  useEffect(() => {
    if (!loading && !isSubmitting && user) {
      router.replace('/dashboard')
    }
  }, [loading, isSubmitting, user, router])

  if (loading) return <FullPageSpinner />

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

  const onSubmit = async (data: SignupInput) => {
    try {
      await signUpWithEmail(data.email, data.password, data.displayName)
      router.push('/auth/signin?verification=sent')
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('email-already-in-use')) {
        toast.error('An account with this email already exists')
      } else {
        toast.error('Failed to create account. Please try again.')
      }
    }
  }

  const busy = isSubmitting || isGoogleSubmitting

  return (
    <div>
      <header className="space-y-2">
        <h1 className="display text-ink text-3xl">Create account</h1>
        <p className="text-ink-muted text-sm">Get started for free.</p>
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

      {/* As on the signin page, `noValidate` is deliberately omitted so native
          constraint checking behaves exactly as it did before the restyle. */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field htmlFor="displayName" label="Name" error={errors.displayName?.message}>
          <Input
            id="displayName"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.displayName}
            aria-describedby={errors.displayName ? 'displayName-error' : undefined}
            placeholder="Your full name"
            {...register('displayName')}
          />
        </Field>

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
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              placeholder="Min. 8 characters, 1 uppercase, 1 number"
              className="pr-11"
              {...register('password')}
            />
            <PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>
        </Field>

        <Field
          htmlFor="confirmPassword"
          label="Confirm password"
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              placeholder="••••••••"
              className="pr-11"
              {...register('confirmPassword')}
            />
            <PasswordToggle
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((v) => !v)}
              label="confirm password"
            />
          </div>
        </Field>

        <Button type="submit" size="lg" block disabled={busy} className="mt-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-ink-muted mt-8 text-center text-sm">
        Already have an account?{' '}
        <Link
          href="/auth/signin"
          className="text-ink decoration-line-strong hover:decoration-ink rounded-sm font-medium underline underline-offset-4 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
