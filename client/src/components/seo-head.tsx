import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export function SEOHead({
  title,
  description = "MILLERGROUP Intelligence - Professional Investigation and Security Consulting",
  canonicalUrl,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags = [],
}: SEOHeadProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper to update or create meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Basic meta tags
    if (description) {
      setMetaTag("description", description);
    }

    // Open Graph tags
    setMetaTag("og:title", title, true);
    if (description) {
      setMetaTag("og:description", description, true);
    }
    setMetaTag("og:type", type, true);
    
    if (canonicalUrl) {
      setMetaTag("og:url", canonicalUrl, true);
      
      // Set canonical link
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalUrl);
    }

    if (image) {
      setMetaTag("og:image", image, true);
      setMetaTag("og:image:alt", title, true);
    }

    // Twitter Card tags
    setMetaTag("twitter:card", image ? "summary_large_image" : "summary");
    setMetaTag("twitter:title", title);
    if (description) {
      setMetaTag("twitter:description", description);
    }
    if (image) {
      setMetaTag("twitter:image", image);
    }

    // Article-specific tags
    if (type === "article") {
      if (publishedTime) {
        setMetaTag("article:published_time", publishedTime, true);
      }
      if (modifiedTime) {
        setMetaTag("article:modified_time", modifiedTime, true);
      }
      if (author) {
        setMetaTag("article:author", author, true);
      }
      tags.forEach(tag => {
        const tagElement = document.createElement("meta");
        tagElement.setAttribute("property", "article:tag");
        tagElement.setAttribute("content", tag);
        document.head.appendChild(tagElement);
      });
    }

    // JSON-LD structured data for articles
    if (type === "article") {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptTag);
      }

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        image: image,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        author: {
          "@type": "Person",
          name: author || "MILLERGROUP Intelligence",
        },
        publisher: {
          "@type": "Organization",
          name: "MILLERGROUP Intelligence",
          logo: {
            "@type": "ImageObject",
            url: `${window.location.origin}/logo.png`,
          },
        },
      };

      scriptTag.textContent = JSON.stringify(structuredData);
    }

    // Cleanup old article tags when switching to non-article pages
    return () => {
      if (type !== "article") {
        document.querySelectorAll('meta[property^="article:"]').forEach(el => el.remove());
        document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
      }
    };
  }, [title, description, canonicalUrl, image, type, publishedTime, modifiedTime, author, tags]);

  return null;
}
