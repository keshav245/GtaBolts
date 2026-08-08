import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-mesh-shift opacity-60" />
      <div className="absolute inset-0 bg-void/60" />

      <div className="relative flex flex-col items-center py-16">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-3">// Access panel</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-8 text-center">
          Enter <span className="text-gradient">GtaBolts</span>
        </h1>
        <AuthForm />
      </div>
    </div>
  );
}
