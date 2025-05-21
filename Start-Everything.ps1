# Inicia o Minikube
minikube start

# Obtém o IP do Minikube
minikube ip

# Executa os scripts em segundo plano (processos separados)
Start-Process -NoNewWindow -FilePath "powershell.exe" -ArgumentList "-File", "./Forward-Database.ps1"
Start-Process -NoNewWindow -FilePath "powershell.exe" -ArgumentList "-File", "./Forward-Nginx.ps1"
Start-Process -NoNewWindow -FilePath "powershell.exe" -ArgumentList "-File", "./Forward-Auth-Node.ps1"

# Registra um evento de saída para quando o PowerShell for fechado
$exitingEvent = Register-EngineEvent PowerShell.Exiting -Action {
    Write-Host "PowerShell fechado. Parando o Minikube..."
    minikube stop
}

# Abre o dashboard do Minikube
minikube dashboard

# Aguarda o término do script (impede que o script se feche imediatamente)
while ($true) {
    Start-Sleep -Seconds 1
}
