import React from 'react';
import { Metadata } from 'next';
import { GetAllProjects } from "@/actions/getAllProjects";

import IntroClient from './intro-client';
// Force dynamic fetch to keep database records fresh
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Talha Codes | 3D Cinematic Portfolio Experience",
  description: "Experience the interactive, generative, and cinematic 3D walkthrough of Talha's engineering portfolio, featured projects, and tech architectures.",
  openGraph: {
    title: "Talha Codes | 3D Cinematic Portfolio Experience",
    description: "Interactive 3D cinematic walkthrough of Talha's engineering portfolio, featuring Three.js particles, Tone.js generative audio, and GSAP orchestrated animations.",
    url: "https://talhacodes.site/intro",
  }
};


export default async function IntroPage() {
  const projects = await GetAllProjects('all');

  return (
    <div className="w-full h-screen overflow-hidden bg-[#020617] text-white select-none">
      <IntroClient initialProjects={projects} />
    </div>
  );
}
