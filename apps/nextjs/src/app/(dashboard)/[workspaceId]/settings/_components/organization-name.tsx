"use client";

import * as React from "react";
import { useOrganization } from "@clerk/nextjs";

import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { useToast } from "@acme/ui/use-toast";

export function OrganizationName(props: { name: string; orgId: string }) {
  const { organization } = useOrganization();
  const [updating, setUpdating] = React.useState(false);
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Name</CardTitle>
        <CardDescription>Change the name of your organization</CardDescription>
      </CardHeader>

      <form
        className="flex flex-col space-y-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const name = new FormData(e.currentTarget).get("name");
          if (!name || typeof name !== "string") return;
          setUpdating(true);
          await organization?.update({ name, slug: props.orgId });
          setUpdating(false);
          toast({
            title: "Organization name updated",
            description: "Your organization name has been updated.",
          });
        }}
      >
        <CardContent>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={props.name} />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">
            {updating && (
              <div className="mr-1" role="status">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-r-transparent" />
              </div>
            )}
            Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
