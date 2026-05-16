import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Github, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const feedbackSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = feedbackSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Please check your input",
        description: parsed.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast({ title: "Failed to send", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Feedback sent!", description: "Thanks — Lavish will read it soon." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="ide-header px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Editor
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/contact" className="text-primary font-semibold">Contact</Link>
          <Link to="/terms" className="hover:text-primary">Terms</Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Get in Touch</h1>
          <p className="text-muted-foreground">Have a question, feedback, or want to collaborate? Reach out!</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 space-y-4">
          <a href="mailto:lavishkumar1232@gmail.com" className="flex items-center gap-4 p-4 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">lavishkumar1232@gmail.com</p>
            </div>
          </a>

          <a href="tel:+918630091253" className="flex items-center gap-4 p-4 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-sm text-muted-foreground">+91 86300 91253</p>
            </div>
          </a>

          <div className="flex items-center gap-4 p-4 rounded-md bg-secondary/50">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p className="text-sm text-muted-foreground">India</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-md bg-secondary/50">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Github className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Developer</h3>
              <p className="text-sm text-muted-foreground">Lavish Kumar — Student & Web Developer</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 space-y-5">
          <div>
            <h2 className="text-2xl font-bold">Send Feedback</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your message will be delivered straight to Lavish.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jane Doe"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              maxLength={255}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Share your feedback, suggestions, or questions..."
              rows={5}
              maxLength={2000}
              required
            />
            <p className="text-xs text-muted-foreground text-right">{form.message.length}/2000</p>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
            ) : (
              <><Send className="w-4 h-4" /> Send Feedback</>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Contact;
