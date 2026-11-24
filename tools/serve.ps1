# Positronics: run an unzipped server pack (tools\make_server_pack.ps1) for local play-testing, with the
# bundled JDK so nobody needs Java on the PATH. Players join with Direct Connect -> localhost.
#
# Usage: powershell -ExecutionPolicy Bypass -File tools\serve.ps1 -ServerDir <dir> [-Java <java.exe>]
# Console commands: write them (one per line) to <dir>\console-in.txt; they are sent within a second.
#   e.g. "stop" saves the world and shuts down. The server log is <dir>\logs\latest.log.
# The server dir must have Forge installed (run start.bat once) and eula.txt accepted.

param(
    [Parameter(Mandatory = $true)][string]$ServerDir,
    [string]$Java = 'D:\AI_Projects\usrg_automation\.jdk\jdk-17.0.19+10\bin\java.exe'
)

$ErrorActionPreference = 'Stop'
$args_file = 'libraries\net\minecraftforge\forge\1.20.1-47.4.0\win_args.txt'
if (-not (Test-Path (Join-Path $ServerDir $args_file))) { throw "Forge is not installed in $ServerDir (run start.bat once)." }

$psi = New-Object Diagnostics.ProcessStartInfo $Java
$psi.Arguments = "@positronics_jvm_args.txt @$($args_file -replace '\\', '/') nogui"
$psi.WorkingDirectory = $ServerDir
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true
$proc = [Diagnostics.Process]::Start($psi)
# .NET's own stdin writer puts a UTF-8 byte-order mark into the pipe as soon as the process starts, and the
# server would read the first command as "?stop". Spend it on an empty line, then write without a BOM.
$stdin = New-Object IO.StreamWriter($proc.StandardInput.BaseStream, (New-Object Text.UTF8Encoding $false))
$stdin.AutoFlush = $true
$stdin.WriteLine('')
Write-Host "server started (pid $($proc.Id)); commands go to $ServerDir\console-in.txt"

$inbox = Join-Path $ServerDir 'console-in.txt'
while (-not $proc.HasExited) {
    if (Test-Path $inbox) {
        Get-Content $inbox | Where-Object { $_ } | ForEach-Object { $stdin.WriteLine($_); Write-Host "> $_" }
        Remove-Item $inbox -Force
    }
    Start-Sleep -Milliseconds 1000
}
Write-Host "server exited ($($proc.ExitCode))"
