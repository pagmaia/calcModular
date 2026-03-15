/**
 * Classe responsável pelos cálculos de aritmética modular.
 * Encapsula a lógica matemática separada da apresentação visual.
 */
export class OperacaoModular {
  /**
   * @param {number} modulo - O módulo (n)
   * @param {number} a - Primeiro operando
   * @param {number} b - Segundo operando
   * @param {string} operacao - Tipo da operação ('add' | 'multi' | 'expo')
   */
  constructor(modulo, a, b, operacao) {
    this.modulo = modulo;
    this.a = a;
    this.b = b;
    this.operacao = operacao;
  }

  /** Calcula o resultado da operação modular */
  calcular() {
    switch (this.operacao) {
      case "add":
        return this._adicao();
      case "multi":
        return this._multiplicacao();
      case "expo":
        return this._exponenciacao();
      default:
        return null;
    }
  }

  /** Retorna os passos intermediários da animação como lista de ângulos delta */
  obterPassos() {
    const anguloPorUnidade = 360 / this.modulo;

    switch (this.operacao) {
      case "add":
        return this._passosAdicao(anguloPorUnidade);
      case "multi":
        return this._passosMultiplicacao(anguloPorUnidade);
      case "expo":
        return this._passosExponenciacao(anguloPorUnidade);
      default:
        return [];
    }
  }

  /** Retorna a expressão formatada, ex: "3 + 5 ≡ 2 (mod 6)" */
  formatarExpressao() {
    const resultado = this.calcular();
    const simbolos = { add: "+", multi: "×", expo: "^" };
    const simb = simbolos[this.operacao] || "?";

    if (this.operacao === "expo") {
      return `${this.a}${simb}${this.b} ≡ ${resultado} (mod ${this.modulo})`;
    }
    return `${this.a} ${simb} ${this.b} ≡ ${resultado} (mod ${this.modulo})`;
  }

  /** Retorna o ângulo inicial do ponteiro (posição de 'a' no círculo) */
  anguloInicial() {
    const anguloPorUnidade = 360 / this.modulo;
    return anguloPorUnidade * this._mod(this.a);
  }

  // --- Métodos privados ---

  _mod(valor) {
    return ((valor % this.modulo) + this.modulo) % this.modulo;
  }

  _adicao() {
    return this._mod(this._mod(this.a) + this._mod(this.b));
  }

  _multiplicacao() {
    return this._mod(this._mod(this.a) * this._mod(this.b));
  }

  _exponenciacao() {
    let resultado = 1;
    const base = this._mod(this.a);
    for (let i = 0; i < this.b; i++) {
      resultado = this._mod(resultado * base);
    }
    return resultado;
  }

  _passosAdicao(anguloPorUnidade) {
    const passos = [];
    for (let i = 0; i < this.b; i++) {
      passos.push({ delta: anguloPorUnidade });
    }
    return passos;
  }

  _passosMultiplicacao(anguloPorUnidade) {
    const passos = [];
    const salto = (this.a % this.modulo) * anguloPorUnidade;
    for (let i = 1; i < this.b; i++) {
      passos.push({ delta: salto });
    }
    return passos;
  }

  _passosExponenciacao(anguloPorUnidade) {
    const passos = [];
    const n = this.modulo;
    let valorAnterior = this.a % n;

    for (let i = 2; i <= this.b; i++) {
      const valorAtual = (valorAnterior * this.a) % n;
      const anguloAnterior = valorAnterior * anguloPorUnidade;
      const anguloAtual = valorAtual * anguloPorUnidade;

      let delta = (anguloAtual - anguloAnterior + 360) % 360;
      if (delta === 0 && this.a !== 0) {
        delta = 360;
      }
      passos.push({ delta });
      valorAnterior = valorAtual;
    }
    return passos;
  }
}
