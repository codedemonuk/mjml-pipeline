# MJML Pipeline

An efficient pipeline for generating HTML emails from MJML source.

1. Convert MJML to HTML
2. Inline CSS
3. Minify HTML
4. Accessibility check

Emails should be created in the `src` folder with a `.mjml` extension.
The gulp file will process them and drop them into the `dist` folder in minified and non-minified versions.
The non-minified versions will make it easier to fix any WCAG violations by helping to identify the specific code fragment that is in violation.
