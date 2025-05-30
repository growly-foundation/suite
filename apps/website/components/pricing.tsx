import { Bot, Database, Shield, Users } from 'lucide-react';

import ContactForm from './contact-form';

export const Pricing = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-muted/50 dark:bg-muted/10"
      aria-labelledby="contact-heading">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2
                id="contact-heading"
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Custom Enterprise Pricing
              </h2>
              <p className="text-muted-foreground md:text-xl">
                We offer tailored pricing packages for enterprises and government agencies based on
                your specific needs and scale.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Unlimited users with role-based access control</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <span>Customizable knowledge base size</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>Access to all LLM models</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Enterprise-grade security and compliance</span>
              </div>
            </div>
            <div className="pt-4">
              <p className="font-medium">
                Contact us for a personalized quote and to discuss your specific requirements.
              </p>
            </div>
          </div>
          <div className="lg:ml-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};
