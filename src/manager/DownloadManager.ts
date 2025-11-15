export interface QueueItem {
  id: string;
  title: string;
  sizeMB: number;
  progress: number; // 0–100
  status: "pending" | "downloading" | "completed";
  image: string;
}

/** Simple Event Emitter bukan dari Node.js */
class SimpleEmitter {
  private listeners: Record<string, Function[]> = {};

  on(event: string, listener: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
  }

  off(event: string, listener: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
  }

  emit(event: string, data?: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((l) => l(data));
  }
}

class DownloadManagerClass {
  private queue: QueueItem[] = [];
  private emitter = new SimpleEmitter();
  private downloading = false;

  /** Tambah item ke queue */
  addToQueue(items: QueueItem[]) {
    this.queue.push(...items);
    this.emitter.emit("update", [...this.queue]);
    this.startNext();
  }

  /** Ambil queue */
  getQueue() {
    return [...this.queue];
  }

  /** Hapus 1 item dari queue */
  removeFromQueue(id: string) {
    this.queue = this.queue.filter((i) => i.id !== id);
    this.emitter.emit("update", [...this.queue]);
  }

  /** Mulai download episode berikutnya */
  private async startNext() {
    if (this.downloading) return;

    const next = this.queue.find((i) => i.status === "pending");
    if (!next) return;

    this.downloading = true;
    next.status = "downloading";
    this.emitter.emit("update", [...this.queue]);

    // fake download progress
    for (let p = 0; p <= 100; p++) {
      await new Promise<void>((res) => setTimeout(() => res(), 40));
      next.progress = p;
      this.emitter.emit("update", [...this.queue]);
    }

    next.status = "completed";
    this.downloading = false;
    this.emitter.emit("update", [...this.queue]);

    this.startNext();
  }

  /** Event Listener */
  on(event: "update", listener: (queue: QueueItem[]) => void) {
    this.emitter.on(event, listener);
  }

  off(event: "update", listener: (queue: QueueItem[]) => void) {
    this.emitter.off(event, listener);
  }
}

const DownloadManager = new DownloadManagerClass();
export default DownloadManager;
