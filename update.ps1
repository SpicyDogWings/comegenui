# update.ps1 — Actualiza ComegenUI en el proyecto huésped desde el artifact del repo.
# Vive junto a la lib (se instala con el zip) y reemplaza esta carpeta de forma
# atómica: si la descarga falla, lo anterior queda intacto.
#
# Uso:
#   .\update.ps1            → último build de main
#   .\update.ps1 v3.0.0     → build de un tag/release
#
# Al actualizar también instala la skill de uso (use-comegen/) en
# .agents/skills/ del proyecto huésped, para que los agentes tengan la doc.
#
# Avanzados: $env:CG_URL para override de la URL (útil para probar con un archivo local)
# y $env:CG_PROJECT_ROOT para indicar la raíz del proyecto (si no, se detecta subiendo
# desde esta carpeta hasta .git / AGENTS.md / package.json).

param(
    [string]$Tag = "main"
)

$ErrorActionPreference = "Stop"

$Self = Split-Path -Parent $MyInvocation.MyCommand.Path
$Tmp = Join-Path ([System.IO.Path]::GetTempPath()) ([System.IO.Path]::GetRandomFileName())
New-Item -ItemType Directory -Path $Tmp | Out-Null

try {
    if ($Tag -eq "__swap__") {
        # Segunda pasada: corremos desde una copia en TMP; el destino real llega en $Args[1].
        $Tag = if ($Args[0]) { $Args[0] } else { "main" }
        $Self = $Args[1]
        # Windows no permite renombrar la carpeta que es el CWD del proceso
        # (doble-clic en update.bat o `cd lib && .\update.ps1`). Salimos de ahí.
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

        # Instalar la skill de uso en .agents/skills/ del proyecto huésped.
        $projectRoot = $env:CG_PROJECT_ROOT
        if (-not $projectRoot) {
            $d = $Self
            while ($d -ne (Split-Path $d -Parent) -and -not (Test-Path (Join-Path $d ".git") -PathType Container) -and -not (Test-Path (Join-Path $d "AGENTS.md")) -and -not (Test-Path (Join-Path $d "package.json"))) {
                $d = Split-Path $d -Parent
            }
            if ($d -ne (Split-Path $d -Parent)) {
                $projectRoot = $d
            }
        }

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
    # El tag llega por el param $Tag (bind posicional desde update.bat o la CLI),
    # NO por $args — que queda vacío cuando el param lo captura.
    $tagArg = $Tag
    & $selfPs1 __swap__ $tagArg $Self
} finally {
    if (Test-Path $Tmp) { Remove-Item $Tmp -Recurse -Force -ErrorAction SilentlyContinue }
}
