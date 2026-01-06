"use client";

import type { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";

export default function ClientAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
