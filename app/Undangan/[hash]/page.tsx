"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function HashPageRedirect() {
  const params = useParams();
  const router = useRouter();
  const hash = Array.isArray(params.hash) ? params.hash[0] : (params.hash ?? "");

  useEffect(() => {
    if (hash) {
      sessionStorage.setItem("invitation-hash", hash);
      router.replace(`/Undangan/opening?kode=${hash}`);
    } else {
      router.replace("/Undangan/opening");
    }
  }, [hash, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050f20]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-yellow-400" />
    </div>
  );
}
