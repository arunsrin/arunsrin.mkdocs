# 🪟 Windows

## Change a wireless network to Private

```powershell
  Get-NetConnectionProfile
  # Note the InterfaceIndex here
  Set-NetConnectionProfile -InterfaceIndex <id>  -NetworkCategory Private
```

