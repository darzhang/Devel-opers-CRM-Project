git reset --hard origin/main
git pull
Set-Location .\CRM_Backend
npm run publishToHeroku
Set-Location ..\.\crm_frontend
npm run publishToHeroku
Set-Location ..