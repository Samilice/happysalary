type Props = {
  data: Record<string, unknown>;
};

export function StructuredData({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "HappySalary",
        url: "https://happysalary.ch",
        logo: "https://happysalary.ch/images/logo.svg",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+41-21-123-45-67",
          contactType: "customer service",
          availableLanguage: ["French", "German", "English"],
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Rue du Marche 12",
          addressLocality: "Lausanne",
          postalCode: "1003",
          addressCountry: "CH",
        },
        sameAs: [],
      }}
    />
  );
}

export function LocalBusinessSchema() {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "HappySalary",
        description:
          "Service suisse de gestion des salaires pour les employes de maison",
        url: "https://happysalary.ch",
        telephone: "+41-21-123-45-67",
        email: "info@happysalary.ch",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Rue du Marche 12",
          addressLocality: "Lausanne",
          postalCode: "1003",
          addressCountry: "CH",
        },
        openingHours: "Mo-Fr 09:00-17:00",
        priceRange: "CHF 9.90 - CHF 29.90/mois",
        areaServed: {
          "@type": "Country",
          name: "Switzerland",
        },
      }}
    />
  );
}
