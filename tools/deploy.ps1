# Positronics: copy the pack sources from this repo into the test instance.
# Usage:  powershell -ExecutionPolicy Bypass -File tools\deploy.ps1 [-Instance <path>]
# The repo is the source of truth for everything it tracks. Untracked instance files are left alone.

param(
    [string]$Instance = 'D:\Minecraft\Instances\Positronics'
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot

if (-not (Test-Path "$Instance\mods")) { throw "Instance not found or has no mods folder: $Instance" }

# 1) Our KubeJS script folders are mirrored exactly (deleted scripts are removed in the instance too).
foreach ($kind in 'startup_scripts', 'server_scripts', 'client_scripts') {
    $src = Join-Path $repo "kubejs\$kind\positronics"
    $dst = Join-Path $Instance "kubejs\$kind\positronics"
    if (Test-Path $src) {
        robocopy $src $dst /MIR /NJH /NJS /NP /NDL | Out-Null
        if ($LASTEXITCODE -ge 8) { throw "robocopy failed for $kind ($LASTEXITCODE)" }
        Write-Host "mirrored kubejs\$kind\positronics"
    }
}

# 2) Other tracked kubejs content (assets, data, config) and tracked configs: copied over (no deletions).
foreach ($dir in 'kubejs\assets', 'kubejs\data', 'kubejs\config', 'config', 'defaultconfigs') {
    $src = Join-Path $repo $dir
    if (Test-Path $src) {
        robocopy $src (Join-Path $Instance $dir) /E /NJH /NJS /NP /NDL | Out-Null
        if ($LASTEXITCODE -ge 8) { throw "robocopy failed for $dir ($LASTEXITCODE)" }
        Write-Host "copied $dir"
    }
}

Write-Host "Deploy done -> $Instance. Restart the game (KubeJS recipe/startup changes need a full restart)."
