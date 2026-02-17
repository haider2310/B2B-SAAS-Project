$body = @{
    lead_name = "John Doe"
    email = "john@example.com"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/inbound/test-company/my-key" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -ErrorAction Stop

Write-Host "Response:" -ForegroundColor Green
$response | ConvertTo-Json -Depth 3
