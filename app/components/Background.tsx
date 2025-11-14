"use client";

import React from "react";

type BackgroundProp = {
  children: React.ReactNode;
};

export default function Background({ children }: BackgroundProp) {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black -mt-30">
      <main className="flex w-full max-w-3xl flex-col justify-between py-60 px-16 bg-white dark:bg-black sm:items-start">
        {children}
      </main>
    </div>
  );
}
