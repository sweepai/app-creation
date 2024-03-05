"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Octokit } from "@octokit/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ENV_TEMPLATE = `# Installation page: {INSTALLATION_URL}
# Settings page: {SETTINGS_URL}
GITHUB_APP_ID={GITHUB_APP_ID}
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
  
export default function App() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")!
  const [envContents, setEnvContents] = useState("")
  const [htmlUrl, setHtmlUrl] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  useEffect(() => {
    (async () => {
      try {
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
          .replace("{GITHUB_APP_PEM}", github_app_pem.replace(/\n/g, "\\n").trim())
          .replace("{GITHUB_BOT_USERNAME}", github_bot_username)
          .replace("{INSTALLATION_URL}", html_url)
          .replace("{SETTINGS_URL}", html_url.replace("/apps", "/settings/apps"))
        setEnvContents(env)
        download(".env", env)
      } catch (e: any) {
        setErrorMessage(JSON.stringify(e))
      }
    })()
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      {envContents.length > 0 ? (
        <div className="max-w-[800px]">
          <h2 className="text-xl font-bold mb-2">
            🎉 Successfully created GitHub App!
          </h2>
          You can install your new GitHub App <Button onClick={() => window.location.href = htmlUrl} variant="link" className="p-0 text-blue-600">here</Button> or manage the settings <Button onClick={() => window.location.href = htmlUrl.replace("/apps", "/settings/apps")} variant="link" className="p-0 text-blue-600">here</Button>.
          <br/>
           {/* If it did not, click <Button onClick={() => download(".env", envContents)} variant="link" className="p-0 text-blue-600">here</Button>. */}
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger><span>Your <code>.env</code> secrets file should have automatically downloaded. If it did not, view your secrets here.</span></AccordionTrigger>
              <AccordionContent>
                <pre className="font-mono bg-zinc-900 p-4 rounded whitespace-pre-wrap break-all w-full">
                  <code>
                  {envContents}
                  </code>
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <br/>
          For next steps, rename your downloaded file to <code>.env</code> and place it in the root of the Sweep GitHub repo. Then, continue <Button onClick={() => window.location.href = "https://docs.sweep.dev/deployment"} variant="link" className="p-0 text-blue-600">here</Button>.
        </div>
      ) : (
        <span>
          {errorMessage.length > 0 ? (
            <span>{errorMessage}</span>
          ): (
            <span>
              Creating GitHub App...
            </span>
          )}
        </span>
      )}
    </main>
  );
}
