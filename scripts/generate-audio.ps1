$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media, ContentType = WindowsRuntime]
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesisStream, Windows.Media, ContentType = WindowsRuntime]
$voice = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$voice.Voice = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object Language -eq 'cs-CZ' | Select-Object -First 1
if (-not $voice.Voice -or $voice.Voice.Language -ne 'cs-CZ') { throw 'Czech voice is not installed.' }
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
$entries = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $PSScriptRoot 'audio-texts.json') | ConvertFrom-Json
$count = 0
try {
  foreach ($entry in $entries.PSObject.Properties) {
    $file = Join-Path $PSScriptRoot ('..\dist\assets\audio\' + $entry.Name + '.wav')
    $op = $voice.SynthesizeTextToStreamAsync([string]$entry.Value)
    $task = $asTask.MakeGenericMethod([Windows.Media.SpeechSynthesis.SpeechSynthesisStream]).Invoke($null,@($op))
    $task.Wait()
    $stream = $task.Result
    $read = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
    $out = [System.IO.File]::Create($file)
    try { $read.CopyTo($out) } finally { $out.Dispose(); $read.Dispose(); $stream.Dispose() }
    $count++
  }
} finally { $voice.Dispose() }
Write-Output "Generated $count Czech WAV files using Microsoft Jakub (Windows WinRT)."
