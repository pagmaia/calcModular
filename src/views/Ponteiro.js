/**
 * Gerencia o ponteiro (seta) visual dentro do círculo modular.
 * Cria, move e remove o elemento DOM do ponteiro.
 */
export class Ponteiro {
  /**
   * @param {HTMLElement} container - O elemento .circulo-mod que contém o canvas
   */
  constructor(container) {
    this.container = container;
    this.elemento = null;
    this.anguloAtual = 0;
  }

  /** Cria o ponteiro e posiciona no ângulo inicial */
  criar(anguloInicial) {
    this.remover();

    const el = document.createElement('div');
    el.classList.add('ponteiro');
    this.container.appendChild(el);

    this.elemento = el;
    this.anguloAtual = anguloInicial;
    this._aplicarRotacao(0); // sem transição na criação

    // Força reflow para que a transição funcione no próximo frame
    void el.offsetHeight;
  }

  /** Move o ponteiro para um novo ângulo absoluto */
  moverPara(anguloAbsoluto, duracaoMs = 300) {
    if (!this.elemento) return;
    this.elemento.style.transition = `transform ${duracaoMs}ms ease-out`;
    this.anguloAtual = anguloAbsoluto;
    this._aplicarRotacao();
  }

  /** Incrementa o ângulo do ponteiro */
  moverDelta(deltaAngulo, duracaoMs = 300) {
    this.moverPara(this.anguloAtual + deltaAngulo, duracaoMs);
  }

  /** Remove o ponteiro do DOM */
  remover() {
    if (this.elemento) {
      this.elemento.remove();
      this.elemento = null;
    }
    this.anguloAtual = 0;
  }

  _aplicarRotacao(duracaoMs) {
    if (!this.elemento) return;
    if (duracaoMs !== undefined) {
      this.elemento.style.transition = `transform ${duracaoMs}ms ease-out`;
    }
    this.elemento.style.transform =
      `translate(-50%, -100%) rotate(${this.anguloAtual}deg)`;
  }
}
