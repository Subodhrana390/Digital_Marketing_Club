"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Loader2 } from "lucide-react";
import { getSuggestedTitles } from "@/app/actions";

const initialState = {
  titles: [],
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Ideas...
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" />
          Suggest Titles
        </>
      )}
    </Button>
  );
}

export default function IdeationToolPage() {
  const [state, formAction] = useActionState(getSuggestedTitles, initialState);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Content Ideation Tool</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Stuck on what to write about? Enter some keywords and let our AI suggest blog titles for you.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form action={formAction} className="space-y-4">
              <Textarea
                name="keywords"
                placeholder="e.g., social media trends, AI in marketing, gen-z advertising"
                rows={4}
                className="bg-background"
              />
              {state?.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        {state.titles && state.titles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 font-headline">Suggested Titles</h2>
            <div className="grid gap-4">
              {state.titles.map((title, index) => (
                <Card key={index} className="bg-card">
                  <CardContent className="p-4">
                    <p className="font-medium">{title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
