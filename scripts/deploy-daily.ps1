Set-Location -LiteralPath "C:\Users\NEW TECH\Documents\Default Project\ace-the-pmp"
node "scripts\deploy-daily.mjs" *> "$env:LOCALAPPDATA\ace-the-pmp\deploy-daily.log"