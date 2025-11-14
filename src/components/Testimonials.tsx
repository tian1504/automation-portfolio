import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO at TechStartup Inc",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    content: "Eleazar transformed our operations completely. His automation solutions saved us over 500 hours per month and allowed our team to focus on high-value work. Absolutely exceptional!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Operations Manager at GlobalCorp",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    content: "Working with Eleazar was a game-changer. He understood our complex workflows and delivered elegant automation solutions that just work. Highly recommend!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Founder at DataDriven Solutions",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    content: "The AI integrations Eleazar built for us have revolutionized how we handle customer inquiries. Response times dropped from hours to minutes, and customer satisfaction soared.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "CTO at InnovateLab",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    content: "Eleazar's expertise in workflow automation is unmatched. He delivered a complex multi-platform integration ahead of schedule and under budget. True professional!",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "Marketing Director at GrowthHub",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80",
    content: "The marketing automation workflows Eleazar created eliminated hours of manual work. Our campaigns are now more efficient and data-driven. Couldn't be happier!",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Product Manager at CloudTech",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    content: "Eleazar doesn't just implement solutions—he truly understands business needs. His automations have become essential to our daily operations. Outstanding work!",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Client Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it—here's what clients have to say about working together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border card-hover relative">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
