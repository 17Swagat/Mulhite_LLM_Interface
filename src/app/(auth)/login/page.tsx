import { LoginForm } from "@/components/my/login-form"; // My Remove
import { SignIn } from "@clerk/nextjs";
export default function LoginPage() {
  return (
    <div className="text-white dark bg-purple-500 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignIn routing="hash" />
      </div>
    </div>
  );
}
