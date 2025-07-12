#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios');
const fs = require('fs').promises;
const crypto = require('crypto');
const path = require('path');
const os = require('os');

const program = new Command();

program
  .name('northcheck')
  .alias('nc')
  .description('CLI to check links and files for potential threats using NordVPN APIs')
  .version('1.0.0');

function displayRisk(data) {
  if (data && data.data && data.data.risk) {
    const risk = data.data.risk;
    let riskLevel = 'Unknown';
    let category = 'Unknown';

    if (risk.score >= 90) {
      riskLevel = 'Very High';
    } else if (risk.score >= 70) {
      riskLevel = 'High';
    } else if (risk.score >= 40) {
      riskLevel = 'Moderate';
    } else if (risk.score >= 10) {
      riskLevel = 'Low';
    } else {
      riskLevel = 'Very Low';
    }

    if (risk.categories && risk.categories.length > 0) {
      category = risk.categories.join(', ');
    }

    console.log(`
--- Analysis Result ---`);
    console.log(`Risk Level: ${riskLevel} (Score: ${risk.score})`);
    console.log(`Category(s): ${category}`);
    console.log(`
--- Raw Details ---`);
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('No risk information found.');
    console.log(JSON.stringify(data, null, 2));
  }
}

function normalizeFilePath(filePath) {
  // Handle Windows path separators and normalize the path
  return path.resolve(filePath);
}

function getPlatformUserAgent() {
  const platform = os.platform();
  const arch = os.arch();
  
  if (platform === 'win32') {
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
  } else if (platform === 'darwin') {
    return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
  } else {
    return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
  }
}

program.command('link')
  .description('Check a URL for potential threats')
  .argument('<url>', 'URL to check')
  .option('--json', 'Output raw JSON response')
  .action(async (url, options) => {
    try {
      console.log(`🔍 Checking URL: ${url}`);
      
      const response = await axios.post('https://link-checker.nordvpn.com/v1/public-url-checker/check-url', { url }, {
        headers: {
          'accept': 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'origin': 'https://nordvpn.com',
          'referer': 'https://nordvpn.com/',
          'user-agent': getPlatformUserAgent()
        },
        timeout: 30000 // 30 second timeout
      });
      
      if (options.json) {
        console.log(JSON.stringify(response.data, null, 2));
      } else {
        displayRisk(response.data);
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('❌ Request timeout. Please check your internet connection and try again.');
      } else if (error.code === 'ENOTFOUND') {
        console.error('❌ Network error. Please check your internet connection.');
      } else if (error.response) {
        console.error(`❌ API Error (${error.response.status}): ${error.response.statusText}`);
        if (options.json) {
          console.error('Response data:', error.response.data);
        }
      } else {
        console.error('❌ Error checking link:', error.message);
      }
      process.exit(1);
    }
  });

program.command('file')
  .description('Check a file for potential threats')
  .argument('<filePath>', 'Path to the file')
  .option('--json', 'Output raw JSON response')
  .action(async (filePath, options) => {
    try {
      const normalizedPath = normalizeFilePath(filePath);
      console.log(`🔍 Checking file: ${normalizedPath}`);
      
      // Check if file exists and is readable
      try {
        await fs.access(normalizedPath, fs.constants.R_OK);
      } catch (accessError) {
        console.error(`❌ Error: Cannot access file at ${normalizedPath}`);
        console.error(`   Make sure the file exists and you have read permissions.`);
        process.exit(1);
      }
      
      const fileBuffer = await fs.readFile(normalizedPath);
      const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      const stats = await fs.stat(normalizedPath);
      const size = stats.size;
      const name = path.basename(normalizedPath);

      console.log(`📊 File info: ${name} (${size} bytes, SHA256: ${sha256.substring(0, 8)}...)`);

      const response = await axios.post('https://file-checker.nordvpn.com/v1/public-filehash-checker/check', { sha256, size, name }, {
        headers: {
          'accept': 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'origin': 'https://nordvpn.com',
          'referer': 'https://nordvpn.com/',
          'user-agent': getPlatformUserAgent()
        },
        timeout: 30000 // 30 second timeout
      });
      
      if (options.json) {
        console.log(JSON.stringify(response.data, null, 2));
      } else {
        displayRisk(response.data);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(`❌ Error: File not found at ${filePath}`);
        console.error(`   Please check the file path and try again.`);
      } else if (error.code === 'EACCES') {
        console.error(`❌ Error: Permission denied accessing ${filePath}`);
        console.error(`   Please check file permissions.`);
      } else if (error.code === 'ECONNABORTED') {
        console.error('❌ Request timeout. Please check your internet connection and try again.');
      } else if (error.code === 'ENOTFOUND') {
        console.error('❌ Network error. Please check your internet connection.');
      } else if (error.response) {
        console.error(`❌ API Error (${error.response.status}): ${error.response.statusText}`);
        if (options.json) {
          console.error('Response data:', error.response.data);
        }
      } else {
        console.error('❌ Error checking file:', error.message);
      }
      process.exit(1);
    }
  });

// Add a default command to show help when no command is provided
if (process.argv.length === 2) {
  program.help();
}

program.parse(process.argv);
