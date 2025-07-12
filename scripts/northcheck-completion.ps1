# NorthCheck PowerShell Completion Script

Register-ArgumentCompleter -Native -CommandName northcheck -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
    
    $completions = @()
    
    # Get the command line as a string
    $commandLine = $commandAst.ToString()
    $words = $commandLine -split '\s+'
    
    # Remove the command name from words
    $words = $words[1..($words.Length-1)]
    
    if ($words.Length -eq 0) {
        # No subcommand yet, suggest subcommands
        $completions = @('link', 'file', '--help', '--version')
    } elseif ($words.Length -eq 1) {
        $subcommand = $words[0]
        
        if ($subcommand -eq 'link') {
            # For link command, suggest common URL schemes
            $completions = @('http://', 'https://')
        } elseif ($subcommand -eq 'file') {
            # For file command, suggest files in current directory
            $completions = Get-ChildItem -Name | Where-Object { $_ -like "*$wordToComplete*" }
        } elseif ($subcommand -like '--*') {
            # For options, suggest common options
            $completions = @('--json', '--help')
        }
    } elseif ($words.Length -eq 2) {
        $subcommand = $words[0]
        
        if ($subcommand -eq 'link') {
            # For link command with URL, suggest --json option
            $completions = @('--json')
        } elseif ($subcommand -eq 'file') {
            # For file command with file path, suggest --json option
            $completions = @('--json')
        }
    }
    
    $completions | Where-Object { $_ -like "*$wordToComplete*" } | ForEach-Object {
        [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
    }
}

# Also register for the 'nc' alias
Register-ArgumentCompleter -Native -CommandName nc -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
    
    $completions = @()
    
    # Get the command line as a string
    $commandLine = $commandAst.ToString()
    $words = $commandLine -split '\s+'
    
    # Remove the command name from words
    $words = $words[1..($words.Length-1)]
    
    if ($words.Length -eq 0) {
        # No subcommand yet, suggest subcommands
        $completions = @('link', 'file', '--help', '--version')
    } elseif ($words.Length -eq 1) {
        $subcommand = $words[0]
        
        if ($subcommand -eq 'link') {
            # For link command, suggest common URL schemes
            $completions = @('http://', 'https://')
        } elseif ($subcommand -eq 'file') {
            # For file command, suggest files in current directory
            $completions = Get-ChildItem -Name | Where-Object { $_ -like "*$wordToComplete*" }
        } elseif ($subcommand -like '--*') {
            # For options, suggest common options
            $completions = @('--json', '--help')
        }
    } elseif ($words.Length -eq 2) {
        $subcommand = $words[0]
        
        if ($subcommand -eq 'link') {
            # For link command with URL, suggest --json option
            $completions = @('--json')
        } elseif ($subcommand -eq 'file') {
            # For file command with file path, suggest --json option
            $completions = @('--json')
        }
    }
    
    $completions | Where-Object { $_ -like "*$wordToComplete*" } | ForEach-Object {
        [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
    }
}

Write-Host "NorthCheck PowerShell completion registered successfully!" -ForegroundColor Green
Write-Host "You can now use Tab completion with 'northcheck' and 'nc' commands." -ForegroundColor Yellow 