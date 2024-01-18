export class WorkerPool {
  constructor(workerUrl, numberOfWorkers = navigator.hardwareConcurrency) {
    this.workers = [];
    this.queue = [];
    this.results = [];
    this.workerUrl = workerUrl;
    this.numberOfWorkers = numberOfWorkers;
    this.initWorkers();
  }

  initWorkers() {
    for (let i = 0; i < this.numberOfWorkers; i++) {
      const worker = new Worker(this.workerUrl);
      worker.onmessage = this.handleWorkerMessage.bind(this, worker);
      this.workers.push(worker);
    }
  }

  handleWorkerMessage(worker, event) {
    const { data } = event;
    this.results.push(data);

    if (this.queue.length > 0) {
      const task = this.queue.shift();
      worker.postMessage(task);
    }

    // Peut-être notifier quelque chose ou gérer les résultats ici
  }

  postTask(task) {
    const idleWorker = this.workers.find((worker) => !worker.busy);

    if (idleWorker) {
      idleWorker.busy = true;
      idleWorker.postMessage(task);
    } else {
      this.queue.push(task);
    }
  }

  terminate() {
    this.workers.forEach((worker) => worker.terminate());
  }
}
