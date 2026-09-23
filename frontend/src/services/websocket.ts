import { applyPatch } from 'fast-json-patch'

export type WebSocketListener = (data: any) => void

export class GoXLRWebSocket {
  private ws: WebSocket | null = null
  private requestId = 0
  private pendingRequests = new Map<number, (res: any) => void>()
  private listeners = new Set<WebSocketListener>()
  private micLevelListeners = new Set<(level: number) => void>()
  private url: string

  public status: any = null

  constructor(url?: string) {
    if (url) {
      this.url = url
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      this.url = `${protocol}//${window.location.host}/api/websocket`
    }
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)
      } catch (err) {
        reject(err)
        return
      }

      this.ws.onopen = () => {
        console.log('[GoXLR WS] Connected')
        this.fetchStatus().then(() => resolve()).catch(reject)
      }

      this.ws.onclose = () => {
        console.warn('[GoXLR WS] Disconnected. Reconnecting in 2s...')
        setTimeout(() => this.connect(), 2000)
      }

      this.ws.onerror = (err) => {
        console.error('[GoXLR WS] Error', err)
      }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (err) {
          console.error('[GoXLR WS] Parse error', err)
        }
      }
    })
  }

  private handleMessage(msg: any) {
    const { id, data } = msg

    if (id !== undefined && this.pendingRequests.has(id)) {
      const resolver = this.pendingRequests.get(id)!
      this.pendingRequests.delete(id)
      resolver(data)
    }

    if (data) {
      if (data.Status) {
        this.status = data.Status
        this.notifyListeners()
      } else if (data.Patch && this.status) {
        try {
          applyPatch(this.status, data.Patch)
          this.notifyListeners()
        } catch (e) {
          console.error('[GoXLR WS] Patch failed', e)
        }
      } else if (data.MicLevel !== undefined) {
        this.notifyMicLevel(data.MicLevel)
      }
    }
  }

  public sendRequest(requestData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not open'))
        return
      }

      const id = ++this.requestId
      this.pendingRequests.set(id, resolve)

      const payload = JSON.stringify({ id, data: requestData })
      this.ws.send(payload)
    })
  }

  public fetchStatus(): Promise<any> {
    return this.sendRequest({ GetStatus: null })
  }

  public sendCommand(serialNumber: string, command: any): Promise<any> {
    return this.sendRequest({
      Command: [serialNumber, command]
    })
  }

  public subscribe(listener: WebSocketListener) {
    this.listeners.add(listener)
    if (this.status) listener(this.status)
    return () => this.listeners.delete(listener)
  }

  public subscribeMicLevel(listener: (level: number) => void) {
    this.micLevelListeners.add(listener)
    return () => this.micLevelListeners.delete(listener)
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn(this.status))
  }

  private notifyMicLevel(level: number) {
    this.micLevelListeners.forEach(fn => fn(level))
  }
}

export const wsClient = new GoXLRWebSocket()
