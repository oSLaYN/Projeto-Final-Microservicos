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

$service = kubectl get service tasks-node -n tasks-node --no-headers -o custom-columns=":metadata.name" 2>$null

if (-not $service) {
    Write-Host "`n[ERRO] Serviço 'tasks-node' não encontrado. Verifique se o serviço está correto."
    exit
}

Write-Host "`nIniciando port-forward de localhost:31500 -> tasks-node:2750"
kubectl port-forward service/tasks-node 31500:2750 -n tasks-node