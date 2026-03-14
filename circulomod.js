let anguloGirado = 0;
let animando = false;
let pausado = false;
let anim = [];

function getOpcao() {
    const op = document.getElementById("operacoes");
    return op.value;
}

function apresentar(valores) {
    let n = parseInt(valores["modn"]);
    let a = parseInt(valores["numA"]);
    let b = parseInt(valores["numB"]);

    if (isNaN(n) || isNaN(a) || isNaN(b) || n <= 0) return;

    resetar();
    
    if (n <= 25) {
        const angulo = 360 / n;
        desenharCirculoMod(n);
        desenharGrafico(n);

        criarPonteiro(angulo * a);
        const opt = getOpcao();

        document.getElementById("numA").value = "";
        document.getElementById("numB").value = "";

        if (opt === "add") {
            const timing = 400;
            moverNVezes(b, angulo, timing);
        } 
        else if (opt === "multi") {
            const timing = 800;
            moverNVezes(b - 1, a * angulo, timing);
        } 
        else if (opt === "expo") {
            const timing = 1000;
            moverNVezesExponencial(a, b, n, angulo, timing);         
        }
    }   
}

function getInputs() {
    const numeros = {};
    const valores = document.querySelectorAll(".interface .input");
    for (const val of valores) {
        numeros[val.id] = val.value;
    }
    return numeros;
}

function moverGrau(angulo) {
    const ponteiro = document.getElementById("ponteiro");
    if (ponteiro) {
        ponteiro.style.transform = `translate(-50%, -100%) rotate(${angulo}deg)`;
    }
}

function mudarTiming(ms) {
    const ponteiro = document.getElementById("ponteiro");
    if (ponteiro) {
        ponteiro.style.transition = `transform ${ms}ms ease-out`;
    }
}

function moverNVezes(n, angulo, timing) {
    animando = true;
    mudarTiming(timing - 100);

    for (let i = 1; i <= n; i++) {
        let movimento = setTimeout(() => {
            
            if(pausado){
                return;
            }

            if (angulo > 360){
                angulo = angulo % 360;
            }
            if(angulo == 0){
                angulo = 360;
            }
            
            anguloGirado += angulo;
            moverGrau(anguloGirado);
            fazerlinhas(anguloGirado - angulo, anguloGirado);
            
            if (i === n) {
                animando = false;
            }

        }, i * timing);
        anim.push(movimento);
    }
}

function moverNVezesExponencial(a, b, n, base, timing) {
    mudarTiming(timing - 100);
    animando = true;
    
    let valorAtual = a * a % n; 

    for (let i = 2; i <= b; i++) {
        if(pausado){
            return;
        }
        const angulo = valorAtual * base;   

        let movimento = setTimeout(() => {
            let deltaAngulo = (angulo - (anguloGirado % 360) + 360) % 360;
            if (deltaAngulo === 0 && a !== 0){
                deltaAngulo = 360;
            }
            
            anguloGirado += deltaAngulo;
            moverGrau(anguloGirado); 
            fazerlinhas(anguloGirado - deltaAngulo, anguloGirado);

            if (i === b) {
                animando = false;
            }

        }, i * timing);
        valorAtual = (valorAtual * a) % n;
        anim.push(movimento);
    }
}

function criarPonteiro(angulo) {
    if (!document.getElementById("ponteiro")) {
        const ponteiro = document.createElement("div");
        ponteiro.id = "ponteiro";
        ponteiro.classList.add("ponteiro");
        document.querySelector(".circuloMod").appendChild(ponteiro);
        moverGrau(angulo);
        anguloGirado = angulo;
    }
}   

function desenharCirculoMod(n) {
    const draw = document.getElementById("relogio");
    const obj = draw.getContext("2d"); 

    const centrox = draw.width / 2;
    const centroy = draw.height / 2;
    const raio = (draw.width / 2) - 100;
    
    obj.strokeStyle = "#cbd5e1";
    obj.font = "bold 18px 'Segoe UI', sans-serif";
    obj.lineWidth = 4;
    obj.fillStyle = "#334155";

    obj.beginPath();
    obj.arc(centrox, centroy, raio, 0, 2 * Math.PI);
    obj.stroke();

    obj.beginPath();
    obj.arc(centrox, centroy, 6, 0, 2 * Math.PI);
    obj.fillStyle = "#94a3b8";
    obj.fill();

    obj.textAlign = "center";
    obj.textBaseline = "middle";
    obj.fillStyle = "#334155";
    
    for (let i = 0; i < n; i++) {
        let angulo = (90 + (360 / n) * i);
        if (angulo < 0) {
            angulo = 360 + angulo;
        }
        angulo = (angulo * (Math.PI / 180));

        const xi = centrox - ((raio + 30) * Math.cos(angulo));
        const yi = centroy - ((raio + 30) * Math.sin(angulo));
        const x = centrox - (raio * Math.cos(angulo));
        const y = centroy - (raio  * Math.sin(angulo));
        const xStroke = centrox - ((raio - 15) * Math.cos(angulo));
        const yStroke = centroy - ((raio - 15) * Math.sin(angulo));
        
        obj.fillText(i, xi, yi);
        
        obj.beginPath();
        obj.moveTo(x, y);
        obj.lineTo(xStroke, yStroke);
        obj.strokeStyle = "#cbd5e1";
        obj.lineWidth = 3;
        obj.stroke();
    }
}

function desenharGrafico(n) {
    const draw = document.getElementById("grafico");
    const obj = draw.getContext("2d"); 

    const centrox = draw.width / 2;
    const centroy = draw.height / 2;
    const raio = (draw.width / 2) - 100;
    
    obj.font = "bold 18px 'Segoe UI', sans-serif";
    obj.textAlign = "center";
    obj.textBaseline = "middle";
    obj.fillStyle = "#334155";

    for (let i = 0; i < n; i++) {
        let angulo = (90 + (360 / n) * i);
        if (angulo < 0) {
            angulo = 360 + angulo;
        }
        angulo = (angulo * (Math.PI / 180));

        const xi = centrox - ((raio + 30) * Math.cos(angulo));
        const yi = centroy - ((raio + 30) * Math.sin(angulo));
        const x = centrox - (raio * Math.cos(angulo));
        const y = centroy - (raio * Math.sin(angulo));
        
        obj.fillText(i, xi, yi);
        
        obj.beginPath();
        obj.arc(x, y, 4, 0, 2 * Math.PI);
        obj.fillStyle = "#94a3b8";
        obj.fill();
    }
}

function fazerlinhas(ini, final) {
    const graf = document.getElementById("grafico");
    const g = graf.getContext("2d"); 
    const centrox = graf.width / 2;
    const centroy = graf.height / 2;
    const raio = (graf.width / 2) - 100;
    
    g.strokeStyle = "rgba(143, 168, 255, 0.7)";
    g.lineWidth = 3;

    ini = ((ini + 90) * (Math.PI / 180));
    final = ((final + 90) * (Math.PI / 180));

    const xIni = centrox - (raio * Math.cos(ini));
    const yIni = centroy - (raio * Math.sin(ini));
    const xFim = centrox - (raio * Math.cos(final));
    const yFim = centroy - (raio * Math.sin(final));
    
    g.beginPath();
    g.moveTo(xIni, yIni);
    g.lineTo(xFim, yFim);
    g.stroke();
}

function resetar() {
    const draw = document.getElementById("relogio");
    const obj = draw.getContext("2d");
    obj.clearRect(0, 0, draw.width, draw.height);
    
    const graf = document.getElementById("grafico");
    const g = graf.getContext("2d");
    g.clearRect(0, 0, graf.width, graf.height);

    const ponteiro = document.getElementById("ponteiro");
    if (ponteiro) {
        ponteiro.remove();
    }
    anguloGirado = 0;
}

function matarAnimacao(){
    for(const a of anim){
        clearTimeout(a);
    }
    animando = false;
    anim = [];
}

function pDAnimacao(){
    pausado = !pausado;
}

function controles(){
    document.addEventListener("keydown", function(event) {
        if(event.key === "Enter") {
            if (animando) {
                return;
            }
            const valores = getInputs();
            apresentar(valores);
        }
        if(event.key === "q"){
            matarAnimacao();
            resetar();
        }
        if(event.key === "p"){
            pDAnimacao();
        }
    });
}

function main() {
    controles();
}

main();