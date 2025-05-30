import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import PrivacyPolicyTemplate from '@/components/privacy-policy-template';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Growly Suite',
  description: 'Our commitment to protecting your privacy and securing your data.',
};

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <div className="mb-8">
              <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            </div>

            <PrivacyPolicyTemplate
              companyName="Growly Suite"
              websiteUrl="https://getgrowly.app"
              contactEmail="getgrowly@gmail.com"
              contactAddress={`Growly Foundation, Inc.\n123 AI Boulevard\nTech City, CA 94000\nUnited States`}
              lastUpdated={currentDate}
              includeGDPR={true}
              includeCCPA={true}
              includeCookies={true}
              includeAnalytics={true}
              includeThirdPartyServices={['OpenAI', 'Google Analytics', 'AWS', 'Base', 'x402']}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
