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

$service = kubectl get service maria-db -n maria-db --no-headers -o custom-columns=":metadata.name" 2>$null

if (-not $service) {
    Write-Host "`n[ERRO] Serviço 'maria-db' não encontrado. Verifique se o serviço está correto."
    exit
}

Write-Host "`nIniciando port-forward de localhost:30000 -> maria-db:3306"
kubectl port-forward service/maria-db 30000:3306 -n maria-db