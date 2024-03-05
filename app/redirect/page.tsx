"use client"

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Octokit } from "@octokit/core";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ENV_TEMPLATE = `GITHUB_APP_ID={GITHUB_APP_ID}
GITHUB_APP_PEM={GITHUB_APP_PEM}
GITHUB_BOT_USERNAME={GITHUB_BOT_USERNAME}`

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
  
export default function Home() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")!
  const [isLoaded, setIsLoaded] = useState(false)
  const [envContents, setEnvContents] = useState("Test")
  const [htmlUrl, setHtmlUrl] = useState("")
  useEffect(() => {
    (async () => {
      const octokit = new Octokit()
      const result = await octokit.request('POST /app-manifests/{code}/conversions', {
        code,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      const { client_id, client_secret, pem: github_app_pem, id: github_app_id, name: github_bot_username, html_url } = result.data
      setHtmlUrl(html_url)
      const env = ENV_TEMPLATE
        .replace("{GITHUB_APP_ID}", JSON.stringify(github_app_id))
        .replace("{GITHUB_APP_PEM}", github_app_pem)
        .replace("{GITHUB_BOT_USERNAME}", github_bot_username)
      setEnvContents(env)
      download(".env", env)
    })()
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      {envContents.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mb-2">
            🎉 Successfully created GitHub App!
          </h2>
          You can view your GitHub App <Button onClick={() => window.location.href = htmlUrl} variant="link" className="p-0 text-blue-600">here</Button>.
          <br/>
          Your <code>.env</code> secrets file should have automatically downloaded. If it did not, click <Button onClick={() => download(".env", envContents)} variant="link" className="p-0 text-blue-600">here</Button>.
          <br/>
          For next steps, rename your downloaded file to <code>.env</code> and place it in the root of the Sweep GitHub repo.
        </div>
      ) : (
        <span>
          Loading...
        </span>
      )}
    </main>
  );
}
