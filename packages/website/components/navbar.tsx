'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowRight, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Features', href: '#features' },
    { label: 'Install', href: '#install' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'About Us', href: 'https://growly.foundation' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="Enterprise AI Homepage">
            <Image
              src="https://github.com/growly-foundation/assets/blob/main/logo/suite-full.png?raw=true"
              alt="Suite Logo"
              width={100}
              height={100}
            />
          </Link>
        </div>

        <nav className="max-sm:hidden md:flex gap-6" aria-label="Main Navigation">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button
            asChild
            className="max-sm:hidden md:flex gap-3 px-4 py-2 bg-[#0052ff] hover:bg-[#3c79fd] text-white rounded-xl border-0 h-auto dark:bg-[#0052ff] dark:hover:bg-[#0052ff]/90 dark:shadow-[0_0_10px_rgba(36,101,237,0.4)]">
            <Link href="https://suite.getgrowly.app">
              <ArrowRight className="h-4 w-4 text-white" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Getting Started</span>
              </div>
            </Link>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="max-md:hidden">
              <Button variant="outline" size="icon" aria-label="Open Menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8" aria-label="Mobile Navigation">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                ))}
                <div className="flex items-center gap-4 mt-4">
                  <ThemeToggle />
                  <Button
                    asChild
                    className="w-full flex items-center gap-3 px-4 py-2 bg-[#0052ff] hover:bg-[#3c79fd] text-white rounded-xl border-0 h-auto dark:bg-[#0052ff] dark:hover:bg-[#0052ff]/90 dark:shadow-[0_0_10px_rgba(36,101,237,0.4)]">
                    <Link href="https://suite.getgrowly.app" onClick={() => setIsOpen(false)}>
                      <ArrowRight className="h-4 w-4 text-white" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Getting Started</span>
                      </div>
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
