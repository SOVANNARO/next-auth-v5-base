"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useLoginMutation from "@/hooks/useLoginMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import the icons

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const Login = () => {
  const { login, isPending } = useLoginMutation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmit = async (data: any) => {
    try {
      await login(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to autofill demo credentials
  const useDemoCredentials = () => {
    setValue("email", "john@mail.com");
    setValue("password", "changeme");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message as string}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Loading..." : "Sign In"}
            </Button>
            {/* Demo Credentials Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={useDemoCredentials}
            >
              Use Demo Credentials
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
