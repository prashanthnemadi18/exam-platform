# How to Add Custom Icon/Favicon

## Quick Steps

### 1. Prepare Your Icon
- Create or find an icon image
- Recommended formats: PNG, ICO, or JPG
- Recommended sizes:
  - **Favicon**: 32x32 or 64x64 pixels
  - **Apple Touch Icon**: 180x180 pixels
  - **Android Icon**: 192x192 pixels

### 2. Name Your Icon File
Choose one of these names:
- `icon.png` (recommended)
- `icon.jpg`
- `icon.ico`
- `favicon.ico`

### 3. Place the Icon File
Copy your icon to this location:
```
teacher/src/app/icon.png
```

**Full path:**
```
C:\prashanth\Final project\teacher\src\app\icon.png
```

### 4. Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Next.js Automatic Icon Detection

Next.js 13+ automatically detects these files in the `app` directory:
- `icon.png` or `icon.jpg` → Favicon
- `apple-icon.png` → Apple touch icon
- `favicon.ico` → Legacy favicon

## Multiple Icon Sizes (Optional)

For better support across devices, you can create:

```
teacher/src/app/
├── icon.png          (32x32 or 64x64)
├── apple-icon.png    (180x180)
└── favicon.ico       (16x16, 32x32, 48x48)
```

## Current Setup

The layout has been updated to use:
- `/icon.png` as the main favicon
- Same icon for Apple devices
- Same icon for shortcuts

## Verify Icon is Working

1. Open your browser
2. Go to `http://localhost:3003`
3. Check the browser tab - you should see your icon
4. If not visible, clear browser cache (Ctrl+Shift+Delete)

## Example: Using Your Existing Image

If you have an image at:
```
C:\prashanth\Final project\teacher\src\app\4feb329646cc2c17d7cc8731c0f2113f.jpg
```

Rename it to:
```
C:\prashanth\Final project\teacher\src\app\icon.jpg
```

Or create a copy with the new name.

## Troubleshooting

### Icon not showing?
1. Clear browser cache
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Restart development server
4. Check file name is exactly `icon.png` (lowercase)

### Wrong size?
- Resize your image to 32x32 or 64x64 pixels
- Use online tools like: https://www.favicon-generator.org/

### Still not working?
- Make sure file is in `teacher/src/app/` directory
- Check file extension matches (`.png`, `.jpg`, `.ico`)
- Verify file is not corrupted
