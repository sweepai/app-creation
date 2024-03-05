"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";
import { useState } from "react";

const DEFAULT_CONFIG = {
      name: "sweep-ai-self-hosted",
      url: "https://docs.sweep.dev/usage/deployment",
      public: true,
      default_permissions: {
        administration: "read",
        actions: "read",
        checks: "read",
        contents: "write",
        issues: "write",
        metadata: "read",
        pull_requests: "write",
        statuses: "read",
        workflows: "write"
      },
      default_events: [
        "check_run",
        "check_suite",
        "commit_comment",
        "issue_comment",
        "issues",
        "label",
        "pull_request",
        "pull_request_review",
        "pull_request_review_comment",
        "pull_request_review_thread",
        "push",
        "status",
        "workflow_job",
        "workflow_run"
      ],
      redirect_url: "http://localhost:3000/redirect",
      hook_attributes: {
        url: "https://example.com/github/events",
      },
    }
  
const DEFAULT_CONFIG_STRING = JSON.stringify(DEFAULT_CONFIG)

export default function Home() {
  const [organizationName, setOrganizationName] = useState("");
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      {/* <div className="relative flex place-items-center before:absolute before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"> */}
      {/* <div>
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={10}
          priority
        />
      </div> */}
      <Tabs defaultValue="individual" className="w-[600px]">
        <a href="https://docs.sweep.dev/deployment">
          <div className="flex justify-around mb-16">
            <img src="sweeping.gif" alt="Sweep's logo" className="rounded-full bg-zinc-900 h-[250px] w-[250px]"/>
          </div>
        </a>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
        </TabsList>
        <TabsContent value="individual" >
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Individual GitHub Account</CardTitle>
              <CardDescription>
                Register a self-hosted Sweep GitHub App under your own account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action="https://github.com/settings/apps/new" method="post">
                <input type="text" name="manifest" id="manifest" value={DEFAULT_CONFIG_STRING} hidden/>
                <br/>
                <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white">
                  Create App
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="organization">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Organization GitHub Account</CardTitle>
              <CardDescription>
                Register a self-hosted Sweep GitHub App under an organization account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label>Organization Name</Label>
              <Input type="text" placeholder="Name of organization e.g. 'sweepai'" value={organizationName} onChange={(e) => {
                setOrganizationName(e.target.value)}
              } />
              <form action={`https://github.com/organizations/${organizationName}/settings/apps/new`} method="post">
                <input type="text" name="manifest" id="manifest" value={DEFAULT_CONFIG_STRING} hidden/>
                <br/>
                <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white">
                  Create App
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
