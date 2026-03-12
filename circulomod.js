let n = 12;
let a = 20;
let anguloGirado = 0;
let bool = false;
const draw = document.getElementById("relogio");
const obj = draw.getContext("2d"); 

function moverGrau(angulo){
    const ponteiro = document.getElementById("ponteiro");
    ponteiro.style.transform = `translate(-50%, -100%) rotate(${angulo}deg)`;
}

function mudarTiming(ms){
    const ponteiro = document.getElementById("ponteiro");
    ponteiro.style.setProperty("--transition-duration", toString(ms));
}

function moverNVezes(n, angulo, timing){
    mudarTiming(timing);
    for(let i = 1; i <= n; i++){
        setTimeout(() =>{
            anguloGirado += angulo;
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

function desenharCirculoMod(){
    if(bool){
        return;
    }

    const centrox = draw.width / 2;
    const centroy = draw.height / 2;
    const raio = 200;
    obj.strokeStyle = "black";
    obj.font = "20px Helvetica"
    obj.lineWidth = 5;

    obj.beginPath();
    obj.arc(centrox, centroy, raio, 0, 2 * Math.PI);
    obj.stroke();

    obj.beginPath();
    obj.arc(centrox, centroy, 2, 0, 2 * Math.PI);
    obj.stroke();

    obj.strokeRect(0, 0, draw.width, draw.height)
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

    let angulo = 360 / n;
    criarPonteiro();
    moverNVezes(n * (parseInt(a / n)) + a % n, angulo, 500);
    
    bool = true;

}
