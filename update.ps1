# update.ps1 — Actualiza ComegenUI en el proyecto huésped desde el artifact del repo.
# Vive junto a la lib (se instala con el zip) y, sin -Only, reemplaza esta
# carpeta de forma atómica: si la descarga falla, lo anterior queda intacto.
#
# Uso:
#   .\update.ps1                          → actualiza TODA la lib (main)
#   .\update.ps1 v3.0.0                   → actualiza TODA la lib (tag/release)
#   .\update.ps1 -Only CuButton           → actualiza SOLO CuButton (main)
#   .\update.ps1 -Only CuButton,CuAlert   → actualiza solo esos componentes
#   .\update.ps1 -Only CuButton v3.0.0    → idem, pero desde un tag
#
#   -o es alias de -Only. Acepta `CuButton`, `button`, `cu-button` o
#   `CuButton.umd.js`, sin distinguir mayúsculas ni guiones.
#
# Modo -Only: NO reemplaza toda la carpeta. Descarga el build y copia solo los
# UMD elegidos + su doc (use-comegen/componentes/cu-*.md), dejando el resto de
# los componentes intactos (y sin tocar css/themes.css).
#
# Al actualizar (completo o selectivo) también actualiza la skill de uso
# (use-comegen/) en .agents/skills/ del proyecto huésped.
#
# Avanzados: $env:CG_URL para override de la URL (útil para probar con un archivo local)
# y $env:CG_PROJECT_ROOT para indicar la raíz del proyecto (si no, se detecta subiendo
# desde esta carpeta hasta .git / AGENTS.md / package.json).

$ErrorActionPreference = "Stop"

function Normalize-Component([string]$s) {
    $t = $s -replace '\.umd\.js$', ''
    $t = $t -replace '^[Cc]u', ''
    $t = $t -replace '[^A-Za-z0-9]', ''
    return $t.ToLower()
}

function Get-DocName([string]$file) {
    $base = $file -replace '\.umd\.js$', ''
    $base = $base -replace '^Cu', ''
    $kebab = $base -creplace '([a-z0-9])([A-Z])', '$1-$2'
    return "cu-$($kebab.ToLower()).md"
}

# --- Parseo de argumentos (sin param() para que --only/-Only funcione igual) ---
$isSwap = $false
$Tag = "main"
$Only = ""
if ($args.Count -gt 0 -and $args[0] -eq "__swap__") {
    $isSwap = $true
    $Tag = if ($args.Count -ge 2) { [string]$args[1] } else { "main" }
    $Self = if ($args.Count -ge 3) { [string]$args[2] } else { (Get-Location).Path }
    $Only = if ($args.Count -ge 4) { [string]$args[3] } else { "" }
} else {
    $i = 0
    while ($i -lt $args.Count) {
        $a = [string]$args[$i]
        if ($a -eq "--only" -or $a -eq "-Only" -or $a -eq "-o") {
            $i++
            if ($i -lt $args.Count) {
                $v = [string]$args[$i]
                $Only = if ($Only) { "$Only,$v" } else { $v }
                $i++
            }
        } elseif ($a -like "--only=*") {
            $v = $a.Substring(7)
            $Only = if ($Only) { "$Only,$v" } else { $v }
            $i++
        } elseif ($a -like "-*") {
            # Opción desconocida: ignorar (paridad con update.sh).
            $i++
        } else {
            $Tag = $a
            $i++
        }
    }
}

$Tmp = Join-Path ([System.IO.Path]::GetTempPath()) ([System.IO.Path]::GetRandomFileName())
New-Item -ItemType Directory -Path $Tmp | Out-Null
# CWD original del usuario: la pasada 2 sale del dir de la lib para poder
# renombrarla, y el finally lo restaura (no dejar al usuario en /tmp).
$prevLoc = $null

try {
    if ($isSwap) {
        # Segunda pasada: corremos desde una copia en TMP; el destino real llega en $args.
        # Windows no permite renombrar la carpeta que es el CWD del proceso
        # (doble-clic en update.bat o `cd lib && .\update.ps1`). Salimos de ahí;
        # el finally restaura el CWD original al terminar.
        $prevLoc = Get-Location
        Set-Location $Tmp
        $url = if ($env:CG_URL) { $env:CG_URL } else { "https://gitlab.com/SpicyDogWings/comegen-ui/-/jobs/artifacts/$Tag/download?job=build" }

        Write-Host "⬇️  Descargando build '$Tag'..."
        $zipPath = Join-Path $Tmp "comegenui.zip"
        Invoke-WebRequest -Uri $url -OutFile $zipPath

        $extractPath = Join-Path $Tmp "x"
        Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

        # Normalizar: si el artifact trae wrapper (dist/ o carpeta única), usar su contenido.
        $content = $extractPath
        if (Test-Path (Join-Path $extractPath "dist") -PathType Container) {
            $content = Join-Path $extractPath "dist"
        } elseif (Test-Path (Join-Path $extractPath "comegenui") -PathType Container) {
            $content = Join-Path $extractPath "comegenui"
        }

        # Instalar la skill de uso en .agents/skills/ del proyecto huésped.
        $projectRoot = $env:CG_PROJECT_ROOT
        if (-not $projectRoot) {
            $d = $Self
            while ($d) {
                if ((Test-Path (Join-Path $d ".git") -PathType Container) -or (Test-Path (Join-Path $d "AGENTS.md")) -or (Test-Path (Join-Path $d "package.json"))) {
                    $projectRoot = $d
                    break
                }
                $parent = Split-Path $d -Parent
                if (-not $parent -or $parent -eq $d) { break }
                $d = $parent
            }
        }

        if ($Only) {
            # --- Modo selectivo: copiar solo los UMD + doc elegidos -------------
            $contentFiles = Get-ChildItem -Path $content -Filter "Cu*.umd.js" -File
            $selectedDocs = @()
            $updated = 0
            foreach ($want in ($Only -split ',' | Where-Object { $_ })) {
                $wnorm = Normalize-Component $want
                $match = $contentFiles | Where-Object { (Normalize-Component $_.Name) -eq $wnorm } | Select-Object -First 1
                if (-not $match) {
                    Write-Host "⚠️  No se encontró '$want' en el build '$Tag' (se omite)"
                    continue
                }
                Copy-Item $match.FullName (Join-Path $Self $match.Name) -Force
                Write-Host "📦 $($match.Name) actualizado"
                $doc = Get-DocName $match.Name
                $docSrc = Join-Path $content "use-comegen/componentes/$doc"
                if (Test-Path $docSrc) {
                    $selfDocDir = Join-Path $Self "use-comegen/componentes"
                    New-Item -ItemType Directory -Path $selfDocDir -Force | Out-Null
                    Copy-Item $docSrc (Join-Path $selfDocDir $doc) -Force
                    $selectedDocs += $doc
                }
                $updated++
            }

            if ($updated -eq 0) {
                Write-Host "❌ Ningún componente coincidió con -Only ($Only). Nada se actualizó."
                exit 1
            }

            if ($projectRoot -and $selectedDocs.Count -gt 0) {
                $skillDir = Join-Path (Join-Path (Join-Path $projectRoot ".agents") "skills") "use-comegen"
                $destDir = Join-Path $skillDir "componentes"
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
                foreach ($doc in $selectedDocs) {
                    Copy-Item (Join-Path $Self "use-comegen/componentes/$doc") (Join-Path $destDir $doc) -Force
                }
                Write-Host "📚 Docs actualizadas en $destDir"
            } elseif (-not $projectRoot) {
                Write-Host "⚠️  No se detectó la raíz del proyecto (sin .git/AGENTS.md/package.json). Seteá `$env:CG_PROJECT_ROOT para instalar la skill en .agents/skills."
            }

            Write-Host "✅ ComegenUI '$Tag' actualizado (solo: $Only) en $Self"
            exit 0
        }

        # --- Modo completo: reemplazo atómico de toda la carpeta ----------------
        Write-Host "🔁 Reemplazando $Self ..."
        $oldPath = "$Self.old"
        if (Test-Path $oldPath) { Remove-Item $oldPath -Recurse -Force }
        if (Test-Path $Self) { Move-Item -Path $Self -Destination "$Self.old" -Force }
        Move-Item -Path $content -Destination $Self -Force

        # Si el build nuevo no trae update.ps1, restaurarlo (para seguir actualizando).
        if (-not (Test-Path (Join-Path $Self "update.ps1"))) {
            $oldPs1 = Join-Path $oldPath "update.ps1"
            if (Test-Path $oldPs1) { Copy-Item $oldPs1 (Join-Path $Self "update.ps1") -Force }
        }
        # update.sh también (por si el usuario está en Linux).
        if (-not (Test-Path (Join-Path $Self "update.sh"))) {
            $oldSh = Join-Path $oldPath "update.sh"
            if (Test-Path $oldSh) { Copy-Item $oldSh (Join-Path $Self "update.sh") -Force }
        }
        # Recién ahora se descarta el backup.
        if (Test-Path $oldPath) { Remove-Item $oldPath -Recurse -Force }

        if ($projectRoot -and (Test-Path (Join-Path $Self "use-comegen") -PathType Container)) {
            $skillsDir = Join-Path (Join-Path $projectRoot ".agents") "skills"
            New-Item -ItemType Directory -Path $skillsDir -Force | Out-Null
            $dest = Join-Path $skillsDir "use-comegen"
            if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
            Copy-Item -Path (Join-Path $Self "use-comegen") -Destination $dest -Recurse -Force
            Write-Host "📚 Skill de uso instalada en $dest"
        } elseif (-not $projectRoot) {
            Write-Host "⚠️  No se detectó la raíz del proyecto (sin .git/AGENTS.md/package.json). Seteá `$env:CG_PROJECT_ROOT para instalar la skill en .agents/skills."
        } else {
            Write-Host "⚠️  El build no incluye la skill use-comegen/, se omite la instalación en .agents/skills."
        }

        Write-Host "✅ ComegenUI '$Tag' actualizado en $Self"
        exit 0
    }

    # Primera pasada: capturamos la carpeta real y corremos desde una copia en temp
    # para poder reemplazar esta carpeta (incluido este mismo script) sin romper la
    # ejecución.
    $Self = Split-Path -Parent $MyInvocation.MyCommand.Path
    $selfPs1 = Join-Path $Tmp "self.ps1"
    Copy-Item $MyInvocation.MyCommand.Path $selfPs1
    & $selfPs1 __swap__ $Tag $Self $Only
    exit $LASTEXITCODE
} finally {
    if ($prevLoc) { Set-Location -LiteralPath $prevLoc.Path -ErrorAction SilentlyContinue }
    if (Test-Path $Tmp) { Remove-Item $Tmp -Recurse -Force -ErrorAction SilentlyContinue }
}
