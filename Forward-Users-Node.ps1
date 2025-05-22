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

$service = kubectl get service users-node -n users-node --no-headers -o custom-columns=":metadata.name" 2>$null

if (-not $service) {
    Write-Host "`n[ERRO] Serviço 'users-node' não encontrado. Verifique se o serviço está correto."
    exit
}

Write-Host "`nIniciando port-forward de localhost:32000 -> users-node:5000"
kubectl port-forward service/users-node 32000:5000 -n users-node