import { LoginForm } from '@/components/auth/login-form';
import ProtectedAuthProvider from '@/components/providers/protected-auth-provider';
import { GridBackground, FramerSpotlight } from '@getgrowly/ui';

export default function LoginPage() {
  return (
    <ProtectedAuthProvider>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <GridBackground />
          <FramerSpotlight />
          <LoginForm />
        </div>
      </div>
    </ProtectedAuthProvider>
  );
}
