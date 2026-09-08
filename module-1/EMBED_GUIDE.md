# Integration & Embedding Guide: Phishing URL Awareness Webpage

This guide details how to integrate the **"Phishing Links: Spot Deceptive URLs Before You Click"** web module into your existing website.

---

## 📁 Files Created

All self-contained files are located in:
`c:\Users\NISHANTH\.gemini\phishing-awareness-page\`

- [`index.html`](file:///c:/Users/NISHANTH/.gemini/phishing-awareness-page/index.html) - Complete standalone semantic HTML5 document.
- [`styles.css`](file:///c:/Users/NISHANTH/.gemini/phishing-awareness-page/styles.css) - Modern cyber dark theme, 3D tilt effects, glowing HUD cards, and responsive layout.
- [`app.js`](file:///c:/Users/NISHANTH/.gemini/phishing-awareness-page/app.js) - 3D mouse tilt tracking, URL risk parser engine, interactive anatomy switcher, and "Phish or Legit" challenge game.

---

## 🚀 How to Add to Your Website

### Option 1: Standalone Page (Recommended)
1. Copy the `phishing-awareness-page` folder into your website's public root (e.g., `public/phishing-guide/`).
2. Link to it from your main website's navigation bar or footer:
   ```html
   <a href="/phishing-guide/index.html" class="nav-link">Phishing Awareness Guide</a>
   ```

---

### Option 2: Embed via Responsive Iframe
If you want to display this module inside an existing page, article, or blog post (WordPress, Webflow, Squarespace, or custom CMS):

```html
<div style="position: relative; width: 100%; max-width: 1200px; margin: 0 auto; overflow: hidden; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
  <iframe 
    src="/phishing-guide/index.html" 
    width="100%" 
    height="1000" 
    style="border: 1px solid rgba(0, 242, 254, 0.2); border-radius: 16px;" 
    loading="lazy" 
    title="Phishing Links: Spot Deceptive URLs Before You Click"
    allow="clipboard-write">
  </iframe>
</div>
```

---

### Option 3: Direct Component Integration (React / Next.js)
1. **Styles**: Place the rules from `styles.css` into your global stylesheet (e.g. `globals.css`) or CSS module.
2. **Scripts**: Call the initialization functions inside a `useEffect`:
   ```jsx
   import { useEffect } from 'react';

   export default function PhishingGuide() {
     useEffect(() => {
       // Import or invoke the logic from app.js
     }, []);

     return (
       <div className="cyber-awareness-container">
         {/* Insert content from index.html inside <main> */}
       </div>
     );
   }
   ```

---

## 🎨 Customization Guide

### Customizing Colors & Theme
Open `styles.css` and adjust the root variables at the top of the file:
```css
:root {
  --cyan-neon: #00f2fe;     /* Primary neon accent */
  --rose-danger: #ff3366;   /* Phishing alert color */
  --emerald-safe: #10b981;  /* Safe link verification */
  --bg-void: #060913;       /* Background dark tone */
  --bg-card: rgba(12, 19, 36, 0.72); /* Glassmorphism card bg */
}
```

### Adding New URL Inspection Tests
In `app.js`, you can add additional brands to `famousBrands` or add custom test patterns into `presetBtns`:
```javascript
const famousBrands = ['paypal', 'apple', 'microsoft', 'google', 'yourbrand'];
```

### Modifying or Adding Quiz Questions
In `app.js`, scroll to `initQuizGame()`. Add items to the `questions` array:
```javascript
{
  context: "Email from: 'Your Bank'",
  url: "https://yourbank.secure-login-attempt.info",
  scenario: "Alert asks you to confirm your card details.",
  isPhish: true,
  explanation: "The base domain is 'secure-login-attempt.info', not your bank!"
}
```

