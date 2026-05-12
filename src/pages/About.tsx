import { Link } from "react-router-dom";
import { ArrowLeft, Code, GraduationCap, Heart, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="ide-header px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Editor
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/about" className="text-primary font-semibold">About</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          <Link to="/terms" className="hover:text-primary">Terms</Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">About Me</h1>
        <p className="text-muted-foreground mb-8">The person behind this editor.</p>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold python-logo-gradient">LAVISH KUMAR</h2>
            <p className="text-muted-foreground">Student • Web Developer • Coding Enthusiast</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-md bg-secondary/50">
              <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Education</h3>
                <p className="text-sm text-muted-foreground">Currently studying in Class 12</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-md bg-secondary/50">
              <Globe className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Web Developer</h3>
                <p className="text-sm text-muted-foreground">Building modern web apps with React, JavaScript, and Python</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-md bg-secondary/50">
              <Code className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Coding Lover</h3>
                <p className="text-sm text-muted-foreground">Passionate about Python, MySQL, and full-stack development</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-md bg-secondary/50">
              <Heart className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Hobbies</h3>
                <p className="text-sm text-muted-foreground">Exploring new technologies, problem solving, and learning algorithms</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">My Story</h3>
            <p className="text-muted-foreground leading-relaxed">
              Hi! I'm Lavish Kumar, a Class 12 student with a deep passion for technology and coding.
              I started my journey into programming at a young age and quickly fell in love with how
              code can turn ideas into reality. I built this Python &amp; MySQL editor to make it easier
              for students like me to learn and practice coding right in the browser — no setup needed.
              When I'm not studying, you'll find me building websites, exploring new frameworks, or
              solving coding challenges.
            </p>
          </div>

          <div className="p-4 rounded-md bg-secondary/50 border border-primary/20">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Class 12 Syllabus Resource
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Check out my other website to access the complete Class 12 syllabus and study material:
            </p>
            <a
              href="https://cslearners.lovable.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm font-medium break-all"
            >
              https://cslearners.lovable.app/
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
