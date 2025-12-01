// build.js - Build script to replace environment variables
const fs = require('fs');
const path = require('path');

// Read environment variables
const env = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY
};

// Check if all required environment variables are present
const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'OPENROUTER_API_KEY'];
const missingVars = requiredVars.filter(varName => !env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  process.exit(1);
}

// Read the HTML file
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace the default values with environment variables
const configScript = `
  <script>
    // Environment variables configuration
    window.env = {
      SUPABASE_URL: '${env.SUPABASE_URL}',
      SUPABASE_ANON_KEY: '${env.SUPABASE_ANON_KEY}',
      OPENROUTER_API_KEY: '${env.OPENROUTER_API_KEY}'
    };
  </script>
`;

// Find and replace the config script section
const scriptStart = '<!-- Add a configuration script that will read environment variables -->';
const scriptEnd = '</script>';

const startIndex = html.indexOf(scriptStart);
const endIndex = html.indexOf('</script>', html.indexOf('<script>', startIndex)) + 9;

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + 
         scriptStart + 
         configScript + 
         html.substring(endIndex);
  
  // Write the modified HTML file
  fs.writeFileSync(htmlPath, html);
  console.log('Environment variables injected successfully!');
} else {
  console.error('Could not find the configuration script section in HTML');
  process.exit(1);
}
