const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const completionScriptPath = path.join(__dirname, 'northcheck-completion.bash');
const powershellScriptPath = path.join(__dirname, 'northcheck-completion.ps1');
const bashrcPath = path.join(os.homedir(), '.bashrc');
const sourceCommand = `source ${completionScriptPath}`;

function setupCompletion() {
  const platform = os.platform();
  
  console.log(`\n🚀 NorthCheck CLI Installation`);
  console.log(`Platform detected: ${platform}`);
  
  if (platform === 'linux' || platform === 'darwin') {
    // Linux/macOS - setup bash completion
    fs.readFile(bashrcPath, 'utf8', (err, data) => {
      if (err && err.code !== 'ENOENT') {
        console.error(`❌ Error reading ${bashrcPath}:`, err.message);
        return;
      }
      
      if (!data || !data.includes(sourceCommand)) {
        fs.appendFile(bashrcPath, `
# NorthCheck CLI completion
${sourceCommand}
`, (err) => {
          if (err) {
            console.error(`❌ Error appending to ${bashrcPath}:`, err.message);
            console.log(`💡 You can manually add this line to your ~/.bashrc:`);
            console.log(`   ${sourceCommand}`);
          } else {
            console.log(`✅ NorthCheck CLI completion enabled in ${bashrcPath}`);
            console.log(`💡 Please run 'source ~/.bashrc' or restart your terminal to activate completion.`);
          }
        });
      } else {
        console.log(`✅ NorthCheck CLI completion already enabled in ${bashrcPath}`);
      }
    });
  } else if (platform === 'win32') {
    // Windows - setup PowerShell completion
    console.log(`\n📝 Windows Installation Notes:`);
    console.log(`✅ NorthCheck CLI installed successfully!`);
    
    // Try to set up PowerShell completion
    try {
      const powershellProfile = execSync('powershell -Command "$PROFILE"', { encoding: 'utf8' }).trim();
      const profileDir = path.dirname(powershellProfile);
      
      // Create profile directory if it doesn't exist
      if (!fs.existsSync(profileDir)) {
        fs.mkdirSync(profileDir, { recursive: true });
      }
      
      // Check if PowerShell profile exists and add completion script
      let profileContent = '';
      try {
        profileContent = fs.readFileSync(powershellProfile, 'utf8');
      } catch (err) {
        // Profile doesn't exist, create it
      }
      
      const completionLine = `. "${powershellScriptPath.replace(/\\/g, '/')}"`;
      
      if (!profileContent.includes(completionLine)) {
        profileContent += `\n# NorthCheck CLI completion\n${completionLine}\n`;
        fs.writeFileSync(powershellProfile, profileContent);
        console.log(`✅ PowerShell completion enabled in ${powershellProfile}`);
        console.log(`💡 Please restart PowerShell or run: . $PROFILE`);
      } else {
        console.log(`✅ PowerShell completion already enabled in ${powershellProfile}`);
      }
    } catch (error) {
      console.log(`⚠️  Could not automatically set up PowerShell completion: ${error.message}`);
      console.log(`💡 You can manually add this line to your PowerShell profile:`);
      console.log(`   . "${powershellScriptPath.replace(/\\/g, '/')}"`);
    }
    
    console.log(`\n💡 To use the CLI, open Command Prompt or PowerShell and run:`);
    console.log(`   northcheck --help`);
    console.log(`   or`);
    console.log(`   nc --help`);
    console.log(`\n🔧 For enhanced PowerShell experience, you can also install PSReadLine:`);
    console.log(`   Install-Module PSReadLine -Force`);
    console.log(`   Set-PSReadLineOption -PredictionSource History`);
  } else {
    // Other platforms
    console.log(`\n📝 Installation Notes:`);
    console.log(`✅ NorthCheck CLI installed successfully!`);
    console.log(`💡 To use the CLI, run:`);
    console.log(`   northcheck --help`);
    console.log(`   or`);
    console.log(`   nc --help`);
  }
  
  console.log(`\n🎉 Installation complete!`);
  console.log(`📚 For more information, visit: https://github.com/benoitpetit/northcheck`);
}

setupCompletion();