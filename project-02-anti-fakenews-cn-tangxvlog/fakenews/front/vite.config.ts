import { defineConfig, type ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { spawn } from 'node:child_process'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

// https://vite.dev/config/
type Next = (err?: unknown) => void
const devBackendHelper = () => ({
  name: 'dev-backend-helper',
  configureServer(server: ViteDevServer) {
    let child: ReturnType<typeof spawn> | null = null
    server.middlewares.use('/__dev/restart-backend', (req: IncomingMessage, res: ServerResponse, next: Next) => {
      if (req.method !== 'POST') return next()
      if (child && !child.killed) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ started: true, alreadyRunning: true }))
        return
      }
      const cwd = path.resolve(process.cwd(), '../backend')
      const isWin = process.platform === 'win32'
      const command = isWin ? 'cmd.exe' : './mvnw'
      const args = isWin ? ['/c', 'mvnw.cmd', '-q', 'spring-boot:run'] : ['-q', 'spring-boot:run']
      child = spawn(command, args, { cwd })
      child.on('exit', () => { child = null })
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ started: true }))
    })
  },
})

export default defineConfig({
  plugins: [vue(), devBackendHelper()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
