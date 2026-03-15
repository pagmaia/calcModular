/**
 * Responsável por desenhar o círculo modular (relógio) no canvas.
 * Desenha o anel, os ticks e os números de 0 a n-1.
 */
export class CirculoModular {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dpr = window.devicePixelRatio || 1;
    this._ajustarDPR();
  }

  /** Ajusta o canvas para telas de alta densidade (retina) */
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

  /** Desenha o círculo modular para n elementos */
  desenhar(n) {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.largura, this.altura);

    // Anel principal
    ctx.beginPath();
    ctx.arc(this.centroX, this.centroY, this.raio, 0, 2 * Math.PI);
    ctx.strokeStyle = this._cor("--cor-circulo", "#cbd5e1");
    ctx.lineWidth = 3;
    ctx.stroke();

    // Ponto central
    ctx.beginPath();
    ctx.arc(this.centroX, this.centroY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = this._cor("--cor-ponto-central", "#94a3b8");
    ctx.fill();

    // Ticks e números
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < n; i++) {
      const angulo = this._anguloParaIndice(i, n);
      const cos = Math.cos(angulo);
      const sin = Math.sin(angulo);

      // Posições
      const xNum = this.centroX - (this.raio + 25) * cos;
      const yNum = this.centroY - (this.raio + 25) * sin;
      const xExt = this.centroX - this.raio * cos;
      const yExt = this.centroY - this.raio * sin;
      const xInt = this.centroX - (this.raio - 12) * cos;
      const yInt = this.centroY - (this.raio - 12) * sin;

      // Número
      const tamanhoFont = n > 16 ? 13 : 16;
      ctx.font = `600 ${tamanhoFont}px 'Inter', 'Segoe UI', sans-serif`;
      ctx.fillStyle = this._cor("--cor-texto", "#334155");
      ctx.fillText(i, xNum, yNum);

      // Tick
      ctx.beginPath();
      ctx.moveTo(xExt, yExt);
      ctx.lineTo(xInt, yInt);
      ctx.strokeStyle = this._cor("--cor-circulo", "#cbd5e1");
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
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

  /** Converte índice i (de 0 a n-1) para ângulo em radianos, começando do topo */
  _anguloParaIndice(i, n) {
    return ((90 + (360 / n) * i) * Math.PI) / 180;
  }
}
