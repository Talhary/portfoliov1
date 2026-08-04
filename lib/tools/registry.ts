export interface ToolCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  isAsync: boolean;
  isNew?: boolean;
  tags: string[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'calculators',
    slug: 'calculators',
    name: 'Calculators',
    description: 'Financial, daily life, fitness, and mathematical calculators.',
    icon: 'Calculator',
  },
  {
    id: 'image-tools',
    slug: 'image-tools',
    name: 'Image Tools',
    description: 'Image conversion, editing, compression, OCR, SVG rasterization, and more.',
    icon: 'Image',
  },
  {
    id: 'text-tools',
    slug: 'text-tools',
    name: 'Text Tools',
    description: 'Text manipulation, speech synthesis, grammar, case conversion, diff, and more.',
    icon: 'FileText',
  },
  {
    id: 'color-tools',
    slug: 'color-tools',
    name: 'Color Tools',
    description: 'Color pickers, gradient generators, palette builders, and contrast checkers.',
    icon: 'Palette',
  },
  {
    id: 'developer-utilities',
    slug: 'developer-utilities',
    name: 'Developer Utilities',
    description: 'JSON/XML/CSS formatters, encoding/decoding, minifiers, CSS generators, and more.',
    icon: 'Code',
  },
  {
    id: 'date-time',
    slug: 'date-time',
    name: 'Date & Time Tools',
    description: 'Timezone converters, date difference, cron parsers, timestamps, and timers.',
    icon: 'Clock',
  },
  {
    id: 'converters',
    slug: 'converters',
    name: 'Converters',
    description: 'Data format, binary, Morse code, SQL generation, and unit conversions.',
    icon: 'RefreshCw',
  },
  {
    id: 'security-utilities',
    slug: 'security-utilities',
    name: 'Security Utilities',
    description: 'Hashes, password security, UUID generators, IP/DNS/SSL, port scanning, and more.',
    icon: 'Shield',
  },
  {
    id: 'seo-tools',
    slug: 'seo-tools',
    name: 'SEO Tools',
    description: 'Meta tag analysis, sitemap generation, keyword density, and speed estimations.',
    icon: 'Search',
  },
  {
    id: 'file-tools',
    slug: 'file-tools',
    name: 'File Tools',
    description: 'PDF converters, document merging/splitting, media converters, GIF creation, and more.',
    icon: 'FolderArchive',
  },
  {
    id: 'ai-llm-tools',
    slug: 'ai-llm-tools',
    name: 'AI & LLM Tools',
    description: 'Token counters, prompt builders, embeddings, image prompts, and RAG visualizers.',
    icon: 'Brain',
  },
];

export const ALL_TOOLS: ToolDefinition[] = [
  // --- CALCULATORS (13) ---
  { id: 'basic-calc', slug: 'basic-calculator', title: 'Basic Calculator', category: 'calculators', description: 'Everyday clean keypad calculator.', isAsync: false, tags: ['math', 'calculator'] },
  { id: 'percentage-calc', slug: 'percentage-calculator', title: 'Percentage Calculator', category: 'calculators', description: 'Calculate percentages, tips, and discounts.', isAsync: false, tags: ['math', 'percent'] },
  { id: 'bmi-calc', slug: 'bmi-calculator', title: 'BMI Calculator', category: 'calculators', description: 'Body Mass Index estimator with metric/imperial units.', isAsync: false, tags: ['health', 'fitness'] },
  { id: 'loan-calc', slug: 'loan-calculator', title: 'Loan Calculator', category: 'calculators', description: 'Monthly payment & interest estimator.', isAsync: false, tags: ['finance', 'money'] },
  { id: 'age-calc', slug: 'age-calculator', title: 'Age Calculator', category: 'calculators', description: 'Exact age breakdown in years, months, days, hours.', isAsync: false, tags: ['time', 'age'] },
  { id: 'tip-calc', slug: 'tip-calculator', title: 'Tip Calculator', category: 'calculators', description: 'Split bills and tips among multiple people.', isAsync: false, tags: ['finance', 'bill'] },
  { id: 'currency-converter', slug: 'currency-converter', title: 'Currency Converter', category: 'calculators', description: 'Convert between common global currencies.', isAsync: false, tags: ['finance', 'money'] },
  { id: 'discount-calc', slug: 'discount-calculator', title: 'Discount Calculator', category: 'calculators', description: 'Instant final price and savings calculator.', isAsync: false, tags: ['shopping', 'finance'] },
  { id: 'gpa-calc', slug: 'gpa-calculator', title: 'GPA Calculator', category: 'calculators', description: 'Estimate cumulative GPA from course lists.', isAsync: false, tags: ['education', 'gpa'] },
  { id: 'salary-calc', slug: 'salary-calculator', title: 'Salary Calculator', category: 'calculators', description: 'Annual, monthly, and hourly net pay estimator.', isAsync: false, tags: ['finance', 'work'] },
  { id: 'time-duration-calc', slug: 'time-duration-calculator', title: 'Time Duration Calculator', category: 'calculators', description: 'Measure elapsed time between clock times.', isAsync: false, tags: ['time', 'duration'] },
  { id: 'compound-interest-calc', slug: 'compound-interest-calculator', title: 'Compound Interest Calculator', category: 'calculators', description: 'Project investment compounding growth.', isAsync: false, tags: ['finance', 'investment'] },
  { id: 'electricity-bill-calc', slug: 'electricity-bill-calculator', title: 'Electricity Bill Calculator', category: 'calculators', description: 'Power cost estimator based on wattage/usage.', isAsync: false, tags: ['utility', 'power'] },

  // --- IMAGE TOOLS (13 built + 2 upcoming) ---
  { id: 'png-to-jpg', slug: 'png-to-jpg', title: 'PNG to JPG Converter', category: 'image-tools', description: 'Convert PNG images to optimized JPG.', isAsync: false, tags: ['image', 'convert'] },
  { id: 'jpg-to-png', slug: 'jpg-to-png', title: 'JPG to PNG Converter', category: 'image-tools', description: 'Convert JPG images to transparent-ready PNG.', isAsync: false, tags: ['image', 'convert'] },
  { id: 'image-compressor', slug: 'image-compressor', title: 'Image Compressor', category: 'image-tools', description: 'Reduce image file size while preserving quality.', isAsync: false, tags: ['image', 'compress'] },
  { id: 'image-resizer', slug: 'image-resizer', title: 'Image Resizer', category: 'image-tools', description: 'Resize images to exact width and height dimensions.', isAsync: false, tags: ['image', 'resize'] },
  { id: 'webp-to-png', slug: 'webp-to-png', title: 'WebP to PNG Converter', category: 'image-tools', description: 'Quick WebP to PNG image conversion.', isAsync: false, tags: ['image', 'webp'] },
  { id: 'image-cropper', slug: 'image-cropper', title: 'Image Cropper', category: 'image-tools', description: 'Crop images with pixel precision.', isAsync: false, tags: ['image', 'crop'] },
  { id: 'background-remover', slug: 'background-remover', title: 'Background Remover', category: 'image-tools', description: 'Remove background colors from images.', isAsync: true, tags: ['image', 'ai'] },
  { id: 'image-to-base64', slug: 'image-to-base64', title: 'Image to Base64', category: 'image-tools', description: 'Convert images into Base64 data URLs.', isAsync: false, tags: ['image', 'base64'] },
  { id: 'base64-to-image', slug: 'base64-to-image', title: 'Base64 to Image', category: 'image-tools', description: 'Decode Base64 strings into previewable images.', isAsync: false, tags: ['image', 'base64'] },
  { id: 'image-color-picker', slug: 'image-color-picker', title: 'Image Color Picker', category: 'image-tools', description: 'Extract color palettes directly from uploaded images.', isAsync: false, tags: ['image', 'color'] },
  { id: 'image-ocr', slug: 'image-to-text-ocr', title: 'Image to Text (OCR)', category: 'image-tools', description: 'Extract text from image files via Tesseract OCR.', isAsync: true, tags: ['ocr', 'text'] },
  { id: 'image-rotator', slug: 'image-rotator', title: 'Image Rotator / Flipper', category: 'image-tools', description: 'One-click rotation and horizontal/vertical flipping.', isAsync: false, tags: ['image', 'rotate'] },
  { id: 'svg-optimizer', slug: 'svg-optimizer', title: 'SVG Optimizer', category: 'image-tools', description: 'Minify and clean SVG markup.', isAsync: false, tags: ['svg', 'vector'] },
  { id: 'image-watermarker', slug: 'image-watermarker', title: 'Image Watermarker', category: 'image-tools', description: 'Apply custom text or logo watermarks to uploaded images.', isAsync: true, isNew: true, tags: ['image', 'watermark'] },
  { id: 'heic-to-jpg', slug: 'heic-to-jpg', title: 'HEIC to JPG Converter', category: 'image-tools', description: 'Convert Apple HEIC photos to JPG format.', isAsync: true, isNew: true, tags: ['image', 'heic'] },
  { id: 'favicon-generator', slug: 'favicon-generator', title: 'Favicon Generator', category: 'image-tools', description: 'Upload a master PNG/SVG and generate full favicon suite for all platforms.', isAsync: false, isNew: true, tags: ['favicon', 'icon'] },
  { id: 'svg-to-raster', slug: 'svg-to-png-jpg-converter', title: 'SVG to PNG / JPG Converter', category: 'image-tools', description: 'Rasterize SVG vectors into downloadable high-resolution PNG or JPG images.', isAsync: true, isNew: true, tags: ['svg', 'png', 'jpg'] },

  // --- TEXT TOOLS (11 built) ---
  { id: 'word-counter', slug: 'word-counter', title: 'Word Counter', category: 'text-tools', description: 'Live word, character, sentence, and paragraph counter.', isAsync: false, tags: ['text', 'count'] },
  { id: 'character-counter', slug: 'character-counter', title: 'Character Counter', category: 'text-tools', description: 'Track characters against custom length limits.', isAsync: false, tags: ['text', 'limit'] },
  { id: 'case-converter', slug: 'case-converter', title: 'Case Converter', category: 'text-tools', description: 'UPPERCASE, lowercase, Title, camelCase, snake_case.', isAsync: false, tags: ['text', 'case'] },
  { id: 'remove-duplicate-lines', slug: 'remove-duplicate-lines', title: 'Remove Duplicate Lines', category: 'text-tools', description: 'Clean up lists by removing duplicate entries.', isAsync: false, tags: ['text', 'clean'] },
  { id: 'text-to-speech', slug: 'text-to-speech', title: 'Text to Speech', category: 'text-tools', description: 'Convert written text into spoken audio in browser.', isAsync: false, tags: ['audio', 'speech'] },
  { id: 'speech-to-text', slug: 'speech-to-text', title: 'Speech to Text', category: 'text-tools', description: 'Real-time microphone speech-to-text dictation.', isAsync: false, tags: ['audio', 'voice'] },
  { id: 'grammar-checker', slug: 'grammar-checker', title: 'Grammar Checker', category: 'text-tools', description: 'Catch common typos, spelling, and grammar errors.', isAsync: true, tags: ['grammar', 'text'] },
  { id: 'fancy-text-generator', slug: 'fancy-text-generator', title: 'Fancy Text Generator', category: 'text-tools', description: 'Generate stylized font text for social bios.', isAsync: false, tags: ['font', 'social'] },
  { id: 'plagiarism-checker', slug: 'plagiarism-checker', title: 'Plagiarism Checker', category: 'text-tools', description: 'Compare two text documents for wording similarity.', isAsync: false, tags: ['diff', 'compare'] },
  { id: 'text-reverser', slug: 'text-reverser', title: 'Text Reverser', category: 'text-tools', description: 'Reverse characters, words, or line order.', isAsync: false, tags: ['text', 'reverse'] },
  { id: 'url-encoder-decoder', slug: 'url-encoder-decoder', title: 'URL Encoder / Decoder', category: 'text-tools', description: 'Safely encode and decode URL parameters.', isAsync: false, tags: ['url', 'encode'] },
  { id: 'lorem-ipsum', slug: 'lorem-ipsum-generator', title: 'Lorem Ipsum Generator', category: 'text-tools', description: 'Generate placeholder dummy text for designs and mockups.', isAsync: false, isNew: true, tags: ['text', 'placeholder'] },
  { id: 'font-pairing-tester', slug: 'font-pairing-tester', title: 'Font Pairing Tester', category: 'text-tools', description: 'Preview Google Font combinations side-by-side for header and body text.', isAsync: false, isNew: true, tags: ['font', 'design', 'typography'] },
  { id: 'code-diff-checker', slug: 'code-diff-checker', title: 'Code Diff Checker', category: 'text-tools', description: 'Side-by-side visual comparison of two code blocks with highlighted differences.', isAsync: false, isNew: true, tags: ['diff', 'compare', 'code'] },

  // --- COLOR TOOLS (8 built) ---
  { id: 'color-picker', slug: 'color-picker', title: 'Color Picker', category: 'color-tools', description: 'HEX, RGB, HSL color selection tool.', isAsync: false, tags: ['color', 'picker'] },
  { id: 'color-picker-from-image', slug: 'color-picker-from-image', title: 'Color Picker from Image', category: 'color-tools', description: 'Extract hex palette details from uploaded images.', isAsync: false, tags: ['color', 'image'] },
  { id: 'hex-to-rgb', slug: 'hex-to-rgb-converter', title: 'HEX to RGB Converter', category: 'color-tools', description: 'Instant HEX ⇄ RGB conversions.', isAsync: false, tags: ['color', 'convert'] },
  { id: 'gradient-generator', slug: 'gradient-generator', title: 'Gradient Generator', category: 'color-tools', description: 'Custom CSS gradient builder with code output.', isAsync: false, tags: ['css', 'gradient'] },
  { id: 'css-color-generator', slug: 'css-color-generator', title: 'CSS Color Generator', category: 'color-tools', description: 'Custom HSL color sliders & CSS snippets.', isAsync: false, tags: ['css', 'color'] },
  { id: 'palette-generator', slug: 'palette-generator', title: 'Palette Generator', category: 'color-tools', description: 'One-click cohesive palette generation.', isAsync: false, tags: ['palette', 'design'] },
  { id: 'contrast-checker', slug: 'contrast-checker', title: 'Contrast Checker', category: 'color-tools', description: 'WCAG accessibility compliance checker.', isAsync: false, tags: ['a11y', 'wcag'] },
  { id: 'tailwind-color-generator', slug: 'tailwind-color-generator', title: 'Tailwind Color Generator', category: 'color-tools', description: 'Generate full Tailwind-ready shade scale palettes.', isAsync: false, tags: ['tailwind', 'css'] },

  // --- DEVELOPER UTILITIES (14 built + 3 upcoming) + 5 new + 5 more new ---
  { id: 'json-formatter', slug: 'json-formatter', title: 'JSON Formatter', category: 'developer-utilities', description: 'Beautify or minify JSON payloads.', isAsync: false, tags: ['json', 'format'] },
  { id: 'xml-formatter', slug: 'xml-formatter', title: 'XML Formatter', category: 'developer-utilities', description: 'Pretty-print XML documents.', isAsync: false, tags: ['xml', 'format'] },
  { id: 'css-formatter', slug: 'css-formatter', title: 'CSS Formatter', category: 'developer-utilities', description: 'Format and compress CSS markup.', isAsync: false, tags: ['css', 'minify'] },
  { id: 'html-encoder-decoder', slug: 'html-encoder-decoder', title: 'HTML Encoder / Decoder', category: 'developer-utilities', description: 'Escape and unescape HTML entities.', isAsync: false, tags: ['html', 'escape'] },
  { id: 'dev-url-encoder', slug: 'dev-url-encoder-decoder', title: 'URL Encoder / Decoder', category: 'developer-utilities', description: 'Encode and decode URL components.', isAsync: false, tags: ['url', 'dev'] },
  { id: 'base64-encoder-decoder', slug: 'base64-encoder-decoder', title: 'Base64 Encoder / Decoder', category: 'developer-utilities', description: 'Encode and decode text using Base64.', isAsync: false, tags: ['base64', 'dev'] },
  { id: 'markdown-to-html', slug: 'markdown-to-html', title: 'Markdown to HTML', category: 'developer-utilities', description: 'Render Markdown text into HTML with preview.', isAsync: false, tags: ['markdown', 'html'] },
  { id: 'htaccess-generator', slug: 'htaccess-generator', title: '.htaccess Generator', category: 'developer-utilities', description: 'Build common Apache rewrite rules.', isAsync: false, tags: ['apache', 'server'] },
  { id: 'robots-txt-generator', slug: 'robots-txt-generator', title: 'Robots.txt Generator', category: 'developer-utilities', description: 'Generate customized robots.txt files.', isAsync: false, tags: ['seo', 'robots'] },
  { id: 'meta-tag-generator', slug: 'meta-tag-generator', title: 'Meta Tag Generator', category: 'developer-utilities', description: 'SEO meta and Open Graph tag builder.', isAsync: false, tags: ['meta', 'seo'] },
  { id: 'password-generator', slug: 'password-generator', title: 'Password Generator', category: 'developer-utilities', description: 'Secure password generator with custom rules.', isAsync: false, tags: ['security', 'password'] },
  { id: 'qr-code-generator', slug: 'qr-code-generator', title: 'QR Code Generator', category: 'developer-utilities', description: 'Generate downloadable QR codes for URLs/text.', isAsync: false, tags: ['qr', 'code'] },
  { id: 'uuid-generator', slug: 'uuid-generator', title: 'UUID Generator', category: 'developer-utilities', description: 'Generate v4 cryptographically strong UUIDs.', isAsync: false, tags: ['uuid', 'dev'] },
  { id: 'regex-tester', slug: 'regex-tester', title: 'Regex Tester', category: 'developer-utilities', description: 'Test regular expressions with live syntax highlighting.', isAsync: false, tags: ['regex', 'test'] },
  { id: 'json-yaml-converter', slug: 'json-yaml-converter', title: 'JSON ⇄ YAML Converter', category: 'developer-utilities', description: 'Convert between JSON and YAML syntax.', isAsync: false, isNew: true, tags: ['json', 'yaml'] },
  { id: 'jwt-decoder', slug: 'jwt-token-decoder', title: 'JWT Token Decoder', category: 'developer-utilities', description: 'Decode and inspect JSON Web Token headers, payload, and expiry dates.', isAsync: false, isNew: true, tags: ['jwt', 'auth'] },
  { id: 'sql-formatter', slug: 'sql-formatter-sanitizer', title: 'SQL Formatter & Sanitizer', category: 'developer-utilities', description: 'Format and clean complex SQL queries.', isAsync: false, isNew: true, tags: ['sql', 'database'] },
  { id: 'curl-builder', slug: 'curl-command-builder', title: 'cURL Command Builder', category: 'developer-utilities', description: 'Visual builder for generating cURL commands from URL, method, headers, and body.', isAsync: false, isNew: true, tags: ['api', 'curl', 'network'] },
  { id: 'rest-api-tester', slug: 'rest-api-tester', title: 'REST API Tester (Mini-Postman)', category: 'developer-utilities', description: 'Browser-based fetch client to ping REST endpoints and inspect JSON responses.', isAsync: false, isNew: true, tags: ['api', 'rest', 'network'] },
  { id: 'websocket-client', slug: 'websocket-client', title: 'WebSocket Client', category: 'developer-utilities', description: 'Connect to ws:// or wss:// endpoints, send messages, and monitor live event streams.', isAsync: false, isNew: true, tags: ['websocket', 'network'] },
  { id: 'glassmorphism-generator', slug: 'glassmorphism-generator', title: 'Glassmorphism / Neumorphism CSS Generator', category: 'developer-utilities', description: 'Generate ready-to-use glassmorphism or neumorphism CSS with live sliders.', isAsync: false, isNew: true, tags: ['css', 'ui', 'design'] },
  { id: 'cubic-bezier-visualizer', slug: 'cubic-bezier-visualizer', title: 'Cubic-Bezier Easing Visualizer', category: 'developer-utilities', description: 'Interactive graph to drag and test CSS transition timing functions.', isAsync: false, isNew: true, tags: ['css', 'animation'] },
  { id: 'js-minifier', slug: 'js-minifier', title: 'JS Minifier', category: 'developer-utilities', description: 'Minify JavaScript code by removing comments and whitespace.', isAsync: false, isNew: true, tags: ['javascript', 'minify'] },
  { id: 'html-minifier', slug: 'html-minifier', title: 'HTML Minifier', category: 'developer-utilities', description: 'Minify HTML markup by removing comments and collapsing whitespace.', isAsync: false, isNew: true, tags: ['html', 'minify'] },
  { id: 'svg-to-jsx', slug: 'svg-to-jsx-converter', title: 'SVG to JSX Converter', category: 'developer-utilities', description: 'Convert raw SVG markup into React JSX components automatically.', isAsync: false, isNew: true, tags: ['svg', 'react', 'jsx'] },
  { id: 'box-shadow-generator', slug: 'box-shadow-generator', title: 'Box Shadow Generator', category: 'developer-utilities', description: 'Interactive sliders to generate complex CSS box-shadow values with live preview.', isAsync: false, isNew: true, tags: ['css', 'shadow', 'design'] },
  { id: 'border-radius-generator', slug: 'border-radius-generator', title: 'Border Radius Generator', category: 'developer-utilities', description: 'Advanced CSS border-radius builder with per-corner control and live preview.', isAsync: false, isNew: true, tags: ['css', 'border', 'design'] },
  { id: 'docker-compose-generator', slug: 'docker-compose-generator', title: 'Docker Compose Generator', category: 'developer-utilities', description: 'Visual builder to pick services and generate ready-to-use docker-compose.yml files.', isAsync: false, isNew: true, tags: ['docker', 'devops', 'yaml'] },

  // --- DATE & TIME TOOLS (5 built + 1 new) ---
  { id: 'date-difference', slug: 'date-difference', title: 'Date Difference', category: 'date-time', description: 'Calculate days, weeks, and months between dates.', isAsync: false, tags: ['date', 'time'] },
  { id: 'timezone-converter', slug: 'timezone-converter', title: 'Timezone Converter', category: 'date-time', description: 'Convert timestamps across global timezones.', isAsync: false, tags: ['tz', 'timezone'] },
  { id: 'countdown-timer', slug: 'countdown-timer', title: 'Countdown Timer', category: 'date-time', description: 'Real-time countdown timer to specific dates.', isAsync: false, tags: ['timer', 'clock'] },
  { id: 'cron-parser', slug: 'cron-parser', title: 'Cron Parser', category: 'date-time', description: 'Translate cron expressions into plain human readable text.', isAsync: false, tags: ['cron', 'schedule'] },
  { id: 'unix-timestamp-converter', slug: 'unix-timestamp-converter', title: 'Unix Timestamp Converter', category: 'date-time', description: 'Convert Unix timestamps ⇄ readable dates.', isAsync: false, tags: ['unix', 'timestamp'] },
  { id: 'pomodoro-timer', slug: 'pomodoro-timer', title: 'Pomodoro Timer', category: 'date-time', description: 'Structured work/break timer with configurable focus and rest intervals.', isAsync: false, isNew: true, tags: ['timer', 'productivity', 'pomodoro'] },

  // --- CONVERTERS (7 built) + 1 new ---
  { id: 'csv-to-json', slug: 'csv-to-json', title: 'CSV to JSON', category: 'converters', description: 'Convert tabular CSV data to structured JSON arrays.', isAsync: false, tags: ['csv', 'json'] },
  { id: 'json-to-csv', slug: 'json-to-csv', title: 'JSON to CSV', category: 'converters', description: 'Flatten JSON arrays into downloadable CSV tables.', isAsync: false, tags: ['json', 'csv'] },
  { id: 'conv-text-to-speech', slug: 'conv-text-to-speech', title: 'Text to Speech Engine', category: 'converters', description: 'Convert text to synthesized speech.', isAsync: false, tags: ['speech', 'convert'] },
  { id: 'binary-converter', slug: 'binary-converter', title: 'Binary Converter', category: 'converters', description: 'Text ⇄ Binary conversion.', isAsync: false, tags: ['binary', 'convert'] },
  { id: 'morse-code-converter', slug: 'morse-code-converter', title: 'Morse Code Converter', category: 'converters', description: 'Text ⇄ Morse code with audio playback.', isAsync: false, tags: ['morse', 'audio'] },
  { id: 'roman-numeral-converter', slug: 'roman-numeral-converter', title: 'Roman Numeral Converter', category: 'converters', description: 'Decimal ⇄ Roman numerals.', isAsync: false, tags: ['roman', 'math'] },
  { id: 'number-base-converter', slug: 'number-base-converter', title: 'Number Base Converter', category: 'converters', description: 'Convert between decimal, binary, hex, and octal.', isAsync: false, tags: ['base', 'hex'] },
  { id: 'xlsx-to-json-csv', slug: 'xlsx-to-json-csv', title: 'Excel (XLSX) to JSON / CSV', category: 'converters', description: 'Drag-and-drop spreadsheet conversion to JSON arrays or CSV.', isAsync: false, isNew: true, tags: ['excel', 'xlsx', 'convert'] },
  { id: 'json-csv-to-sql', slug: 'json-csv-to-sql-converter', title: 'JSON / CSV to SQL Converter', category: 'converters', description: 'Generate SQL INSERT statements from JSON arrays or CSV data.', isAsync: false, isNew: true, tags: ['sql', 'json', 'csv'] },
  { id: 'unit-converter', slug: 'general-unit-converter', title: 'General Unit Converter', category: 'converters', description: 'Convert between length, weight, temperature, volume, and speed units.', isAsync: false, isNew: true, tags: ['unit', 'convert', 'length', 'weight'] },

  // --- SECURITY UTILITIES (9 built + 3 upcoming) + 3 new ---
  { id: 'md5-hash', slug: 'md5-hash-generator', title: 'MD5 Hash Generator', category: 'security-utilities', description: 'Standard MD5 checksum generator.', isAsync: false, tags: ['hash', 'md5'] },
  { id: 'sha256-hash', slug: 'sha-256-hash', title: 'SHA-256 Hash', category: 'security-utilities', description: 'Secure SHA-256 hash generator.', isAsync: false, tags: ['sha256', 'hash'] },
  { id: 'sha512-hash', slug: 'sha-512-hash', title: 'SHA-512 Hash', category: 'security-utilities', description: 'SHA-512 cryptographic hash generator.', isAsync: false, tags: ['sha512', 'hash'] },
  { id: 'password-strength-meter', slug: 'password-strength-meter', title: 'Password Strength Meter', category: 'security-utilities', description: 'Evaluate password entropy and strength.', isAsync: false, tags: ['security', 'password'] },
  { id: 'random-string-generator', slug: 'random-string-generator', title: 'Random String Generator', category: 'security-utilities', description: 'Generate random alphanumeric strings.', isAsync: false, tags: ['random', 'string'] },
  { id: 'sec-password-generator', slug: 'sec-password-generator', title: 'Custom Rules Password Builder', category: 'security-utilities', description: 'Custom rules password builder.', isAsync: false, tags: ['password', 'secure'] },
  { id: 'sec-uuid-generator', slug: 'sec-uuid-generator', title: 'Secure UUID Generator', category: 'security-utilities', description: 'Secure UUID generation.', isAsync: false, tags: ['uuid', 'sec'] },
  { id: 'random-number-generator', slug: 'random-number-generator', title: 'Random Number Generator', category: 'security-utilities', description: 'Range-based random number generator.', isAsync: false, tags: ['random', 'math'] },
  { id: 'ip-address-lookup', slug: 'ip-address-lookup', title: 'IP Address Lookup', category: 'security-utilities', description: 'Retrieve public IP address & location info.', isAsync: true, tags: ['ip', 'geoip'] },
  { id: 'dns-lookup-tool', slug: 'dns-lookup-tool', title: 'DNS Lookup Tool', category: 'security-utilities', description: 'Perform live DNS queries (A, MX, TXT, NS, CNAME) for any domain.', isAsync: true, isNew: true, tags: ['dns', 'network'] },
  { id: 'ssl-certificate-inspector', slug: 'ssl-certificate-inspector', title: 'SSL / TLS Certificate Inspector', category: 'security-utilities', description: 'Check domain SSL certificate validity, issuer, and expiration date.', isAsync: true, isNew: true, tags: ['ssl', 'security'] },
  { id: 'whois-domain-lookup', slug: 'whois-domain-lookup', title: 'WHOIS Domain Lookup', category: 'security-utilities', description: 'Inspect domain registration records, registrar details, and dates.', isAsync: true, isNew: true, tags: ['whois', 'domain'] },
  { id: 'jwt-generator', slug: 'jwt-generator', title: 'JWT Generator', category: 'security-utilities', description: 'Create and sign JSON Web Tokens with custom payloads and secrets.', isAsync: false, isNew: true, tags: ['jwt', 'auth'] },
  { id: 'bcrypt-hash-verify', slug: 'bcrypt-hash-verify', title: 'Bcrypt Hash & Verify', category: 'security-utilities', description: 'Generate Bcrypt password hashes and verify plain-text against hashes.', isAsync: false, isNew: true, tags: ['bcrypt', 'password'] },
  { id: 'rsa-key-generator', slug: 'rsa-key-generator', title: 'RSA Key Pair Generator', category: 'security-utilities', description: 'Generate RSA public and private key pairs in PEM format.', isAsync: false, isNew: true, tags: ['rsa', 'encryption'] },
  { id: 'subnet-calculator', slug: 'subnet-calculator', title: 'Subnet Calculator', category: 'security-utilities', description: 'Calculate IPv4 subnets, CIDR ranges, broadcast addresses, and host counts.', isAsync: false, isNew: true, tags: ['network', 'subnet', 'cidr'] },
  { id: 'port-scanner', slug: 'port-scanner', title: 'Port Scanner', category: 'security-utilities', description: 'Scan common ports on any IP or domain to check open/closed status.', isAsync: true, isNew: true, tags: ['network', 'ports', 'security'] },
  { id: 'ping-traceroute', slug: 'ping-traceroute-tool', title: 'Ping / Traceroute Tool', category: 'security-utilities', description: 'Check server latency and network routing paths for any domain or IP.', isAsync: true, isNew: true, tags: ['network', 'ping', 'latency'] },

  // --- SEO TOOLS (9 built) ---
  { id: 'keyword-density-checker', slug: 'keyword-density-checker', title: 'Keyword Density Checker', category: 'seo-tools', description: 'Frequency analysis for keywords in articles.', isAsync: false, tags: ['seo', 'keywords'] },
  { id: 'meta-tag-analyzer', slug: 'meta-tag-analyzer', title: 'Meta Tag Analyzer', category: 'seo-tools', description: 'Inspect title, meta description, and social tags.', isAsync: true, tags: ['seo', 'meta'] },
  { id: 'sitemap-generator', slug: 'sitemap-generator', title: 'Sitemap Generator', category: 'seo-tools', description: 'Create sitemap.xml files from website URLs.', isAsync: true, tags: ['sitemap', 'xml'] },
  { id: 'open-graph-preview', slug: 'open-graph-preview', title: 'Open Graph Preview', category: 'seo-tools', description: 'Preview social card previews (Twitter/FB/LinkedIn).', isAsync: false, tags: ['og', 'social'] },
  { id: 'canonical-url-checker', slug: 'canonical-url-checker', title: 'Canonical URL Checker', category: 'seo-tools', description: 'Check URL formatting and canonical tags.', isAsync: true, tags: ['canonical', 'url'] },
  { id: 'page-speed-estimator', slug: 'page-speed-estimator', title: 'Page Speed Estimator', category: 'seo-tools', description: 'Estimate page load speeds across 2G/3G/LTE/WiFi.', isAsync: true, tags: ['speed', 'performance'] },
  { id: 'backlink-checker', slug: 'backlink-checker', title: 'Backlink Checker', category: 'seo-tools', description: 'SEO backlink building suggestions & resources.', isAsync: true, tags: ['backlinks', 'seo'] },
  { id: 'seo-score-checker', slug: 'seo-score-checker', title: 'SEO Score Checker', category: 'seo-tools', description: 'Calculate content health scores.', isAsync: true, tags: ['score', 'audit'] },
  { id: 'google-index-checker', slug: 'google-index-checker', title: 'Google Index Checker', category: 'seo-tools', description: 'Check indexability readiness.', isAsync: true, tags: ['google', 'indexing'] },

  // --- FILE TOOLS (8 built + 1 upcoming) + 2 new ---
  { id: 'pdf-to-word', slug: 'pdf-to-word-converter', title: 'PDF to Word Converter', category: 'file-tools', description: 'Convert PDF documents to Word (.doc/.docx).', isAsync: true, tags: ['pdf', 'word'] },
  { id: 'word-to-pdf', slug: 'word-to-pdf-converter', title: 'Word to PDF Converter', category: 'file-tools', description: 'Export Word files (.docx) to PDF format.', isAsync: true, tags: ['word', 'pdf'] },
  { id: 'pdf-compressor', slug: 'pdf-compressor', title: 'PDF Compressor', category: 'file-tools', description: 'Reduce PDF file size while maintaining readability.', isAsync: true, tags: ['pdf', 'compress'] },
  { id: 'merge-pdf', slug: 'merge-pdf', title: 'Merge PDF', category: 'file-tools', description: 'Merge multiple PDFs into a single document.', isAsync: true, tags: ['pdf', 'merge'] },
  { id: 'split-pdf', slug: 'split-pdf', title: 'Split PDF', category: 'file-tools', description: 'Split PDF page ranges into separate files.', isAsync: true, tags: ['pdf', 'split'] },
  { id: 'zip-extractor', slug: 'zip-extractor', title: 'ZIP Extractor', category: 'file-tools', description: 'Inspect and extract .zip archive structures.', isAsync: true, tags: ['zip', 'archive'] },
  { id: 'file-size-converter', slug: 'file-size-converter', title: 'File Size Converter', category: 'file-tools', description: 'Convert Bytes, KB, MB, GB, and TB.', isAsync: false, tags: ['file', 'bytes'] },
  { id: 'video-to-mp3', slug: 'video-to-mp3-converter', title: 'Video to MP3 Converter', category: 'file-tools', description: 'Extract MP3 audio tracks from uploaded videos.', isAsync: true, tags: ['video', 'mp3'] },
  { id: 'audio-cutter', slug: 'audio-cutter-trimmer', title: 'Audio Cutter / Trimmer', category: 'file-tools', description: 'Trim audio files directly with precision start and end markers.', isAsync: true, isNew: true, tags: ['audio', 'trim'] },
  { id: 'exif-viewer', slug: 'exif-data-viewer', title: 'EXIF Data Viewer & Stripper', category: 'file-tools', description: 'Inspect hidden metadata in photos (GPS, camera model) and strip it for privacy.', isAsync: false, isNew: true, tags: ['exif', 'metadata'] },
  { id: 'pdf-to-image', slug: 'pdf-to-image-extractor', title: 'PDF to Image Extractor', category: 'file-tools', description: 'Extract every PDF page as high-resolution JPG images.', isAsync: true, isNew: true, tags: ['pdf', 'image'] },
  { id: 'video-to-gif', slug: 'video-to-gif-converter', title: 'Video to GIF Converter', category: 'file-tools', description: 'Convert short MP4/WebM video clips into optimized animated GIFs.', isAsync: true, isNew: true, tags: ['video', 'gif', 'animation'] },
  { id: 'audio-transcription', slug: 'audio-video-transcription', title: 'Audio / Video Transcription', category: 'file-tools', description: 'Transcribe speech from audio and video files using AI-powered speech-to-text.', isAsync: true, isNew: true, tags: ['audio', 'transcription', 'speech'] },

  // --- AI & LLM TOOLS (3 new) ---
  { id: 'llm-token-counter', slug: 'llm-token-counter', title: 'LLM Token Counter', category: 'ai-llm-tools', description: 'Count tokens accurately using standard tokenizers and estimate API costs.', isAsync: false, isNew: true, tags: ['ai', 'llm', 'token'] },
  { id: 'system-prompt-builder', slug: 'system-prompt-builder', title: 'System Prompt Builder', category: 'ai-llm-tools', description: 'Structured form with Role, Constraints, Tone, and Output Format fields to compile optimized system prompts.', isAsync: false, isNew: true, tags: ['ai', 'prompt'] },
  { id: 'text-to-embeddings', slug: 'text-to-embeddings', title: 'Text to Embeddings', category: 'ai-llm-tools', description: 'Convert text strings into vector arrays to visualize embedding data.', isAsync: false, isNew: true, tags: ['ai', 'embeddings', 'vector'] },
  { id: 'ai-image-prompt-generator', slug: 'ai-image-prompt-generator', title: 'AI Image Prompt Generator', category: 'ai-llm-tools', description: 'Visual builder with dropdowns for style, lighting, camera, and mood to generate AI art prompts.', isAsync: false, isNew: true, tags: ['ai', 'prompt', 'midjourney', 'dalle'] },
  { id: 'rag-chunking-visualizer', slug: 'rag-chunking-visualizer', title: 'RAG Chunking Visualizer', category: 'ai-llm-tools', description: 'Visualize how different chunking strategies split documents before vectorization.', isAsync: false, isNew: true, tags: ['ai', 'rag', 'chunking', 'embeddings'] },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug);
}

export function getToolById(id: string): ToolDefinition | undefined {
  return ALL_TOOLS.find((t) => t.id === id);
}

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return TOOL_CATEGORIES.find((c) => c.slug === slug);
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  return ALL_TOOLS.filter((t) => t.category === categoryId);
}
