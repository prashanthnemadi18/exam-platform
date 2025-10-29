# Build and Deploy Script with Auto-Open

Write-Host "Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Deploying to Vercel..." -ForegroundColor Green
    
    # Deploy and capture output
    $output = npx vercel --prod 2>&1 | Out-String
    Write-Host $output
    
    # Extract the production URL
    if ($output -match "Production: (https://[^\s]+)") {
        $url = $matches[1]
        Write-Host "`nOpening website: $url" -ForegroundColor Green
        Start-Process $url
    } else {
        # Fallback to main domain
        $url = "https://online-platfrom.vercel.app"
        Write-Host "`nOpening main website: $url" -ForegroundColor Green
        Start-Process $url
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
}
