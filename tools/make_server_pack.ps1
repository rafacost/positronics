# Positronics: build the dedicated-server pack (the "server file" uploaded with each CurseForge release,
# used by one-click installs such as BisectHosting's, or run locally).
#
# Usage: powershell -ExecutionPolicy Bypass -File tools\make_server_pack.ps1 [-Instance <path>] [-OutDir <dir>] [-Ram 6G]
# Output: <OutDir>\Positronics-Server-<VERSION>.zip (default OutDir: dist\ in the repo, git-ignored)
#
# What goes in: the instance's mods minus client-only ones (tools\client-only-mods.txt), the instance's
# config/defaultconfigs/kubejs with this repo deployed on top (same as tools\server-test.ps1), a
# server.properties for the Skyblock Builder world, and start scripts that install Forge on first run.
# Forge itself is not bundled: start.bat / start.sh download the official installer.

param(
    [string]$Instance = 'D:\Minecraft\Instances\Positronics Dev',
    [string]$OutDir = '',
    [string]$Ram = '6G'
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
if (-not $OutDir) { $OutDir = Join-Path $repo 'dist' }
$version = (Get-Content (Join-Path $repo 'VERSION') -TotalCount 1).Trim()
$mc = '1.20.1'
$forge = '47.4.0'
$name = "Positronics-Server-$version"
$stage = Join-Path ([IO.Path]::GetTempPath()) "positronics-serverpack\$name"

if (-not (Test-Path "$Instance\mods")) { throw "Instance not found or has no mods folder: $Instance" }
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force $stage | Out-Null

# 1) Mods: every enabled jar except the client-only ones.
$clientOnly = (Get-Content (Join-Path $PSScriptRoot 'client-only-mods.txt') | Where-Object { $_ -and -not $_.StartsWith('#') }) -join '|'
New-Item -ItemType Directory (Join-Path $stage 'mods') | Out-Null
$jars = Get-ChildItem (Join-Path $Instance 'mods') -Filter *.jar
$kept = $jars | Where-Object { $_.Name -notmatch $clientOnly }
$kept | Copy-Item -Destination (Join-Path $stage 'mods')
Write-Host "mods: $($kept.Count) of $($jars.Count) jars (client-only left out: $(($jars | Where-Object { $_.Name -match $clientOnly } | ForEach-Object { $_.BaseName }) -join ', '))"

# 2) Pack files: the instance's generated configs first, then this repo on top.
foreach ($dir in 'config', 'defaultconfigs', 'kubejs') {
    $src = Join-Path $Instance $dir
    if (Test-Path $src) {
        robocopy $src (Join-Path $stage $dir) /E /NJH /NJS /NP /NDL /XD probe exported local /XF *.log | Out-Null
        if ($LASTEXITCODE -ge 8) { throw "robocopy failed for $dir ($LASTEXITCODE)" }
    }
}
& (Join-Path $PSScriptRoot 'deploy.ps1') -Instance $stage -SkipModsCheck 6>$null | Out-Null
# EMI's cheat mode is a developer setting; never ship it on.
$emi = Join-Path $stage 'config\emi.css'
if (Test-Path $emi) { (Get-Content $emi) -replace 'cheat-mode:\s*true', 'cheat-mode: false' | Set-Content $emi -Encoding ascii }

# 3) Server settings. The level type makes the world a Skyblock Builder island (our Waste Lands template).
@"
#Positronics $version
level-type=skyblockbuilder\:skyblock
motd=Positronics $version
allow-flight=true
spawn-protection=0
max-tick-time=-1
view-distance=10
simulation-distance=8
online-mode=true
"@ | Set-Content (Join-Path $stage 'server.properties') -Encoding ascii

# Our JVM arguments live in their own file: the Forge installer writes (and may overwrite) user_jvm_args.txt.
@"
# Positronics server memory. 6G is comfortable for one or two players; raise -Xmx for more.
-Xmx$Ram
-Xms2G
"@ | Set-Content (Join-Path $stage 'positronics_jvm_args.txt') -Encoding ascii

$installer = "https://maven.minecraftforge.net/net/minecraftforge/forge/$mc-$forge/forge-$mc-$forge-installer.jar"

$bat = @"
@echo off
rem Positronics $version server. Needs Java 17 on the PATH.
setlocal
cd /d "%~dp0"
where java >nul 2>nul || (echo Java 17 is required: install it and make sure "java" is on the PATH. & pause & exit /b 1)
if not exist "libraries\net\minecraftforge\forge\$mc-$forge\win_args.txt" (
    echo Installing Forge $mc-$forge for the first run...
    if not exist forge-installer.jar powershell -NoProfile -Command "Invoke-WebRequest -UseBasicParsing -Uri '$installer' -OutFile forge-installer.jar"
    java -jar forge-installer.jar --installServer || (echo Forge install failed. & pause & exit /b 1)
    del /q forge-installer.jar forge-installer.jar.log 2>nul
)
java @positronics_jvm_args.txt @libraries/net/minecraftforge/forge/$mc-$forge/win_args.txt nogui %*
pause
"@
# cmd wants CRLF line endings in a batch file.
[IO.File]::WriteAllText((Join-Path $stage 'start.bat'), (($bat -replace "`r`n", "`n") -replace "`n", "`r`n"), [Text.Encoding]::ASCII)

# start.sh must have LF line endings to run on Linux hosts.
$sh = @"
#!/usr/bin/env sh
# Positronics $version server. Needs Java 17 on the PATH.
cd "`$(dirname "`$0")"
command -v java >/dev/null 2>&1 || { echo "Java 17 is required: install it and make sure java is on the PATH."; exit 1; }
if [ ! -f "libraries/net/minecraftforge/forge/$mc-$forge/unix_args.txt" ]; then
    echo "Installing Forge $mc-$forge for the first run..."
    if [ ! -f forge-installer.jar ]; then
        if command -v curl >/dev/null 2>&1; then curl -fsSL -o forge-installer.jar "$installer"
        else wget -q -O forge-installer.jar "$installer"; fi
    fi
    java -jar forge-installer.jar --installServer || { echo "Forge install failed."; exit 1; }
    rm -f forge-installer.jar forge-installer.jar.log
fi
exec java @positronics_jvm_args.txt @libraries/net/minecraftforge/forge/$mc-$forge/unix_args.txt nogui "`$@"
"@
[IO.File]::WriteAllText((Join-Path $stage 'start.sh'), ($sh -replace "`r`n", "`n"), [Text.Encoding]::ASCII)

@"
POSITRONICS $version - DEDICATED SERVER
Minecraft $mc, Forge $forge, Java 17.

FIRST RUN
1. Unzip this folder somewhere empty.
2. Windows: double-click start.bat. Linux/macOS: sh start.sh
   The first run downloads and installs Forge $forge, then the server stops and asks you to accept
   the Minecraft EULA: open eula.txt, change eula=false to eula=true, and start it again.
3. Join from the Positronics client (CurseForge app): Multiplayer > Direct Connect > localhost
   (or your server's address).

MEMORY
positronics_jvm_args.txt sets the server's RAM (-Xmx$Ram). The client wants about 6 GB as well, so a
PC hosting its own server should have 16 GB.

GOOD TO KNOW
- The world is a Skyblock Builder island (level-type in server.properties). Delete the "world"
  folder to start over.
- Positronics is designed and tested as single player. One player on a 24/7 server works the same;
  teams and multiple islands aren't supported yet.
- Machines only run in loaded chunks: claim and force-load your factory with FTB Chunks (map key M).
- Hunger keeps burning while you're AFK. Log out instead of idling, or you'll starve overnight.
- Found a problem? https://github.com/rafacost/positronics/issues/new/choose
  Attach logs/latest.log and logs/kubejs/server.log.
"@ | Set-Content (Join-Path $stage 'README-SERVER.txt') -Encoding ascii

# 4) Zip it.
New-Item -ItemType Directory -Force $OutDir | Out-Null
$zip = Join-Path $OutDir "$name.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[IO.Compression.ZipFile]::CreateFromDirectory($stage, $zip, [IO.Compression.CompressionLevel]::Optimal, $false)
Remove-Item $stage -Recurse -Force
Write-Host ("Server pack: $zip ({0:N0} MB)" -f ((Get-Item $zip).Length / 1MB))
