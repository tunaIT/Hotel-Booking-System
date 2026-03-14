$ErrorActionPreference = "Stop"

echo "=== Wait for server to start ==="
Start-Sleep -Seconds 10
echo "=== 1. Register User ==="
$regBody = @{ name="Tuan"; email="tuan@tuna.com"; password="password" } | ConvertTo-Json
$regRes = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/auth/register" -Body $regBody -ContentType "application/json"
echo "Register Response Token: $($regRes.token.Substring(0, 15))..."

echo "=== 2. Login User ==="
$logBody = @{ email="tuan@tuna.com"; password="password" } | ConvertTo-Json
$logRes = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/auth/login" -Body $logBody -ContentType "application/json"
$token = $logRes.token
echo "Login Response Token: $($token.Substring(0, 15))..."

echo "=== 3. Access Protected API ==="
try {
    Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/users"
    echo "ERROR: Should have been blocked!"
} catch {
    echo "Blocked without token (Expected)"
}

$headers = @{ Authorization = "Bearer $token" }
try {
    $apiRes = Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/users" -Headers $headers
    echo "Accessed /api/users successfully with token!"
} catch {
    echo "ERROR: Failed to access API with token"
    echo $_
}

echo "=== 4. Access Admin API ==="
try {
    Invoke-RestMethod -Method Get -Uri "http://localhost:8080/admin/dashboard" -Headers $headers
    echo "ERROR: Should have been blocked (User doesn't have ADMIN role)!"
} catch {
    echo "Blocked from admin API (Expected)"
}
