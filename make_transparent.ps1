Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("upla.png")
$bmp = New-Object System.Drawing.Bitmap($img)
$img.Dispose()
$bmp.MakeTransparent([System.Drawing.Color]::White)
$bmp.Save("upla.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
