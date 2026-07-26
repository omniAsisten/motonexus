# MotoNexus Toolkit - Frontend UI & Local Integration Guide

Este es la interfaz gráfica profesional para el **MotoNexus Toolkit** (diagnóstico de dispositivos Motorola Edge, inspección de variables Fastboot y auditorías de seguridad).

---

## 🚀 1. Exportación e Instalación Local

1. En **AI Studio**, abre el menú de ajustes (esquina superior / menú lateral) y selecciona **Exportar / Descargar ZIP** (o vincula con GitHub).
2. Extrae el contenido en tu directorio local de trabajo para **Antigravity**.
3. Abre una terminal en la carpeta e instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo local:
   ```bash
   npm run dev
   ```

---

## 🔌 2. Conexión con Backend Local (Python / FastAPI + ADB & Fastboot)

Para conectar esta interfaz gráfica con tu teléfono conectado físicamente por USB, puedes crear un archivo `server.py` en Python utilizando FastAPI y ejecuciones `subprocess` de ADB/Fastboot.

### Ejemplo de Backend en Python (`server.py`):

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI(title="MotoNexus Local Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/dispositivos")
def obtener_dispositivos():
    try:
        resultado = subprocess.run(["adb", "devices"], capture_output=True, text=True)
        return {"output": resultado.stdout}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/fastboot/variables")
def obtener_variables_fastboot():
    try:
        resultado = subprocess.run(["fastboot", "getvar", "all"], capture_output=True, text=True)
        # Parsear las líneas "... (bootloader) key: value" a un diccionario JSON
        vars_dict = {}
        for line in resultado.stderr.splitlines():
            if "(bootloader)" in line:
                partes = line.replace("(bootloader)", "").strip().split(":", 1)
                if len(partes) == 2:
                    vars_dict[partes[0].strip()] = partes[1].strip()
        return {"variables": vars_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reinicio")
def reiniciar_dispositivo():
    try:
        resultado = subprocess.run(["fastboot", "reboot"], capture_output=True, text=True)
        return {"status": "ok", "message": resultado.stdout}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS 4 + Lucide React Icons
- **Diseño:** Tema "Elegant Dark" personalizado
