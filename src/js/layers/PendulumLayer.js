class PendulumLayer {
  constructor(ctx, config, clock) {
    this.outputCtx = ctx;
    this.config = config;

    // Initialisation de l'axe du pendule
    this.initPendulumAxis();
  }

  initPendulumAxis() {
    const numNodes = 3; // Nombre de nœuds, ajustez selon les besoins
    this.nodes = [];

    for (let i = 0; i < numNodes; i++) {
      this.nodes.push({
        angle: Math.random() * Math.PI - Math.PI / 2,
        length: 250 / numNodes, // Longueur ajustée pour l'ensemble de l'axe
        angularVelocity: 0,
      });
    }
  }

  updatePendulum(elapsedTime) {
    // Exemple simple de mise à jour de la physique des nœuds
    const gravity = 0.98;

    for (let node of this.nodes) {
      node.angularVelocity += (-gravity / node.length) * Math.sin(node.angle);
      node.angle += node.angularVelocity;
      node.angularVelocity *= 0.99; // Damping
    }
  }

  draw(elapsedTime) {
    this.updatePendulum(elapsedTime);

    let x = this.config.width / 2;
    let y = this.config.height / 2;

    this.outputCtx.beginPath();
    this.outputCtx.moveTo(x, y);

    for (let node of this.nodes) {
      x += node.length * Math.sin(node.angle);
      y += node.length * Math.cos(node.angle);

      this.outputCtx.lineTo(x, y);
    }

    this.outputCtx.stroke();
  }
}

export default PendulumLayer;
