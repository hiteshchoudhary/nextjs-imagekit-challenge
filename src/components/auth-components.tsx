"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useActionState, useState } from "react";
import type { User } from "next-auth";

import { registerUser } from "@/actions/auth.actions";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import ROUTES from "@/constants/routes";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const inputStyles =
  "dark:bg-transparent backdrop-blur-sm focus-visible:outline-none focus-visible:ring-0 border-pink-300/30 dark:border-pink-200/15 h-9";

function CredentialsForm() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password.");
    } else if (result?.ok) {
      router.refresh();
      router.push("/");
    }

    setIsPending(false);
  };

  return (
    <Card className="w-full max-w-sm border-pink-300/30 bg-transparent backdrop-blur-lg dark:border-pink-200/15">
      <form onSubmit={handleSubmit} >
        <CardHeader>
          <CardTitle className="font-montserrat text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <p className="rounded-md bg-red-900/50 p-2 text-center text-sm text-red-400">
              {error}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              className={inputStyles}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              required
              className={inputStyles}
              placeholder="●●●●●●●●●"
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 mt-3">
          <Button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-gradient-to-bl from-pink-400 to-pink-800 px-5 text-white"
            disabled={isPending}
          >
            {isPending ? "Signing In..." : "Sign in with Email"}
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-pink-400 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
export function LoginForm() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center justify-center gap-4">
      <CredentialsForm />
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-pink-200/15" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="dark:bg-[#190c0f] bg-[#ffe0f1] px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => signIn("github")}
          className="rounded-full cursor-pointer"
        >
          GitHub
        </Button>
        <Button
          variant="outline"
          onClick={() => signIn("google")}
          className="rounded-full cursor-pointer"
        >
          Google
        </Button>
      </div>
    </div>
  );
}

export function RegisterForm() {

  const [formState, formAction] = useActionState(registerUser, undefined);

  return (
   <div className="flex w-full max-w-sm flex-col items-center justify-center gap-4">
     <Card className="w-full max-w-sm border-pink-300/30 bg-transparent backdrop-blur-lg dark:border-pink-200/15">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-montserrat text-2xl">Register</CardTitle>
          <CardDescription>
            Create a new account to start saving your moments.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 mt-2">
          {formState?.error && (
            <p className="rounded-md bg-red-900/50 p-2 text-center text-sm text-red-400">
              {formState.error}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Your Name" required className={inputStyles} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="m@example.com" required className={inputStyles} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" placeholder="●●●●●●●●●●" required className={inputStyles} />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 mt-3">
          <Button type="submit" className="w-full cursor-pointer rounded-full bg-gradient-to-bl from-pink-400 to-pink-800 px-5 text-white">
            Create Account
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-pink-400 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
    <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-pink-200/15" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="dark:bg-[#190c0f] bg-[#ffe0f1] px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => signIn("github")}
          className="rounded-full cursor-pointer"
        >
          GitHub
        </Button>
        <Button
          variant="outline"
          onClick={() => signIn("google")}
          className="rounded-full cursor-pointer"
        >
          Google
        </Button>
      </div>
   </div>

  );
}

export function LoginButton() {
  return (
    <Button
      asChild
      className="cursor-pointer rounded-full bg-gradient-to-bl from-pink-400 to-pink-800 px-5 text-white"
    >
      <Link href="/login">Sign In</Link>
    </Button>
  );
}
export function SignupButton() {
  return (
            <Button
              asChild
              className="cursor-pointer rounded-full bg-gradient-to-bl from-pink-400 to-pink-800 px-4   text-white"
            >
              <Link href="/register">Get Started</Link>
            </Button>
  );
}

export function UserNav({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-9 rounded-full">
          <Avatar className="size-9">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback>
              {user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ROUTES.PROFILE}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
