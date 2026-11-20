# Positronics: headless smoke test on a dedicated Forge server.
# Copies the instance's mods (minus client-only mods), deploys this repo's pack files,
# boots the server once (fresh world), dumps the item registry, and reports errors.
#
# Usage: powershell -ExecutionPolicy Bypass -File tools\server-test.ps1 -ServerDir <dir> [-Java <java.exe>] [-TimeoutSec 600]
# The server dir must already contain a Forge 1.20.1-47.4.0 server install (installer --installServer).

param(
    [Parameter(Mandatory = $true)][string]$ServerDir,
    [string]$Instance = 'D:\Minecraft\Instances\Positronics',
    [string]$Java = 'D:\AI_Projects\usrg_automation\.jdk\jdk-17.0.19+10\bin\java.exe',
    [int]$TimeoutSec = 600
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$clientOnly = 'embeddium|LegendaryTooltips|Iceberg|^Prism|MouseTweaks|Controlling|Searchables|ToastControl|great_scrollable_tooltips|defaultoptions|hideexperimentalwarning|^CTM-'

# 1) Mods: mirror from the instance, skipping client-only and disabled jars.
$mods = Join-Path $ServerDir 'mods'
if (Test-Path $mods) { Remove-Item $mods -Recurse -Force }
New-Item -ItemType Directory $mods | Out-Null
Get-ChildItem (Join-Path $Instance 'mods') -Filter *.jar | Where-Object { $_.Name -notmatch $clientOnly } | Copy-Item -Destination $mods
Write-Host "mods: $((Get-ChildItem $mods).Count) jars"

# 2) Pack files: instance configs first (generated defaults), then this repo on top.
foreach ($dir in 'config', 'defaultconfigs', 'kubejs') {
    $dst = Join-Path $ServerDir $dir
    if (Test-Path $dst) { Remove-Item $dst -Recurse -Force }
    if (Test-Path (Join-Path $Instance $dir)) { robocopy (Join-Path $Instance $dir) $dst /E /NJH /NJS /NP /NDL /XD probe | Out-Null }
}
& (Join-Path $PSScriptRoot 'deploy.ps1') -Instance $ServerDir -SkipModsCheck | Out-Null

# 3) Test-only script: dump every item id once the server is up.
$dump = Join-Path $ServerDir 'kubejs\server_scripts\zz_server_test_dump.js'
@'
ServerEvents.loaded(event => {
    JsonIO.write('kubejs/exported/positronics_items.json', { items: Ingredient.all.itemIds })
    let caps = {}
    let names = ['ein', 'zwei', 'drei', 'vier', 'sphere', 'omega']
    let ids = names.map(n => 'projecte:klein_star_' + n)
    ;['magnum', 'colossal', 'gargantuan'].forEach(k => names.forEach(n => ids.push('projectexpansion:' + k + '_star_' + n)))
    ids.push('projectexpansion:final_star')
    ids.forEach(id => {
        try { let st = Item.of(id); caps[id] = String(st.item.getMaximumEmc(st)) } catch (e) { caps[id] = 'error: ' + e }
    })
    JsonIO.write('kubejs/exported/positronics_star_caps.json', caps)
    console.info('[ServerTest] item + star dumps written')
    event.server.scheduleInTicks(60, () => event.server.runCommandSilent('stop'))
})
'@ | Set-Content -Path $dump -Encoding utf8

# 4) Fresh world, accepted EULA, skyblock level type.
foreach ($p in 'world', 'logs', 'kubejs\exported') { $full = Join-Path $ServerDir $p; if (Test-Path $full) { Remove-Item $full -Recurse -Force } }
New-Item -ItemType Directory -Force (Join-Path $ServerDir 'kubejs\exported') | Out-Null
Set-Content (Join-Path $ServerDir 'eula.txt') 'eula=true'
@"
level-type=skyblockbuilder\:skyblock
online-mode=false
spawn-protection=0
max-tick-time=-1
"@ | Set-Content (Join-Path $ServerDir 'server.properties')
Set-Content (Join-Path $ServerDir 'user_jvm_args.txt') '-Xmx6G'

# 5) Boot. The test script above stops the server itself once the dumps are written.
$proc = Start-Process -FilePath $Java -ArgumentList '@user_jvm_args.txt', '@libraries/net/minecraftforge/forge/1.20.1-47.4.0/win_args.txt', 'nogui' `
    -WorkingDirectory $ServerDir -NoNewWindow -PassThru `
    -RedirectStandardOutput (Join-Path $ServerDir 'console.out.log') -RedirectStandardError (Join-Path $ServerDir 'console.err.log')
if (-not $proc.WaitForExit($TimeoutSec * 1000)) { $proc.Kill(); $result = 'timeout (killed)' } else { $result = "exited ($($proc.ExitCode))" }

$latest = Join-Path $ServerDir 'logs\latest.log'
$done = (Test-Path $latest) -and (Select-String -Path $latest -Pattern 'Done \(\d' -Quiet)
Write-Host "RESULT: $result; server reached Done: $done; dumps: $(Test-Path (Join-Path $ServerDir 'kubejs\exported\positronics_items.json'))"
$kjs = Join-Path $ServerDir 'logs\kubejs\server.log'
if (Test-Path $kjs) {
    Write-Host '--- KubeJS server.log errors/warnings ---'
    Select-String -Path $kjs -Pattern '\[ERR|\[WARN|Error' | Where-Object { $_.Line -notmatch "server.log may not contain|full log \(including" } | Select-Object -First 40 | ForEach-Object { $_.Line }
}
$startup = Join-Path $ServerDir 'logs\kubejs\startup.log'
if (Test-Path $startup) {
    Write-Host '--- KubeJS startup.log errors ---'
    Select-String -Path $startup -Pattern '\[ERR|Error' | Select-Object -First 20 | ForEach-Object { $_.Line }
}
$crash = Get-ChildItem (Join-Path $ServerDir 'crash-reports') -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($crash -and $crash.LastWriteTime -gt (Get-Date).AddSeconds(-$TimeoutSec - 120)) { Write-Host "CRASH REPORT: $($crash.FullName)" }
