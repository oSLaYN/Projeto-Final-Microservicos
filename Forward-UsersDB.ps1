if (-not (Get-Command "kubectl" -ErrorAction SilentlyContinue)) {
    Write-Host "kubectl não encontrado. Verifique se está instalado e no PATH."
    exit
}

# Verifica se o Minikube está em execução
$minikubeStatus = minikube status | Select-String -Pattern "host: Running"

if (-not $minikubeStatus) {
    Write-Host "`nMinikube não está em execução. Inicie o Minikube antes de rodar o script."
    exit
}

$service_users = kubectl get service users-db -n users-db --no-headers -o custom-columns=":metadata.name" 2>$null

if (-not $service_users) {
    Write-Host "`n[ERRO] Serviço 'users-db' não encontrado. Verifique se o serviço está correto."
    exit
}

Write-Host "`nIniciando port-forward de localhost:32052 -> users-db:3308"
kubectl port-forward service/users-db 32052:3308 -n users-db