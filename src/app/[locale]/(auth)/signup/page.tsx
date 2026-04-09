"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/fr/onboarding`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <section className="py-20 lg:py-28 min-h-screen bg-gradient-to-b from-background-alt to-background">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-secondary mb-3">Vérifiez votre email</h1>
            <p className="text-text-muted">
              Un lien de confirmation a été envoyé à <strong>{email}</strong>.
              Cliquez dessus pour activer votre compte et commencer l&apos;inscription.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28 min-h-screen bg-gradient-to-b from-background-alt to-background">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary">Créer un compte</h1>
            <p className="mt-2 text-text-muted">Commencez à gérer la paie de votre employé</p>
          </div>

          <Card hover={false}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Nom complet</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="vous@exemple.ch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Minimum 8 caractères"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Création..." : "Créer mon compte"}
              </Button>

              <p className="text-xs text-text-muted text-center">
                En créant un compte, vous acceptez nos{" "}
                <Link href="/legal/terms" className="text-primary hover:underline">CGU</Link>
                {" "}et notre{" "}
                <Link href="/legal/privacy" className="text-primary hover:underline">politique de confidentialité</Link>.
              </p>
            </form>

            <div className="mt-6 text-center text-sm text-text-muted">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Se connecter
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
