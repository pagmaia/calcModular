/**
 * Controla a animação dos passos da operação modular.
 * Gerencia timeouts, pausa/resume e cancelamento.
 */
export class ControladorAnimacao {
  constructor() {
    this._timeouts = [];
    this._animando = false;
    this._pausado = false;
    this._onComplete = null;
  }

  get animando() {
    return this._animando;
  }
  get pausado() {
    return this._pausado;
  }

  /**
   * Executa uma sequência de passos com intervalo entre cada um.
   * @param {Array} passos - Lista de objetos com os dados de cada passo
   * @param {Function} callbackPasso - Função executada a cada passo (recebe passo, índice)
   * @param {number} intervaloMs - Intervalo entre passos em ms
   * @param {Function} [onComplete] - Callback ao finalizar todos os passos
   */
  executar(passos, callbackPasso, intervaloMs, onComplete) {
    this.cancelar();
    this._animando = true;
    this._pausado = false;
    this._onComplete = onComplete || null;

    if (passos.length === 0) {
      this._animando = false;
      if (onComplete) onComplete();
      return;
    }

    passos.forEach((passo, i) => {
      const timeout = setTimeout(
        () => {
          if (this._pausado) return;

          callbackPasso(passo, i);

          if (i === passos.length - 1) {
            this._animando = false;
            if (this._onComplete) this._onComplete();
          }
        },
        (i + 1) * intervaloMs,
      );

      this._timeouts.push(timeout);
    });
  }

  /** Alterna entre pausado e ativo */
  alternarPausa() {
    this._pausado = !this._pausado;
    return this._pausado;
  }

  /** Cancela todos os timeouts pendentes */
  cancelar() {
    for (const t of this._timeouts) {
      clearTimeout(t);
    }
    this._timeouts = [];
    this._animando = false;
    this._pausado = false;
  }
}
