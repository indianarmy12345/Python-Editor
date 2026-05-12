import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="ide-header px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Editor
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          <Link to="/terms" className="text-primary font-semibold">Terms</Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Terms &amp; Conditions</h1>
        <p className="text-muted-foreground mb-8">Last updated: May 2026</p>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using this Python &amp; MySQL Editor (the "Service"), you accept and agree
              to be bound by these Terms and Conditions. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Use of the Service</h2>
            <p className="text-muted-foreground">
              This Service is provided for educational and learning purposes. You agree to use it
              responsibly and not to write, run, or distribute any code intended to harm others,
              violate laws, or infringe on the rights of any party.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Code &amp; Data</h2>
            <p className="text-muted-foreground">
              All code execution happens locally in your browser using Pyodide and sql.js. Your code
              and data are not transmitted to any server. You are solely responsible for backing up
              any code you write.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The Service, including its design, branding, and source code, is owned by Lavish Kumar.
              Code you write within the editor remains your own intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              The Service is provided "as is" without warranties of any kind. We do not guarantee
              that the Service will be uninterrupted, error-free, or suitable for any specific purpose.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              In no event shall the developer be liable for any direct, indirect, incidental, or
              consequential damages arising from your use of the Service, including loss of data
              or code.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Third-Party Libraries</h2>
            <p className="text-muted-foreground">
              The Service uses open-source libraries including Pyodide, sql.js, Monaco Editor, and React.
              Each is governed by its own license.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. Continued use of the Service
              after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">9. Contact</h2>
            <p className="text-muted-foreground">
              For any questions about these Terms, please reach out via the{" "}
              <Link to="/contact" className="text-primary hover:underline">Contact</Link> page.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;
