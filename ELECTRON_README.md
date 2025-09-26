# Electron App Setup

This React CRM application has been wrapped with Electron to create a desktop application that can run on Windows, macOS, and Linux.

## Development

To run the app in development mode:

```bash
# Start the React development server and Electron
npm run electron:dev
```

This will:
1. Start the React development server on http://localhost:3000
2. Launch Electron and load the React app
3. Open DevTools for debugging

## Building for Production

### Build the React app and create Electron packages:

```bash
# Build for all platforms (current platform)
npm run electron:dist

# Build for specific platforms
npm run electron:dist:win    # Windows
npm run electron:dist:mac    # macOS
npm run electron:dist:linux  # Linux
```

### Build outputs

The built applications will be in the `dist-electron/` directory:
- **Windows**: `.exe` installer and portable version
- **macOS**: `.dmg` and `.zip` files
- **Linux**: `.AppImage` and `.deb` packages

## Available Scripts

- `npm run electron:dev` - Development mode with hot reload
- `npm run electron:start` - Start Electron with built React app
- `npm run electron:pack` - Build and package (without installer)
- `npm run electron:dist` - Build and create installers
- `npm run electron:dist:win` - Build for Windows only
- `npm run electron:dist:mac` - Build for macOS only
- `npm run electron:dist:linux` - Build for Linux only

## Cross-Platform Building

To build for all platforms from one machine, you can use:

```bash
# Install dependencies for cross-compilation
npm install --save-dev electron-builder

# Build for all platforms
npm run electron:dist
```

## Notes

- The app uses `contextIsolation: true` and `nodeIntegration: false` for security
- The preload script exposes safe APIs to the renderer process
- Icons are optional and can be added to the `public/` directory
- The app will automatically detect development vs production mode
