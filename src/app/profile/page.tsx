// src/app/profile/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Spinner } from "@/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if the user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show a loading spinner while the session is being fetched
  if (status === "loading") {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner variant="ring" size={48} />
      </div>
    );
  }

  // Render the profile card once the session is authenticated
  if (status === "authenticated" && session.user) {
    const user = session.user;
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Card className="w-full max-w-md border-pink-300/30 bg-transparent backdrop-blur-lg dark:border-pink-200/15">
          <CardHeader className="text-center">
            <CardTitle className="font-montserrat text-2xl">
              User Profile
            </CardTitle>
            <CardDescription>
              This is your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pt-6">
            <Avatar className="size-24 border-2 border-pink-200/30">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
              <AvatarFallback>
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="w-full space-y-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Return null or a fallback if not authenticated
  return null;
}
