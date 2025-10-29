# Open Public Website Script

Write-Host "Opening your public website..." -ForegroundColor Cyan

$url = "https://online-platfrom.vercel.app"

Write-Host "Website URL: $url" -ForegroundColor Green
Start-Process $url

Write-Host "`nWebsite opened in your browser!" -ForegroundColor Green
Write-Host "`nYour public URLs:" -ForegroundColor Yellow
Write-Host "- Homepage: https://online-platfrom.vercel.app" -ForegroundColor White
Write-Host "- Student Registration: https://online-platfrom.vercel.app/register" -ForegroundColor White
Write-Host "- Teacher Login: https://online-platfrom.vercel.app/login" -ForegroundColor White
Write-Host "- Teacher Dashboard: https://online-platfrom.vercel.app/dashboard" -ForegroundColor White
