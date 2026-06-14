Write-Host "NEXORA V4 Windows reset" -ForegroundColor Cyan
npm config set registry https://registry.npmjs.org/
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
if (Test-Path pnpm-lock.yaml) { Remove-Item -Force pnpm-lock.yaml }
npm install
npm run build
Write-Host "Done." -ForegroundColor Green
