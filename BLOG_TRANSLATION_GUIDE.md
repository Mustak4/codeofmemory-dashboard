# Blog Post Translation Guide

## Overview
The top 3 blog posts need translation into German (DE), Swedish (SE), and Norwegian (NO). The infrastructure is ready to support translated blog posts.

## Top 3 Blog Posts to Translate

1. **Why QR Memorial Plaques Are Changing How We Remember**
   - Slug: `why-qr-memorial-plaques-change-remembrance`
   - Word count: ~1200-1500 words
   - Category: Innovation

2. **How to Create a Digital Memorial Page**
   - Slug: `how-to-create-digital-memorial-page`
   - Word count: ~1200-1500 words
   - Category: Guidance

3. **Best Materials for Outdoor QR Plaques**
   - Slug: `best-materials-for-outdoor-qr-plaques`
   - Word count: ~1200-1500 words
   - Category: Guidance

## Translation Approach

### Option 1: Same Slug, Language-Specific Content
- Use the same slug for all languages
- Content changes based on current language context
- Simplest approach, already supported

### Option 2: Language-Specific Slugs
- Create separate entries with language-specific slugs
- Example: `warum-qr-gedenktafeln-das-erinnern-veraendern` (DE)
- Requires route updates and sitemap changes

## Implementation Steps

### Using Option 1 (Recommended)

1. **Add translations to `src/data/blogPosts.ts`**:
   ```typescript
   {
     id: 7,
     title: {
       en: "Why QR Memorial Plaques Are Changing How We Remember",
       de: "Warum QR-Gedenktafeln das Erinnern verändern",
       se: "Varför QR-minnesplaketter förändrar hur vi minns",
       no: "Hvorfor QR-minneplaketter endrer hvordan vi husker"
     },
     excerpt: {
       en: "Discover how...",
       de: "Entdecken Sie, wie...",
       // etc.
     },
     content: {
       en: "<p>English content...</p>",
       de: "<p>Deutscher Inhalt...</p>",
       // etc.
     },
     slug: "why-qr-memorial-plaques-change-remembrance"
   }
   ```

2. **Update BlogPost component** to use language context:
   ```typescript
   const { language } = useLanguage();
   const title = post.title[language] || post.title.en;
   ```

### Using Option 2 (Alternative)

1. Create separate blog post entries for each language
2. Use language-specific slugs
3. Update routes to handle language-specific slugs
4. Update sitemap generation

## Translation Guidelines

### Tone & Style
- Maintain calm, respectful tone
- No marketing hype
- Match the emotional depth of English content
- Preserve the structure and flow

### Technical Terms
- **QR Code**: Keep as "QR-Code" (DE), "QR-kod" (SE/NO)
- **Memorial Plaque**: "Gedenktafel" (DE), "Minnesplakett" (SE/NO)
- **Digital Memorial**: "Digitales Denkmal" (DE), "Digitalt minnesmärke" (SE/NO)

### Links
- Internal links: Use localized paths (`/de/order`, `/se/about`)
- External links: Keep original (Wikipedia, etc.)
- Ensure all links work in translated context

### SEO Considerations
- Translate meta titles and descriptions
- Maintain keyword density
- Keep internal linking structure
- Preserve external authoritative links

## Translation Tools

### Recommended Services
- **DeepL API**: High-quality translations
- **Google Translate API**: Alternative option
- **Professional Translators**: Best quality for sensitive content

### Quality Checklist
- [ ] All content translated (title, excerpt, body)
- [ ] Links updated to localized paths
- [ ] Technical terms handled correctly
- [ ] Tone matches English version
- [ ] No grammatical errors
- [ ] SEO keywords included naturally
- [ ] Read time updated for language

## Current Status

- ✅ Infrastructure ready for translations
- ✅ Routes support all languages
- ✅ SEO components handle translations
- ✅ Sitemap generation supports translations
- ⚠️ Content translations pending

## Next Steps

1. **Translate Content**: Use DeepL API or professional translators
2. **Update Data Structure**: Add translations to `blogPosts.ts`
3. **Update Components**: Ensure BlogPost component uses translations
4. **Test**: Verify all language variants work correctly
5. **Validate SEO**: Check hreflang tags for translated posts

## Notes

- Blog posts are currently displayed in English for all languages
- The structure supports translations - just needs content
- Translations can be added incrementally (one language at a time)
- Existing English content remains unchanged

