"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

// Form schema with zod validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(false); // Reset error state
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(true);
        form.setError("root", {
          type: "manual",
          message: "Invalid email or password",
        });
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(true);
      form.setError("root", {
        type: "manual",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FEF0ED]">
      {/* Left side - Branding */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Image
            src="/nova-dash-logo.png"
            alt="NovaDash Logo"
            width={240}
            height={100}
          />
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center"
        >
          Welcome to NovaDash
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-gray-600 text-center max-w-md"
        >
          The comprehensive dashboard for social network administrators.
          Moderate content, track user activity, and manage your community with
          ease.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col gap-4 items-center"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Powerful tools for:</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E74B3B]"></div>
              <span>Community Moderation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E74B3B]"></div>
              <span>User Activity Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E74B3B]"></div>
              <span>Content Management</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E74B3B]"></div>
              <span>Points & Events</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right side - Login Form */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="w-full max-w-md shadow-lg border-0 bg-white">
          <CardHeader>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the dashboard
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {error && (
                  <motion.div
                    variants={itemVariants}
                    className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm"
                  >
                    {form.formState.errors.root?.message ||
                      "Invalid credentials"}
                  </motion.div>
                )}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="admin@example.com"
                            {...field}
                            className={`bg-white ${
                              error ? "border-red-500" : ""
                            }`}
                            onChange={(e) => {
                              field.onChange(e);
                              setError(false);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className={`bg-white pr-10 ${
                                error ? "border-red-500" : ""
                              }`}
                              onChange={(e) => {
                                field.onChange(e);
                                setError(false);
                              }}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-[#E74B3B] hover:bg-[#d43c2b] text-white cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <motion.div
              variants={itemVariants}
              className="text-sm text-gray-500"
            >
              Admin access only
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
