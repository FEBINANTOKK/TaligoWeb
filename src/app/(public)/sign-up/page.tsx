// "use client";

// import { useState, type FormEvent } from "react";
// import { signUp } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function SignUpPage() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const { error: signUpError } = await signUp.email({
//         name,
//         email,
//         password,
//       });

//       if (signUpError) {
//         setError(signUpError.message ?? "Sign up failed");
//         return;
//       }

//       router.push("/dashboard");
//     } catch {
//       setError("An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <div className="w-full max-w-[400px] p-8 border border-gray-200 rounded-lg">
//         <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

//         {error && (
//           <div className="p-3 mb-4 rounded bg-red-50 text-red-700 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div className="flex flex-col gap-1">
//             <label htmlFor="name" className="text-sm font-semibold">
//               Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               placeholder="John Doe"
//               className="px-3 py-2 border border-gray-300 rounded text-base"
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label htmlFor="email" className="text-sm font-semibold">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="you@example.com"
//               className="px-3 py-2 border border-gray-300 rounded text-base"
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label htmlFor="password" className="text-sm font-semibold">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               minLength={8}
//               placeholder="••••••••"
//               className="px-3 py-2 border border-gray-300 rounded text-base"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="py-3 border-none rounded bg-blue-500 text-white text-base font-semibold cursor-pointer"
//           >
//             {loading ? "Creating account..." : "Sign Up"}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm">
//           Already have an account?{" "}
//           <Link href="/sign-in" className="text-blue-500 no-underline">
//             Sign In
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, type FormEvent } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agree) {
      setError("You must accept terms");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error: signUpError } = await signUp.email({
        name,
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message ?? "Sign up failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              ✦
            </div>
            <span className="font-semibold text-lg">Taligo</span>
          </div>

          <h1 className="text-2xl font-bold">Begin your journey.</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join the elite network of talent curated by intelligence.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 mb-4 rounded bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background"
            />
          </div>

          {/* Password row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Confirm</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            I agree to the{" "}
            <span className="text-primary underline cursor-pointer">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-primary underline cursor-pointer">
              Privacy Policy
            </span>
          </label>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register →"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
