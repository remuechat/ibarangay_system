"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Logob from "@/public/logob.png"

export default function Home() {
  const router = useRouter();
  const handleGetStartedSignup = () => {
  router.push("/signup"); };
  const handleGetStartedLogin = () => {
  router.push("/login"); };
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      {/* NAVBAR */}
      <nav className="w-full border-b border-white/10 backdrop-blur bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-2">
            <Image
            src="/logob.png"
            alt="Logo"
            width={70}
            height={40}
            className="object-contain" />
            <span className="text-x1 font-semibold">iBarangay</span>
          </div>

          <div className="hidden md:flex gap-8 text-sm text-gray-300">
            <a href="#" className="hover:text-white">Features</a>
            <a href="#" className="hover:text-white">Services</a>
            <a href="#" className="hover:text-white">About</a>
          </div>

          <Button 
            onClick={handleGetStartedLogin}
            className="bg-white/10 hover:bg-white/20 text-white">
            Login
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-28 pb-40">
        {/*background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-600 to-purple-700 animate-gradient-slow blur-3xl opacity-70"></div>

        <div className="relative text-center max-w-3xl mx-auto px-6">
          <div className="px-4 py-1 mx-auto mb-4 bg-white/10 rounded-full w-max text-xs text-blue-200">
            NEW • Introducing iBarangay System
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            The barangay is <br /> your service center.
          </h2>

          <p className="text-gray-300 mt-6 text-lg max-w-xl mx-auto">
            A smarter way to manage records, documents, incidents, and community services — all in one digital system.
          </p>

          <Button
            onClick={handleGetStartedSignup}
            className="mt-10 px-8 py-6 text-lg rounded-xl bg-blue-600 hover:bg-blue-700">
              Get started
            </Button>
        </div>

        {/* FLOATING CARDS */}
        <div className="relative max-w-5xl mx-auto mt-24 px-6">
          {/* Main dashboard preview box */}
          <div className="bg-black/40 border border-white/10 rounded-2xl h-[380px] w-full backdrop-blur-lg shadow-xl"></div>

          {/* Resident Profile Card */}
          <Card className="absolute top-10 -left-6 w-48 bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-lg">
            <CardContent className="p-4 text-sm">
              <p className="opacity-75 mb-1">Resident Profile</p>
              <p className="font-medium text-white">Mark Santos</p>
              <p className="text-xs mt-2 text-gray-300">Zone 3, Mabuhay St.</p>
            </CardContent>
          </Card>

          {/* Certificate Request Card */}
          <Card className="absolute top-12 -right-8 w-56 bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-lg">
            <CardContent className="p-4 text-sm">
              <p className="font-medium">Barangay Certificate</p>
              <p className="text-xs text-gray-300 mt-1">Request submitted</p>
            </CardContent>
          </Card>

          {/* Notification Card */}
          <Card className="absolute -bottom-6 right-12 w-52 bg-yellow-500/20 border-yellow-500/30 backdrop-blur-xl text-yellow-200 shadow-lg">
            <CardContent className="p-4 text-sm">
              <p className="font-medium">New Incident Report</p>
              <p className="text-xs mt-1">Filed 2 mins ago</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
