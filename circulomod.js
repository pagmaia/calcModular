let anguloGirado = 0;
let animando = false;

function getOpcao(){
    const op = document.getElementById("operacoes");
    const v = op.value;
    op.value = "";
    return v;
}

function apresentar(valores){
    let n = 0;
    let a = 0;
    let b = 0;

    resetar();
    n = parseInt(valores["modn"]);
    if(n <= 25){
        const angulo = 360 / n;
        desenharCirculoMod(n);
        desenharGrafico(n);

        a = parseInt(valores["numA"]);
        criarPonteiro();
        numA.value = "";
        const opt = getOpcao();
        b = parseInt(valores["numB"]);

        if(opt == "add"){
            const timing = 400;
            moverNVezes(a + b, angulo, timing);
        }
        else if(opt == "multi"){
            const timing = 800;
            moverNVezes(b, a * angulo, timing)
        }
        else if(opt == "expo"){
            const timing = 1000;
            moverNVezesExponencial(a, b, n, angulo, timing);         
        }
        numB.value = "";

    }   
}

function getInputs(){
    const numeros = {};
    const valores = document.querySelectorAll(".interface .input");
    for(const val of valores){
        numeros[val.id] = val.value;
    }
    return numeros;
}

function moverGrau(angulo){
    const ponteiro = document.getElementById("ponteiro");
    ponteiro.style.transform = `translate(-50%, -100%) rotate(${angulo}deg)`;
}

function mudarTiming(ms){
    const ponteiro = document.getElementById("ponteiro");
    ponteiro.style.transition = `transform ${ms}ms ease-out`;
}

function moverNVezes(n, angulo, timing){
    animando = true;
    mudarTiming(timing - 100);
    for(let i = 1; i <= n; i++){
        setTimeout(() =>{
            anguloGirado += angulo;
            moverGrau(anguloGirado);
            if(i > 1){
                fazerlinhas(anguloGirado, anguloGirado - angulo);
            }
            if(i === n){
                animando = false;
            }

        }, i * timing);
    }
}

function moverNVezesExponencial(a, b, n, base, timing){
    mudarTiming(timing - 100);
    animando = true;
    for(let i = 1; i <= b; i++){
        const valor = Math.pow(a, i);
        const posicao = valor % n;
        const angulo = posicao * base;   

        setTimeout(() =>{
            let a = (angulo - (anguloGirado % 360) + 360) % 360;
            if(a == 0){
                a = 360;
            }
            
            anguloGirado += a;
            moverGrau(anguloGirado); 
            if(i > 1){
                fazerlinhas(anguloGirado, anguloGirado - a);
            }

            if(i === b){
                animando = false;
            }
        }, i * timing);
        
    }
    
}

function criarPonteiro(angulo){
    const ponteiro = document.createElement("div");
    ponteiro.id = "ponteiro";
    ponteiro.classList.add("ponteiro");
    document.querySelector(".circuloMod").appendChild(ponteiro);
}   

function removePonteiro(){
    document.getElementById("ponteiro").remove();
}

function desenharCirculoMod(n){
    const draw = document.getElementById("relogio");
    const obj = draw.getContext("2d"); 

    const centrox = draw.width / 2;
    const centroy = draw.height / 2;
    const raio = (draw.width / 2) - 150;
    obj.strokeStyle = "black";
    obj.font = "20px Helvetica"
    obj.lineWidth = 5;

    obj.beginPath();
    obj.arc(centrox, centroy, raio, 0, 2 * Math.PI);
    obj.stroke();

    obj.beginPath();
    obj.arc(centrox, centroy, 3, 0, 2 * Math.PI);
    obj.fill();

    obj.textAlign = "center";
    obj.textBaseline = "middle";
    
    for(let i = 0; i < n; i++){
        let angulo = (90 + (360 / n) * i);
        if(angulo < 0){
            angulo = 360 + angulo;
        }
        angulo = (angulo * (Math.PI / 180));

        const xi = centrox - ((raio + 25) * Math.cos(angulo));
        const yi = centroy - ((raio + 25) * Math.sin(angulo));
        const x = centrox - (raio * Math.cos(angulo));
        const y = centroy - (raio  * Math.sin(angulo));
        const xStroke = centrox - ((raio - 20) * Math.cos(angulo));
        const yStroke = centroy - ((raio - 20) * Math.sin(angulo));
        obj.fillText(i, xi, yi);
        obj.moveTo(x, y);
        obj.lineTo(xStroke, yStroke);
        obj.stroke();
    }
}

function desenharGrafico(n){
    const draw = document.getElementById("grafico");
    const obj = draw.getContext("2d"); 

    const centrox = draw.width / 2;
    const centroy = draw.height / 2;
    const raio = (draw.width / 2) - 150;
    obj.font = "20px Helvetica"
    obj.textAlign = "center";
    obj.textBaseline = "middle";

    for(let i = 0; i < n; i++){
        let angulo = (90 + (360 / n) * i);
        if(angulo < 0){
            angulo = 360 + angulo;
        }
        angulo = (angulo * (Math.PI / 180));

        const xi = centrox - ((raio + 25) * Math.cos(angulo));
        const yi = centroy - ((raio + 25) * Math.sin(angulo));
        const x = centrox - (raio * Math.cos(angulo));
        const y = centroy - (raio * Math.sin(angulo));
        obj.fillText(i, xi, yi);
        obj.beginPath();
        obj.arc(x, y, 3, 0, 2 * Math.PI);
        obj.fill();
    }
}

function fazerlinhas(ini, final){
    const graf = document.getElementById("grafico");
    const g = graf.getContext("2d"); 
    const centrox = graf.width / 2;
    const centroy = graf.height / 2;
    const raio = (graf.width / 2) - 150;
    g.strokeStyle = "red";
    g.lineWidth = 3;

    console.log(ini);
    console.log(final);

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

function resetar(){
    const draw = document.getElementById("relogio");
    const obj = draw.getContext("2d");
    obj.clearRect(0, 0, draw.width, draw.height);
    const graf = document.getElementById("grafico");
    const g = graf.getContext("2d");
    g.clearRect(0, 0, graf.width, graf.height);

    const ponteiro = document.getElementById("ponteiro");
    if(ponteiro){
        ponteiro.remove();
    }
    anguloGirado = 0;
}

function resetarPonteiro(){
    const ponteiro = document.getElementById("ponteiro");
    if(ponteiro){
        ponteiro.remove();
    }
    anguloGirado = 0;
}

function main(){
    document.addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            console.log(animando);
            if(animando){
                return;
            }
            const valores = getInputs();
            apresentar(valores);
        }
    })
}
main();