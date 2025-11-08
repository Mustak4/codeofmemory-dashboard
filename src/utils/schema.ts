// Shared schema definitions for structured data

export const getLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://codeofmemory.com/#organization",
    name: "CodeOfMemory",
    legalName: "KKOSTOV LTD trading as CodeOfMemory",
    url: "https://codeofmemory.com",
    logo: "https://codeofmemory.com/logo.png",
    image: "https://codeofmemory.com/logo.png",
    description: "Preserving memories with dignity through technology and love. We create personalized QR code memorial plaques linking to digital tribute pages.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressRegion: "England",
      postalCode: "",
      addressCountry: "GB",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@codeofmemory.com",
      telephone: "+44-123-456-7890",
      contactType: "Customer Service",
      areaServed: ["GB", "DE", "NO", "SE", "DK"],
      availableLanguage: ["en", "de", "no", "sv", "da"],
    },
    areaServed: [
      {
        "@type": "Country",
        name: "United Kingdom",
      },
      {
        "@type": "Country",
        name: "Germany",
      },
      {
        "@type": "Country",
        name: "Norway",
      },
      {
        "@type": "Country",
        name: "Sweden",
      },
      {
        "@type": "Country",
        name: "Denmark",
      },
    ],
    sameAs: [
      "https://www.facebook.com/codeofmemory",
      "https://www.instagram.com/codeofmemory",
      "https://www.twitter.com/codeofmemory",
    ],
    priceRange: "££",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
  };
};

