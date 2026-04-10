import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

export default function AdminSettingsPage() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">Configuration</h1>

        <div className="space-y-6">
          {/* External links */}
          <Card hover={false}>
            <h2 className="text-lg font-bold text-secondary mb-4">Outils externes</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-background-alt hover:bg-primary/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#635BFF]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-secondary group-hover:text-primary transition-colors">Stripe Dashboard</p>
                  <p className="text-xs text-text-muted">Paiements, abonnements, factures</p>
                </div>
                <svg className="w-4 h-4 text-text-muted ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-background-alt hover:bg-primary/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3ECF8E]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#3ECF8E]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.66H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-secondary group-hover:text-primary transition-colors">Supabase Dashboard</p>
                  <p className="text-xs text-text-muted">Base de donnees, auth, logs</p>
                </div>
                <svg className="w-4 h-4 text-text-muted ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>

              <a
                href="https://dash.cloudflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-background-alt hover:bg-primary/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F6821F]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#F6821F]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.5928-.502-1.0185-.5264L8.2618 14.917a.1517.1517 0 0 1-.1324-.0908c-.0283-.0566-.0234-.126.0146-.1768a.1517.1517 0 0 1 .1274-.0703l7.126-.0762c1.6543-.0537 3.4512-1.3369 4.1484-2.9649l.5068-1.1836c.0371-.0869.0566-.1787.0566-.2754 0-.0459-.0049-.0908-.0146-.1348C19.4053 6.5684 16.0331 3.81 12 3.81c-3.6182 0-6.7188 2.2412-7.9893 5.4131a3.6055 3.6055 0 0 0-2.4971-.4131c-1.2598.2246-2.2764 1.2168-2.5283 2.4717C-1.3066 13.076.2875 14.8867 2.0645 15.1426v.0195h13.7285c.0518 0 .1035-.0127.1484-.039.1719-.0996.2676-.335.376-.6855l-.0088-.0078-.7227-4.0127.7227-.376z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-secondary group-hover:text-primary transition-colors">Cloudflare Dashboard</p>
                  <p className="text-xs text-text-muted">Workers, DNS, performance</p>
                </div>
                <svg className="w-4 h-4 text-text-muted ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>

              <a
                href="https://ads.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-background-alt hover:bg-primary/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#4285F4]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-secondary group-hover:text-primary transition-colors">Google Ads</p>
                  <p className="text-xs text-text-muted">Campagnes, conversions, CPC</p>
                </div>
                <svg className="w-4 h-4 text-text-muted ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </Card>

          {/* Rate info */}
          <Card hover={false}>
            <h2 className="text-lg font-bold text-secondary mb-4">Taux en vigueur (2024/2025)</h2>
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Taux federaux (par partie)</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between"><span className="text-text-muted">AVS/AI/APG</span><span className="font-medium">5.30%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">ALV</span><span className="font-medium">1.10%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">AAP (employeur)</span><span className="font-medium">0.17%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">AANP (employe)</span><span className="font-medium">1.28%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Impot simplifie</span><span className="font-medium">5.00%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Frais admin</span><span className="font-medium">1.50%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Supp. vacances (4 sem.)</span><span className="font-medium">8.33%</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Plafonds</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between"><span className="text-text-muted">Plafond ALV annuel</span><span className="font-medium">CHF 148 200</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Plafond procedure simplifiee</span><span className="font-medium">CHF 22 050/an</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Seuil NBU</span><span className="font-medium">&ge; 8h/semaine</span></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
