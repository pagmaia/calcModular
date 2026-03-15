import { OperacaoModular } from '../models/OperacaoModular.js';
import { CirculoModular } from '../views/CirculoModular.js';
import { GrafoConexoes } from '../views/GrafoConexoes.js';
import { Ponteiro } from '../views/Ponteiro.js';
import { ControladorAnimacao } from './ControladorAnimacao.js';

/**
 * Controlador principal da aplicação.
 * Orquestra inputs, visualizações e animações.
 */
export class AppController {
  constructor() {
    // Elementos do DOM
    this.inputModulo = document.getElementById('modn');
    this.inputA = document.getElementById('numA');
    this.inputB = document.getElementById('numB');
    this.selectOperacao = document.getElementById('operacoes');
    this.btnCalcular = document.getElementById('btn-calcular');
    this.btnResetar = document.getElementById('btn-resetar');
    this.sliderVelocidade = document.getElementById('velocidade');
    this.labelVelocidade = document.getElementById('label-velocidade');
    this.painelResultado = document.getElementById('painel-resultado');
    this.textoResultado = document.getElementById('texto-resultado');
    this.statusAnimacao = document.getElementById('status-animacao');
    this.btnTema = document.getElementById('btn-tema');

    // Canvas e views
    const canvasCirculo = document.getElementById('relogio');
    const canvasGrafo = document.getElementById('grafico');
    const containerCirculo = document.querySelector('.circulo-mod');

    this.circulo = new CirculoModular(canvasCirculo);
    this.grafo = new GrafoConexoes(canvasGrafo);
    this.ponteiro = new Ponteiro(containerCirculo);
    this.animacao = new ControladorAnimacao();

    // Estado
    this.operacaoAtual = null;
    this.moduloAtual = 0;

    this._inicializarEventos();
    this._inicializarTema();
  }

  /** Configura todos os event listeners */
  _inicializarEventos() {
    // Botões
    this.btnCalcular.addEventListener('click', () => this.calcular());
    this.btnResetar.addEventListener('click', () => this.resetar());

    // Enter nos inputs
    const inputs = [this.inputModulo, this.inputA, this.inputB];
    inputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.calcular();
      });
    });

    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.key === 'q' || e.key === 'Q') this.resetar();
      if (e.key === 'p' || e.key === 'P') this._alternarPausa();
    });

    // Slider de velocidade
    if (this.sliderVelocidade) {
      this.sliderVelocidade.addEventListener('input', () => {
        this._atualizarLabelVelocidade();
      });
    }

    // Tema
    if (this.btnTema) {
      this.btnTema.addEventListener('click', () => this._alternarTema());
    }

    // Operação muda -> atualizar label do placeholder de B
    this.selectOperacao.addEventListener('change', () => {
      this._atualizarPlaceholderB();
    });
  }

  /** Inicializa o tema salvo no localStorage */
  _inicializarTema() {
    const temaSalvo = localStorage.getItem('tema') || 'light';
    document.documentElement.setAttribute('data-tema', temaSalvo);
    this._atualizarIconeTema(temaSalvo);
  }

  _alternarTema() {
    const temaAtual = document.documentElement.getAttribute('data-tema');
    const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-tema', novoTema);
    localStorage.setItem('tema', novoTema);
    this._atualizarIconeTema(novoTema);

    // Re-renderiza se já existir algo desenhado
    if (this.moduloAtual > 0) {
      this.circulo._ajustarDPR();
      this.grafo._ajustarDPR();
      this.circulo.desenhar(this.moduloAtual);
      this.grafo.desenhar(this.moduloAtual);
    }
  }

  _atualizarIconeTema(tema) {
    if (!this.btnTema) return;
    const icone = this.btnTema.querySelector('.tema-icone');
    if (icone) {
      icone.textContent = tema === 'dark' ? '☀️' : '🌙';
    }
  }

  _atualizarPlaceholderB() {
    const op = this.selectOperacao.value;
    const labels = {
      add: 'Parcela (b)',
      multi: 'Fator (b)',
      expo: 'Expoente (b)',
    };
    this.inputB.placeholder = labels[op] || 'Segundo número (b)';
  }

  _atualizarLabelVelocidade() {
    if (this.labelVelocidade && this.sliderVelocidade) {
      this.labelVelocidade.textContent = `${this.sliderVelocidade.value}×`;
    }
  }

  /** Obtém o intervalo de animação baseado no slider de velocidade */
  _obterIntervalo() {
    const velocidade = this.sliderVelocidade
      ? parseFloat(this.sliderVelocidade.value)
      : 1;
    const base = this.selectOperacao.value === 'add' ? 500 : 900;
    return Math.round(base / velocidade);
  }

  /** Valida e executa o cálculo */
  calcular() {
    if (this.animacao.animando) return;

    const n = parseInt(this.inputModulo.value);
    const a = parseInt(this.inputA.value);
    const b = parseInt(this.inputB.value);
    const op = this.selectOperacao.value;

    // Validação
    const erros = this._validar(n, a, b, op);
    if (erros.length > 0) {
      this._mostrarErro(erros[0]);
      return;
    }

    // Limite do módulo para a visualização ficar legível
    if (n > 30) {
      this._mostrarErro('Módulo máximo para visualização: 30');
      return;
    }

    this._limparErros();
    this.resetar();

    this.moduloAtual = n;
    const operacao = new OperacaoModular(n, a, b, op);
    this.operacaoAtual = operacao;

    // Ajustar canvas para o tamanho atual e desenhar
    this.circulo._ajustarDPR();
    this.grafo._ajustarDPR();
    this.circulo.desenhar(n);
    this.grafo.desenhar(n);

    // Criar ponteiro na posição inicial
    const anguloInicial = operacao.anguloInicial();
    this.ponteiro.criar(anguloInicial);

    // Mostrar resultado
    this._mostrarResultado(operacao.formatarExpressao());

    // Animar passos
    const passos = operacao.obterPassos();
    const intervalo = this._obterIntervalo();
    const duracaoTransicao = Math.round(intervalo * 0.8);

    this._atualizarStatus('Animando...');

    this.animacao.executar(
      passos,
      (passo) => {
        const anguloAnterior = this.ponteiro.anguloAtual;
        this.ponteiro.moverDelta(passo.delta, duracaoTransicao);
        this.grafo.desenharLinha(anguloAnterior, this.ponteiro.anguloAtual);
      },
      intervalo,
      () => this._atualizarStatus('Concluído ✓')
    );
  }

  /** Reseta tudo para o estado inicial */
  resetar() {
    this.animacao.cancelar();
    this.ponteiro.remover();
    this.circulo.limpar();
    this.grafo.limpar();
    this.moduloAtual = 0;
    this.operacaoAtual = null;
    this._ocultarResultado();
    this._atualizarStatus('');
  }

  _alternarPausa() {
    const pausado = this.animacao.alternarPausa();
    this._atualizarStatus(pausado ? 'Pausado ⏸' : 'Animando...');
  }

  // --- Helpers de UI ---

  _validar(n, a, b, op) {
    const erros = [];
    if (!op) erros.push('Selecione uma operação');
    if (isNaN(n) || n <= 0) erros.push('Módulo deve ser um inteiro positivo');
    if (isNaN(a)) erros.push('Informe o valor de a');
    if (isNaN(b)) erros.push('Informe o valor de b');
    if (!isNaN(b) && b < 0) erros.push('O valor de b deve ser não-negativo');
    return erros;
  }

  _mostrarErro(mensagem) {
    this._limparErros();
    const container = document.querySelector('.interface');
    const el = document.createElement('div');
    el.classList.add('erro-mensagem');
    el.textContent = mensagem;
    container.appendChild(el);

    setTimeout(() => el.remove(), 4000);
  }

  _limparErros() {
    document.querySelectorAll('.erro-mensagem').forEach(el => el.remove());
  }

  _mostrarResultado(texto) {
    if (this.painelResultado && this.textoResultado) {
      this.textoResultado.textContent = texto;
      this.painelResultado.classList.add('visivel');
    }
  }

  _ocultarResultado() {
    if (this.painelResultado) {
      this.painelResultado.classList.remove('visivel');
    }
  }

  _atualizarStatus(texto) {
    if (this.statusAnimacao) {
      this.statusAnimacao.textContent = texto;
    }
  }
}
