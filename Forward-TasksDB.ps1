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

$service_tasks = kubectl get service tasks-db -n tasks-db --no-headers -o custom-columns=":metadata.name" 2>$null

if (-not $service_tasks) {
    Write-Host "`n[ERRO] Serviço 'tasks-db' não encontrado. Verifique se o serviço está correto."
    exit
}

Write-Host "`nIniciando port-forward de localhost:32051 -> tasks-db:3307"
kubectl port-forward service/tasks-db 32051:3307 -n tasks-db