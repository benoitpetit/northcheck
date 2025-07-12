# NorthCheck

<p align="center">
  <img src="./logo.png" alt="NorthCheck Logo" width="200" />
<br>
A CLI tool to check links and files for <br>potential threats using NordVPN APIs.
</p>


## Installation

```bash
npm install -g northcheck
```

The package provides two command aliases: `northcheck` and `nc`.

### Autocompletion Setup

During installation, a `postinstall` script automatically sets up autocompletion:

- **Linux/macOS**: Bash completion is automatically configured
- **Windows**: PowerShell completion is automatically configured

**Important:** For the autocompletion to take effect:
- **Linux/macOS**: Run `source ~/.bashrc` or restart your terminal
- **Windows**: Restart PowerShell or run `. $PROFILE`

## Usage

The CLI provides two main commands: `link` and `file`.

### 1. Check a URL (`link` command)

Checks a given URL for potential threats using NordVPN's link checker API.

```bash
nc link <url> [options]
# or
northcheck link <url> [options]
```

**Arguments:**
- `<url>`: The URL to check.

**Options:**
- `--json`: Output the raw JSON response from the API.

**Example:**
```bash
nc link https://example.com
nc link https://malicious-site.com --json
```

### 2. Check a File (`file` command)

Checks a local file for potential threats using NordVPN's file hash checker API. This command automatically calculates the SHA256 hash, file size, and extracts the file name.

```bash
nc file <filePath> [options]
# or
northcheck file <filePath> [options]
```

**Arguments:**
- `<filePath>`: The path to the local file to check.

**Options:**
- `--json`: Output the raw JSON response from the API.

**Example:**
```bash
nc file ./my_document.pdf
nc file /home/user/downloads/suspicious.exe --json
# Windows example:
nc file "C:\Users\username\Downloads\suspicious.exe"
```

## API Integration

NorthCheck integrates with NordVPN's security APIs:

- **Link Checker API**: `https://link-checker.nordvpn.com/v1/public-url-checker/check-url`
- **File Hash Checker API**: `https://file-checker.nordvpn.com/v1/public-filehash-checker/check`

The tool automatically handles:
- API authentication headers
- File hash calculation (SHA256)
- File metadata extraction
- Risk assessment display
- Cross-platform path handling

## Risk Assessment

The tool provides risk assessment with the following levels:
- **Very High**: Score 90-100
- **High**: Score 70-89
- **Moderate**: Score 40-69
- **Low**: Score 10-39
- **Very Low**: Score 0-9

## Autocompletion

### Linux/macOS (Bash)
Once autocompletion is set up, you can use the `Tab` key for:
- Completing `nc` or `northcheck` commands
- Completing subcommands like `file` or `link`
- Autocompleting file paths after `nc file `

### Windows (PowerShell)
PowerShell autocompletion provides:
- Command and subcommand completion
- File path suggestions for the `file` command
- Option completion (--json, --help, etc.)

**Example:**
Type `nc file test` and press `Tab` to autocomplete `test.txt` (if it exists in the current directory).

## Cross-Platform Compatibility

NorthCheck is fully compatible with:
- **Windows**: Command Prompt and PowerShell
- **Linux**: All major distributions
- **macOS**: Terminal and iTerm2

### Platform-Specific Features
- **Windows**: Automatic PowerShell profile configuration
- **Linux/macOS**: Automatic bash completion setup
- **All platforms**: Platform-specific User-Agent strings for better API compatibility

## Features

- **URL Threat Detection**: Check URLs for malicious content using NordVPN's link checker
- **File Security Analysis**: Analyze local files using SHA256 hash checking
- **Risk Scoring**: Get detailed risk assessments with categories
- **JSON Output**: Option to get raw API responses for advanced usage
- **Cross-Platform Autocompletion**: Enhanced command-line experience with tab completion
- **Error Handling**: Comprehensive error messages and troubleshooting guidance
- **Timeout Protection**: 30-second timeout for API requests
- **File Access Validation**: Automatic file existence and permission checking

## Requirements

- Node.js >= 14.0.0
- Internet connection
- Bash shell (for autocompletion on Linux/macOS)
- PowerShell (for autocompletion on Windows)

## Troubleshooting

### Common Issues

**File not found error:**
- Ensure the file path is correct
- Use quotes around paths with spaces: `nc file "My File.pdf"`
- On Windows, use forward slashes or escaped backslashes: `nc file "C:/Users/name/file.txt"`

**Permission denied:**
- Check file permissions
- On Windows, run PowerShell as Administrator if needed

**Network errors:**
- Check your internet connection
- Verify firewall settings
- Try again in a few minutes

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues

If you encounter any issues, please report them on the [GitHub issues page](https://github.com/benoitpetit/northcheck/issues).

---

### Support the Project

If you find northcheck cli useful, consider supporting its development:

[![Donate on Liberapay](https://img.shields.io/badge/Liberapay-Donate-yellow.svg)](https://liberapay.com/devbyben/donate)

Your support helps maintain and improve northcli