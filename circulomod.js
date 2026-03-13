let anguloGirado = 0;

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
    if(n < 25){
        desenharCirculoMod(n);

        a = parseInt(valores["numA"]);
        criarPonteiro();
        numA.value = "";
        const opt = getOpcao();
        b = parseInt(valores["numB"]);

        if(opt == "add"){
            moverNVezes(a + b, 360 / n, 400);
        }
        else if(opt == "multi"){
            const angulo = a * (360 / n);
            moverNVezes(b, angulo, 800)
        }
        else if(opt == "expo"){
             angulo = 360 / n;
            moverNVezesExponencial(a, b, n, angulo, 1000);
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
    mudarTiming(timing - 100);
    for(let i = 1; i <= n; i++){
        setTimeout(() =>{
            anguloGirado += angulo;
            moverGrau(anguloGirado); 
        }, i * timing);
    }
}

function moverNVezesExponencial(a, b, n, base, timing){
    mudarTiming(timing - 100);
    for(let i = 1; i <= b; i++){
        const valor = Math.pow(a, i);
        const posicao = valor % n;
        const angulo = posicao * base;

        setTimeout(() =>{
            anguloGirado += (angulo - anguloGirado + 360) % 360;
            moverGrau(anguloGirado); 
        }, i * timing);
    }
}

function criarPonteiro(){
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
    obj.arc(centrox, centroy, 2, 0, 2 * Math.PI);
    obj.stroke();

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

function resetar(){
    const draw = document.getElementById("relogio");
    const obj = draw.getContext("2d");
    obj.clearRect(0, 0, draw.width, draw.height);

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
            const valores = getInputs();
            apresentar(valores);
        }
    })
}
main();