import type { Metadata } from "next";
import { resumeKeywords } from "@/constant";
import { generateResumeStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Resume - Chandan Kumar Behera",
  description:
    "View and download Chandan Kumar Behera's professional resume. AI Engineer & Full-Stack developer with expertise in Python, TypeScript, LangChain, React, Next.js, and multi-agent AI systems.",
  keywords: resumeKeywords,
  openGraph: {
    title: "Resume - Chandan Kumar Behera",
    description:
      "View and download Chandan Kumar Behera's professional resume featuring his experience and skills as a student developer.",
    url: "https://sirius-portfolio.onrender.com/resume",
    siteName: "Chandan Kumar Behera",
    images: [
      {
        url: "/images/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Chandan Kumar Behera Resume",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume - Chandan Kumar Behera",
    description:
      "View Chandan Kumar Behera's professional resume and experience as a student developer.",
    images: ["/images/thumbnail.png"],
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resumeStructuredData = generateResumeStructuredData();

  return (
    <>
      {/* Preload the PDF for better performance */}
      <link
        rel="preload"
        href="/docs/Chandan_Kumar_Behera.pdf"
        as="document"
        type="application/pdf"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(resumeStructuredData),
        }}
      />
      {children}
    </>
  );
}
