"use client"

import { Suspense } from "react";
import App from "./App";
  
export default function Home() {
  return (
    <Suspense fallback={<span>Error loading page.</span>}>
      <App/>
    </Suspense>
  );
}
