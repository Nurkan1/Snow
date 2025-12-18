# ❄️ Snow Overlay - Aplicación de Nieve Navideña

Una aplicación portable para Windows que simula nieve cayendo sobre tu escritorio, creando un ambiente navideño mientras trabajas.

## ✨ Características

- **Fondo transparente**: La nieve cae sobre todas tus aplicaciones
- **Click-through**: Puedes seguir usando tu PC normalmente
- **Ajustes personalizables**:
  - Densidad de nieve (cantidad de copos)
  - Velocidad de caída
  - Tamaño de los copos
  - Dirección y fuerza del viento
  - Opacidad de los copos
- **Portable**: Un solo archivo .exe, sin instalación

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + Shift + S` | Abrir/Cerrar menú de ajustes |
| `Ctrl + Shift + Q` | Cerrar la aplicación |

## 🚀 Instalación y Uso

### Opción 1: Usar el ejecutable portable
1. Descarga `SnowOverlay-Portable.exe`
2. Ejecuta el archivo
3. ¡Disfruta de la nieve!

### Opción 2: Ejecutar desde código fuente
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

### Opción 3: Compilar tu propio ejecutable
```bash
# Instalar dependencias
npm install

# Compilar ejecutable portable
npm run build
```

El ejecutable se generará en la carpeta `dist/`.

## 🛠️ Requisitos para desarrollo

- Node.js 18+
- npm o yarn

## 📁 Estructura del Proyecto

```
Snow/
├── main.js           # Proceso principal de Electron
├── preload.js        # Script de precarga (bridge seguro)
├── package.json      # Configuración del proyecto
├── renderer/
│   ├── index.html    # Ventana principal (canvas de nieve)
│   ├── snow.js       # Motor de animación de nieve
│   ├── settings.html # Ventana de ajustes
│   ├── settings.css  # Estilos de la ventana de ajustes
│   └── settings.js   # Lógica de la ventana de ajustes
└── assets/
    └── icon.ico      # Icono de la aplicación
```

## 🎄 ¡Feliz Navidad!

Disfruta del ambiente navideño mientras trabajas en tu PC.
