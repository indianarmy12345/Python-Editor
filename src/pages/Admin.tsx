import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogOut, Mail, Loader2, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import type { Session } from "@supabase/supabase-js";

interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const OWNER_EMAIL = "lavishkumar1232@gmail.com";

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => (prev.size === feedback.length ? new Set() : new Set(feedback.map((f) => f.id))));
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} feedback ${selected.size === 1 ? "entry" : "entries"}?`)) return;
    setDeleting(true);
    const ids = Array.from(selected);
    const { error } = await supabase.from("feedback").delete().in("id", ids);
    setDeleting(false);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      setFeedback((prev) => prev.filter((f) => !selected.has(f.id)));
      setSelected(new Set());
      toast({ title: "Deleted", description: `${ids.length} removed.` });
    }
  };


  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setLoadingFeedback(true);
    supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast({ title: "Error loading feedback", description: error.message, variant: "destructive" });
        else setFeedback(data || []);
        setLoadingFeedback(false);
      });
  }, [session]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: `${window.location.origin}/admin` },
            });
      if (error) {
        toast({ title: "Authentication failed", description: error.message, variant: "destructive" });
      } else if (mode === "signup") {
        toast({ title: "Account created", description: "You're signed in." });
      }
    } catch (err: any) {
      toast({ title: "Unexpected error", description: err?.message ?? String(err), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setFeedback([]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <form onSubmit={handleAuth} className="w-full max-w-sm space-y-5 rounded-lg border bg-card p-8 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in with <span className="font-mono">{OWNER_EMAIL}</span> to view feedback.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-xs text-muted-foreground hover:text-primary w-full text-center"
          >
            {mode === "signin" ? "First time? Create account" : "Already have an account? Sign in"}
          </button>
          <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary justify-center">
            <ArrowLeft className="w-3 h-3" /> Back to Editor
          </Link>
        </form>
      </div>
    );
  }

  const isOwner = session.user.email === OWNER_EMAIL;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="ide-header px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Back to Editor
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{session.user.email}</span>
          <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="w-4 h-4" /> Sign out</Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Feedback Inbox</h1>
        <p className="text-muted-foreground mb-8">All messages submitted from the Contact page.</p>

        {!isOwner ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              This account is not authorized to view feedback. Sign in as <span className="font-mono">{OWNER_EMAIL}</span>.
            </p>
          </div>
        ) : loadingFeedback ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : feedback.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
            <Mail className="w-10 h-10 mx-auto mb-3 opacity-50" />
            No feedback yet.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 px-1">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={selected.size === feedback.length && feedback.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                {selected.size > 0 ? `${selected.size} selected` : "Select all"}
              </label>
              {selected.size > 0 && (
                <Button variant="destructive" size="sm" onClick={deleteSelected} disabled={deleting}>
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete ({selected.size})
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {feedback.map((f) => (
                <article key={f.id} className="rounded-lg border bg-card p-6 shadow-sm flex gap-4">
                  <Checkbox
                    checked={selected.has(f.id)}
                    onCheckedChange={() => toggleSelect(f.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <header className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold">{f.name}</h3>
                        <a href={`mailto:${f.email}`} className="text-sm text-primary hover:underline">{f.email}</a>
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {new Date(f.created_at).toLocaleString()}
                      </time>
                    </header>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{f.message}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
