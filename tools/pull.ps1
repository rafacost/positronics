# Positronics: bring back changes made inside the game (e.g. FTB Quests edited in-game,
# Skyblock Builder templates, configs tweaked in a menu) from the instance into the repo.
# Usage:  powershell -ExecutionPolicy Bypass -File tools\pull.ps1 [-Instance <path>]
# Afterwards review with `git diff` before committing: pull overwrites the repo copies.

param(
    [string]$Instance = 'D:\Minecraft\Instances\Positronics Dev'
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot

# 1) Our KubeJS script folders (mirror back).
foreach ($kind in 'startup_scripts', 'server_scripts', 'client_scripts') {
    $src = Join-Path $Instance "kubejs\$kind\positronics"
    if (Test-Path $src) {
        robocopy $src (Join-Path $repo "kubejs\$kind\positronics") /MIR /NJH /NJS /NP /NDL | Out-Null
        if ($LASTEXITCODE -ge 8) { throw "robocopy failed for $kind ($LASTEXITCODE)" }
    }
}

# 2) Content that is authored in-game: pulled as whole folders.
$authoredInGame = @(
    'config\ftbquests\quests',
    'config\skyblockbuilder'
)
foreach ($dir in $authoredInGame) {
    $src = Join-Path $Instance $dir
    if (Test-Path $src) {
        robocopy $src (Join-Path $repo $dir) /MIR /NJH /NJS /NP /NDL | Out-Null
        if ($LASTEXITCODE -ge 8) { throw "robocopy failed for $dir ($LASTEXITCODE)" }
        Write-Host "pulled $dir"
    }
}

# 3) Every other config file the repo already tracks: refresh from the instance.
Get-ChildItem (Join-Path $repo 'config') -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($repo.Length + 1)
    $inInstance = Join-Path $Instance $rel
    if ((Test-Path $inInstance) -and ($authoredInGame | Where-Object { $rel.StartsWith($_) }).Count -eq 0) {
        Copy-Item $inInstance $_.FullName -Force
    }
}

Write-Host 'Pull done. Review with: git -C' $repo 'diff --stat'
