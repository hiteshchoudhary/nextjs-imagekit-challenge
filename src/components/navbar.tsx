// src/components/navbar.tsx

"use client"; // Make this a Client Component

import { useSession } from "next-auth/react"; // Import the client-side hook

import { LoginButton, SignupButton, UserNav } from "./auth-components";
import Logo from "./logo";
import { ThemeSwitch } from "./theme-switch";
import UploadButton from "./upload/upload-button";

const Navbar = () => {
  const { data: session } = useSession(); // Get session data on the client

  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-6 py-4 backdrop-blur-md lg:px-8">
      <Logo />
      <div className="flex items-center gap-2.5">
        <ThemeSwitch />
        {/* The UploadButton will only be rendered if a session exists */}
        {session?.user && <UploadButton />}
        <div className="flex min-w-8">
          {session?.user ? <UserNav user={session.user} /> : <div className="flex gap-2"><LoginButton /> <SignupButton /></div> }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
