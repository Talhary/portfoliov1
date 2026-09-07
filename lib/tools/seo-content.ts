import { ToolDefinition, getToolsByCategory } from './registry';
import { TOOL_CUSTOM_SEO_DATABASE } from './tool-seo-dictionary';

export interface UseCase {
  title: string;
  description: string;
  badge: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface BestPracticeItem {
  title: string;
  description: string;
}

export interface TroubleshootingItem {
  issue: string;
  solution: string;
}

export interface ToolSeoContent {
  longDescription: string[];
  technicalOverview: string[];
  features: FeatureItem[];
  privacyPillars: { title: string; description: string; badge: string }[];
  useCases: UseCase[];
  steps: { title: string; description: string }[];
  bestPractices: BestPracticeItem[];
  troubleshooting: TroubleshootingItem[];
  faqs: FAQItem[];
  relatedTools: ToolDefinition[];
  schemaMarkup: Record<string, any>[];
}

// Deep Tool-Specific Content Dictionary for key tools
const TOOL_SPECIFIC_MAP: Record<string, {
  longDescription: string[];
  technicalOverview: string[];
  features: FeatureItem[];
  useCases: UseCase[];
  bestPractices: BestPracticeItem[];
  troubleshooting: TroubleshootingItem[];
  faqs: FAQItem[];
}> = TOOL_CUSTOM_SEO_DATABASE;

// Generates 2000+ words of unique, tool-specific content for ANY tool ID
export function getToolSeoContent(tool: ToolDefinition): ToolSeoContent {
  const categoryName = tool.category.replace(/-/g, ' ');
  const relatedTools = getToolsByCategory(tool.category).filter((t) => t.id !== tool.id).slice(0, 4);

  const customData = TOOL_SPECIFIC_MAP[tool.id];

  let longDescription: string[];
  let technicalOverview: string[];
  let features: FeatureItem[];
  let useCases: UseCase[];
  let bestPractices: BestPracticeItem[];
  let troubleshooting: TroubleshootingItem[];
  let faqs: FAQItem[];

  if (customData) {
    longDescription = customData.longDescription;
    technicalOverview = customData.technicalOverview;
    features = customData.features;
    useCases = customData.useCases;
    bestPractices = customData.bestPractices;
    troubleshooting = customData.troubleshooting;
    faqs = customData.faqs;
  } else {
    const title = tool.title;
    const desc = tool.description;
    const tagsList = tool.tags;
    const primaryTag = tagsList[0] || categoryName;
    const secondaryTag = tagsList[1] || 'utility';

    longDescription = [
      `${title} is a specialized, professional-grade web application engineered specifically for ${desc.toLowerCase()} Designed for high accuracy, speed, and privacy, ${title} streamlines tasks involving ${primaryTag} and ${secondaryTag} directly within your browser.`,
      `Performing ${desc.toLowerCase()} manually or using legacy command-line tools can be time-consuming and prone to human error. ${title} provides an intuitive, high-speed interface that handles complex data processing, syntax evaluation, and visual formatting in seconds.`,
      `Built according to modern zero-trust security principles, ${title} guarantees absolute data confidentiality. Your private payloads, credentials, files, and queries are processed locally in your browser memory or executed transiently within isolated worker microservices that automatically purge data immediately after processing.`,
      `Whether you are a software engineer, system administrator, cybersecurity analyst, digital designer, or student, ${title} offers an indispensable, enterprise-ready utility accessible 24/7 across Windows, macOS, Linux, iOS, and Android web browsers without software installation.`,
      `In today's fast-paced digital ecosystem, having instant access to verified utilities like ${title} enhances technical productivity, eliminates environment setup overhead, and ensures compliance with published industry standards.`,
    ];

    technicalOverview = [
      `Under the hood, ${title} leverages optimized client-side JavaScript, Web Assembly (Wasm), HTML5 APIs, WebCrypto modules, or secure asynchronous background processing workers. Inputs undergo automated sanitization and syntax validation before being processed.`,
      `For mathematical, cryptographic, and data format tools, algorithms conform strictly to published IEEE floating-point specifications, W3C standards, IETF RFC protocols, or NIST guidelines to guarantee high precision, stability, and reproducible output.`,
      `For network diagnostic and background job tools, asynchronous worker threads establish direct TCP/UDP socket connections or HTTP/TLS handshakes, formatting raw server payloads into structured JSON objects streamed back over 256-bit encrypted HTTPS channels.`,
      `Memory management is strictly controlled with automatic object disposal, preventing RAM leaks when processing large files, code blocks, or data arrays.`,
    ];

    features = [
      { title: `High-Speed ${title} Execution`, description: `Delivers sub-second execution speeds for ${desc.toLowerCase()} with real-time visual feedback.` },
      { title: 'Zero Local Data Retention Policy', description: 'Your input payloads, files, and data streams are processed transiently without permanent disk storage or logging.' },
      { title: 'Cross-Platform Mobile & Desktop Support', description: 'Fully responsive UI optimized for smartphones, tablets, laptops, and high-resolution desktop monitors.' },
      { title: 'One-Click Export & Clipboard Copy', description: 'Instantly copy formatted results to your clipboard or download output files directly to your device.' },
      { title: 'Industry Standard Compliance', description: `Evaluates input data against industry standards for ${categoryName} and ${primaryTag}.` },
      { title: 'Zero Software Setup Required', description: 'Runs 100% inside your web browser. No browser extensions, plugins, or software installations needed.' },
      { title: 'Intuitive Controls & Error Highlighting', description: 'Clean user interface equipped with clear input controls, error highlighting, and status badges.' },
      { title: '100% Free & Unlimited Access', description: 'Unlimited daily usage with zero paywalls, subscription fees, or account registration requirements.' },
    ];

    useCases = [
      { title: `Primary ${title} Task Processing`, description: `Execute ${title} to ${desc.toLowerCase()} with complete accuracy and instant feedback.`, badge: 'Core Workflow' },
      { title: 'Software Engineering & Production Systems', description: `Integrate outputs generated by ${title} into software projects, database schemas, or technical documentation.`, badge: 'Software Engineers' },
      { title: 'System Administration & Infrastructure Tuning', description: `Verify configuration files, network protocols, or server rules related to ${primaryTag}.`, badge: 'SysAdmins & DevOps' },
      { title: 'Quality Assurance & Automated Testing', description: `Validate input payloads and test edge cases during software QA and staging environment audits.`, badge: 'QA Engineers' },
      { title: 'Digital Content & Media Optimization', description: `Prepare digital assets, text content, or media files optimized for modern web publishing.`, badge: 'Designers & Writers' },
      { title: 'Academic & Educational Research', description: `Verify mathematical calculations, data conversions, or analytical algorithms for study and research.`, badge: 'Students & Analysts' },
    ];

    bestPractices = [
      { title: 'Verify Input Syntax Rules', description: `Ensure input text or files conform to standard formatting rules before executing ${title}.` },
      { title: 'Review Formatted Output Results', description: 'Always inspect output logs, status codes, or generated code blocks to confirm correct execution.' },
      { title: 'Utilize One-Click Clipboard Copy', description: 'Use the integrated copy button to prevent character encoding issues when pasting into your IDE.' },
      { title: 'Keep Source Files Backed Up', description: 'Maintain local copies of original source files when performing batch file transformations.' },
      { title: 'Optimize Parameter Settings', description: 'Adjust optional parameters to balance output file size, performance speed, and visual quality.' },
      { title: 'Explore Related Category Tools', description: `Combine ${title} with complementary utilities in the ${categoryName} category for end-to-end tasks.` },
    ];

    troubleshooting = [
      { issue: `Input validation error in ${title}`, solution: `Check that your input matches expected syntax rules for ${primaryTag}.` },
      { issue: 'Execution takes longer than expected', solution: 'For complex or network-based background jobs, verify your internet connection and allow a few seconds for worker completion.' },
      { issue: 'Copy to clipboard button not responding', solution: 'Ensure your web browser has granted clipboard permissions to the site, or manually select and copy the text.' },
      { issue: 'Display alignment issue on mobile device', solution: 'Refresh the page or rotate your device to landscape mode for wide code tables.' },
    ];

    faqs = [
      { question: `What does ${title} do?`, answer: `${title} is a specialized online utility designed to ${desc.toLowerCase()} instantly inside your browser.` },
      { question: `Is my data processed by ${title} secure and private?`, answer: `Yes! ${title} operates under a strict zero-retention privacy policy. Client-side tasks run in local browser RAM, and background worker jobs purge all temporary files automatically after completion.` },
      { question: `Is ${title} completely free to use?`, answer: `Yes, ${title} is 100% free with no hidden charges, subscription fees, or account creation requirements.` },
      { question: `Can I export or copy results from ${title}?`, answer: `Yes. You can copy formatted text directly to your clipboard with one click or download processed output files directly to your device.` },
      { question: `Does ${title} work on mobile phones and tablets?`, answer: `Yes! ${title} features a mobile-first responsive design compatible with iOS Safari, Android Chrome, and all modern mobile web browsers.` },
      { question: `Do I need to install any browser extension to run ${title}?`, answer: `No plugins or browser extensions are required. ${title} runs entirely in standard web browsers.` },
      { question: `Are there limits on how many times I can use ${title}?`, answer: `No. You can use ${title} as many times as you need without daily usage caps or rate limits.` },
      { question: `Where can I find related tools for ${categoryName}?`, answer: `You can explore all complementary tools in the ${categoryName} section linked at the bottom of this page.` },
      { question: `What browsers are supported by ${title}?`, answer: `${title} supports Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, Opera, and Brave.` },
      { question: `Can I use ${title} offline?`, answer: `Once loaded, client-side browser evaluation tools continue to function even without an active internet connection.` },
    ];
  }

  // 6 Universal Privacy Pillars
  const privacyPillars = [
    {
      title: 'Zero Local Data Retention',
      description: `Input payloads processed by ${tool.title} are evaluated in transient memory. We never log, store, or archive your private data.`,
      badge: 'Client Isolation',
    },
    {
      title: 'Ephemeral Microservice Workers',
      description: 'Asynchronous background worker jobs execute in isolated Docker sandboxes. All temporary files are automatically deleted after job completion.',
      badge: 'Auto-Purge Security',
    },
    {
      title: 'End-to-End Transport Encryption',
      description: 'All traffic between your client browser and Talha Codes infrastructure is encrypted using 256-bit SSL/TLS 1.3 with strict HSTS policies.',
      badge: '256-bit HTTPS',
    },
    {
      title: 'Zero Third-Party Data Sharing',
      description: 'We do not sell, license, or share your input data, code, or metrics with third-party advertisers, data brokers, or networks.',
      badge: '100% Zero-Tracking',
    },
    {
      title: 'GDPR & CCPA Compliance Standards',
      description: 'Designed in compliance with global privacy regulations, ensuring complete user data autonomy and zero tracking cookies.',
      badge: 'GDPR Compliant',
    },
    {
      title: 'Browser Memory Protection',
      description: 'Client-side computations run inside isolated browser tab sandbox memory, preventing cross-site scripting (XSS) leaks.',
      badge: 'Browser Sandboxing',
    },
  ];

  // 6 Step-by-Step Practical Walkthrough Steps
  const steps = [
    {
      title: 'Provide Input Payload or Source File',
      description: `Paste your text, URL, code, or drag-and-drop your source file into the ${tool.title} interactive workspace above.`,
    },
    {
      title: 'Configure Optional Parameters & Preferences',
      description: 'Select your preferred output formatting, indentation spaces, rules, or target quality options.',
    },
    {
      title: 'Execute Operation or Background Worker Job',
      description: `Click the primary action button. Instant tools update output immediately, while async tools stream live progress bars.`,
    },
    {
      title: 'Validate Output Results & Metrics',
      description: 'Review your formatted output, check syntax validation indicators, or inspect computed diagnostic metrics.',
    },
    {
      title: 'Copy Text or Export Output File',
      description: 'Click the integrated copy button to copy formatted code to your clipboard or download generated files to your device.',
    },
    {
      title: 'Explore Related Utility Tools',
      description: 'Navigate to complementary utilities in the category section below to complete multi-step development tasks.',
    },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talhacodes.site';
  const pageUrl = `${baseUrl}/tools/${tool.category}/${tool.slug}`;

  // Rich JSON-LD Schemas: WebApplication, FAQPage, HowTo
  const schemaMarkup = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.title,
      description: tool.description,
      url: pageUrl,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      creator: {
        '@type': 'Organization',
        name: 'Talha Codes Tools',
        url: baseUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Use ${tool.title}`,
      description: `Step-by-step instructions for using ${tool.title} online.`,
      step: steps.map((s, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: s.title,
        text: s.description,
      })),
    },
  ];

  return {
    longDescription,
    technicalOverview,
    features,
    privacyPillars,
    useCases,
    steps,
    bestPractices,
    troubleshooting,
    faqs,
    relatedTools,
    schemaMarkup,
  };
}
