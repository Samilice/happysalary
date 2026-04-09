"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/fr/dashboard";
  }

  return (
    <section className="py-20 lg:py-28 min-h-screen bg-gradient-to-b from-background-alt to-background">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary">Connexion</h1>
            <p className="mt-2 text-text-muted">Accédez à votre espace HappySalary</p>
          </div>

          <Card hover={false}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">
                  {error}
                </div>
              )}

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
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-text-muted">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Créer un compte
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
