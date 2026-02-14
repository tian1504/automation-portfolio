import { Mail, Linkedin, Github, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Update this URL when you have your Calendly/TidyCal link
const BOOKING_URL = "https://calendly.com/tian1504/30min";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: "tian1504@gmail.com",
    link: "mailto:tian1504@gmail.com",
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    value: "Connect on LinkedIn",
    link: "https://www.linkedin.com/in/eleazar-sebastian-martinez-76210983/",
  },
  {
    icon: Github,
    title: "GitHub",
    value: "View my repositories",
    link: "https://github.com",
  },
  {
    icon: Calendar,
    title: "Schedule a Call",
    value: "Book a meeting",
    link: BOOKING_URL,
  },
];

export const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-secondary to-background">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to automate your workflows and scale your operations? Let's discuss how I can help transform your business.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} className="p-6 card-hover border-border group">
                  <a
                    href={method.link}
                    target={method.link.startsWith('http') ? '_blank' : undefined}
                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                      <p className="text-muted-foreground text-sm">{method.value}</p>
                    </div>
                  </a>
                </Card>
              );
            })}
          </div>

          <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Automate Your Business?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              I typically respond within 24 hours. Let's schedule a call to discuss your automation needs and how I can help you achieve your goals.
            </p>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <a href={BOOKING_URL}>
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Discovery Call
              </a>
            </Button>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-border">
        <div className="container-custom">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Eleazar Sebastian Martinez. All rights reserved.</p>
            <p className="mt-2">Built with modern web technologies and a passion for automation.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
