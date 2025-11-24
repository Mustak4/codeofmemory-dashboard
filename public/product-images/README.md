# Product Images

This folder contains images for the products displayed on the Order page.

## Product Options

Based on the Order page, you should add images for the following products:

1. **Black Engraved Plexiglass** (`plexiglass`)
   - ID: `plexiglass`
   - Suggested filename: `plexiglass.jpg` or `plexiglass.png`

2. **Two-Tone Gold or Silver Acrylic** (`acrylic`)
   - ID: `acrylic`
   - Suggested filenames: 
     - `acrylic-gold.jpg` (for gold variant)
     - `acrylic-silver.jpg` (for silver variant)
     - Or a single image: `acrylic.jpg`

3. **Natural Stone Plaque (Slate)** (`slate`)
   - ID: `slate`
   - Suggested filename: `slate.jpg` or `slate.png`

## How to Add Images

1. Place your image files in this folder (`public/product-images/`)
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
3. Recommended naming: Use the product ID as the filename (e.g., `plexiglass.jpg`)

## How to Reference Images in Code

In `src/pages/Order.tsx`, you can reference images like this:

```typescript
const plaqueOptions = [
  { 
    id: "plexiglass", 
    name: "Black Engraved Plexiglass",
    image: "/product-images/plexiglass.jpg", // Add this
    // ... rest of the options
  },
  // ... other options
];
```

## Image Paths

- **Local images**: Use `/product-images/filename.jpg` (starts with `/`)
- The path is relative to the `public` folder

## Image Recommendations

- **Aspect ratio**: 4:3 or 16:9 for product photos
- **Resolution**: At least 800x600px for good quality
- **File size**: Keep under 500KB for optimal performance
- **Format**: Use JPG for photos, PNG for images with transparency
- **Content**: Show the product clearly, ideally with good lighting and from multiple angles if possible

