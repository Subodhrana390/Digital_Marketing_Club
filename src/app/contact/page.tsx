"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/app/actions";
import { Loader2, Mail, User, MessageSquare, MapPin } from "lucide-react";

const initialState = {
  message: "",
  errors: {},
  reset: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        "Send Message"
      )}
    </Button>
  );
}

export default function ContactPage() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (
      state.message &&
      (!state.errors || Object.keys(state.errors).length === 0)
    ) {
      toast({
        title: "Message Sent!",
        description: state.message,
        variant: "success",
      });
      if (state.reset && formRef.current) {
        formRef.current.reset();
      }
    } else if (
      state.message &&
      state.errors &&
      Object.keys(state.errors).length > 0
    ) {
      toast({
        title: "Validation Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Contact{" "}
            <span className="text-blue-600">Digital Marketing Club</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our events, membership, or collaborations?
            Reach out to us!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="bg-white rounded-xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Our Information
              </CardTitle>
              <CardDescription>
                Connect with the Digital Marketing Club at GNDEC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Location</h3>
                  <p className="text-gray-600">
                    Guru Nanak Dev Engineering College
                    <br />
                    Gill Park, Ludhiana, Punjab 141006
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">dmc@gndec.ac.in</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Faculty Coordinator
                  </h3>
                  <p className="text-gray-600">
                    Dr. XYZ ABC
                    <br />
                    Department of Management Studies
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Club Hours</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <span className="font-medium">Monday-Friday:</span> 9:00 AM
                    - 5:00 PM
                    <br />
                    <span className="font-medium">Saturday:</span> 10:00 AM -
                    2:00 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="bg-white rounded-xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Send Us a Message
              </CardTitle>
              <CardDescription>
                We typically respond within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    className="py-5 px-4 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  {state?.errors?.name && (
                    <p className="text-sm font-medium text-red-600">
                      {state.errors.name[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="py-5 px-4 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  {state?.errors?.email && (
                    <p className="text-sm font-medium text-red-600">
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="py-3 px-4 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  {state?.errors?.message && (
                    <p className="text-sm font-medium text-red-600">
                      {state.errors.message[0]}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <SubmitButton />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
