import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Github } from "lucide-react";

const Contact = () => {
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

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Get in Touch</h1>
        <p className="text-muted-foreground mb-8">Have a question, feedback, or want to collaborate? Reach out!</p>

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

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            I usually respond to emails within 24–48 hours. For urgent matters, please call.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Contact;
