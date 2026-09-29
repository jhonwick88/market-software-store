import React, { useEffect } from 'react';

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  schema
}) {
  const siteTitle = 'PintarLabs - Marketplace Software & Lisensi Aplikasi';
  const fullTitle = title ? `${title} | PintarLabs` : siteTitle;
  const defaultDesc = 'Pusat download software & beli lisensi aplikasi desktop Windows (.exe) dan Android (.apk) siap pakai: POS Resto, Stok Gudang, Absensi Biometrik GPS, Bell Otomatis, Surat Desa, dan Tiket Bus.';
  const metaDesc = description || defaultDesc;
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : 'https://labspintar.com');
  const image = ogImage || 'https://labspintar.com/images/pintarpos_resto.jpg';

  useEffect(() => {
    // 1. Title
    document.title = fullTitle;

    // 2. Meta description
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.setAttribute('name', 'description');
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.setAttribute('content', metaDesc);

    // 3. Keywords
    if (keywords) {
      let metaKwTag = document.querySelector('meta[name="keywords"]');
      if (!metaKwTag) {
        metaKwTag = document.createElement('meta');
        metaKwTag.setAttribute('name', 'keywords');
        document.head.appendChild(metaKwTag);
      }
      metaKwTag.setAttribute('content', keywords);
    }

    // 4. Canonical
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentUrl);

    // 5. OpenGraph
    const setMetaProperty = (prop, val) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', prop);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', val);
    };

    setMetaProperty('og:title', fullTitle);
    setMetaProperty('og:description', metaDesc);
    setMetaProperty('og:url', currentUrl);
    setMetaProperty('og:type', ogType);
    setMetaProperty('og:image', image);

    // 6. Twitter
    const setMetaName = (name, val) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', val);
    };
    setMetaName('twitter:title', fullTitle);
    setMetaName('twitter:description', metaDesc);
    setMetaName('twitter:image', image);

    // 7. Dynamic JSON-LD
    let scriptTag = document.getElementById('dynamic-seo-jsonld');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-seo-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, metaDesc, keywords, currentUrl, image, ogType, schema]);

  return null;
}
