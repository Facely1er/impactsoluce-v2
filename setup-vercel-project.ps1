# Setup Vercel Project Script for ImpactSoluce
# This script helps initialize the Vercel project

Write-Host "=== ImpactSoluce Vercel Project Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if logged in
$authCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Not logged in to Vercel" -ForegroundColor Yellow
    Write-Host "Please run: vercel login" -ForegroundColor Cyan
    Write-Host "This will open your browser to authenticate." -ForegroundColor White
    Write-Host ""
    $login = Read-Host "Do you want to login now? (y/n)"
    if ($login -eq "y" -or $login -eq "Y") {
        vercel login
    } else {
        Write-Host "Please login first, then run this script again." -ForegroundColor Yellow
        exit
    }
} else {
    Write-Host "✓ Logged in to Vercel" -ForegroundColor Green
    Write-Host ""
}

$workspaceRoot = $PSScriptRoot
if (-not $workspaceRoot) {
    $workspaceRoot = Get-Location
}

Write-Host "=== Initializing Vercel Project ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "When prompted:" -ForegroundColor Yellow
Write-Host "  - Choose: Link to existing project (or create new)" -ForegroundColor White
Write-Host "  - Project name: impact-soluce-platform (or your choice)" -ForegroundColor White
Write-Host "  - Root directory: . (current directory)" -ForegroundColor White
Write-Host "  - Build command: npm install && npm run build" -ForegroundColor White
Write-Host "  - Output directory: dist" -ForegroundColor White
Write-Host "  - Framework: Vite" -ForegroundColor White
Write-Host ""
$continue = Read-Host "Press Enter to continue with project setup"

vercel link

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure environment variables in Vercel dashboard:" -ForegroundColor White
Write-Host "   - VITE_SUPABASE_URL" -ForegroundColor Gray
Write-Host "   - VITE_SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host "   - VITE_APP_NAME (optional)" -ForegroundColor Gray
Write-Host "   - VITE_APP_URL (optional)" -ForegroundColor Gray
Write-Host "   - VITE_ENABLE_DEMO_MODE (optional)" -ForegroundColor Gray
Write-Host "   - VITE_ENABLE_ANALYTICS (optional)" -ForegroundColor Gray
Write-Host "2. Set up custom domain if needed" -ForegroundColor White
Write-Host "3. Deploy using: .\deploy-vercel.ps1" -ForegroundColor White
Write-Host ""

