/**
 * Responsável por desenhar o grafo de conexões no canvas.
 * Mostra os nós (pontos) de 0 a n-1 e as linhas de conexão entre passos.
 */
export class GrafoConexoes {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dpr = window.devicePixelRatio || 1;
    this._ajustarDPR();
  }

  _ajustarDPR() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.largura = rect.width;
    this.altura = rect.height;
  }

  get centroX() {
    return this.largura / 2;
  }
  get centroY() {
    return this.altura / 2;
  }
  get raio() {
    return Math.min(this.largura, this.altura) / 2 - 50;
  }

  /** Desenha os nós do grafo para n elementos */
  desenhar(n) {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.largura, this.altura);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < n; i++) {
      const angulo = this._anguloParaIndice(i, n);
      const cos = Math.cos(angulo);
      const sin = Math.sin(angulo);

      const xNum = this.centroX - (this.raio + 25) * cos;
      const yNum = this.centroY - (this.raio + 25) * sin;
      const x = this.centroX - this.raio * cos;
      const y = this.centroY - this.raio * sin;

      // Número
      const tamanhoFont = n > 16 ? 13 : 16;
      ctx.font = `600 ${tamanhoFont}px 'Inter', 'Segoe UI', sans-serif`;
      ctx.fillStyle = this._cor("--cor-texto", "#334155");
      ctx.fillText(i, xNum, yNum);

      // Ponto do nó
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = this._cor("--cor-ponto-central", "#94a3b8");
      ctx.fill();
    }
  }

  /**
   * Desenha uma linha de conexão entre dois ângulos absolutos (em graus).
   * @param {number} anguloIni - Ângulo de origem em graus
   * @param {number} anguloFim - Ângulo de destino em graus
   * @param {string} [cor] - Cor da linha (opcional)
   */
  desenharLinha(anguloIni, anguloFim, cor) {
    const { ctx } = this;
    const corLinha =
      cor || this._cor("--cor-primaria", "rgba(99, 102, 241, 0.7)");

    const iniRad = ((anguloIni + 90) * Math.PI) / 180;
    const fimRad = ((anguloFim + 90) * Math.PI) / 180;

    const xIni = this.centroX - this.raio * Math.cos(iniRad);
    const yIni = this.centroY - this.raio * Math.sin(iniRad);
    const xFim = this.centroX - this.raio * Math.cos(fimRad);
    const yFim = this.centroY - this.raio * Math.sin(fimRad);

    ctx.beginPath();
    ctx.moveTo(xIni, yIni);
    ctx.lineTo(xFim, yFim);
    ctx.strokeStyle = corLinha;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  limpar() {
    this.ctx.clearRect(0, 0, this.largura, this.altura);
  }

  /** Lê uma variável CSS resolvida do :root */
  _cor(variavel, fallback) {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(variavel)
        .trim() || fallback
    );
  }

  _anguloParaIndice(i, n) {
    return ((90 + (360 / n) * i) * Math.PI) / 180;
  }
}
