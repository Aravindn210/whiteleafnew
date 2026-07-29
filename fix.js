const fs = require('fs');

// 1. Fix style.css
let css = fs.readFileSync('css/style.css', 'utf8');
// Fix Marquee CSS to match HTML classes
css = css.replace(/\.brand-ticker/g, '.marquee-wrap');
css = css.replace(/\.marquee-content/g, '.marquee-track');

// Fix Preloader logo visibility (black logo on white bg)
if (!css.includes('.preloader-logo-img')) {
    css += '\n.preloader-logo-img { filter: brightness(0) opacity(0.85); }\n';
}

// Fix z-index for invisible headings
css += '\n.services-hero-content, .section-title { position: relative !important; z-index: 100 !important; }\n';

// Preloader background
css = css.replace(/var\(--bg-cream\)/g, '#FDFCF9'); 
fs.writeFileSync('css/style.css', css);

// 2. Remove TURNKEY everywhere
const files = ['index.html', 'services.html', 'js/main.js'];
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/turnkey\s+/gi, '');
    content = content.replace(/\s*turnkey/gi, '');
    fs.writeFileSync(f, content);
});

// 3. Fix main.js Preloader
let js = fs.readFileSync('js/main.js', 'utf8');
js = js.replace(/preloader\.style\.backgroundColor = ['"].*?['"];/g, 'preloader.style.backgroundColor = "#FDFCF9";');
fs.writeFileSync('js/main.js', js);

console.log('Fixes applied successfully.');
