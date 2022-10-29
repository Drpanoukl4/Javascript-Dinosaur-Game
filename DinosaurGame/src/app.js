
let time = new Date();
let DeltaTime = 0;

let FloorY = 20
let velY = 0
let impulse = 900
let gravity = 2500

let dinoposX = 42
let dinoposY = FloorY 

let FloorX = 0
let sceneVel = 450
let gamevel = 1
let score = 0
let gameo = false


let standing = false
let jumping = false


const container = document.querySelector(".Container")
const dino = document.querySelector(".Dino")
const gameover = document.querySelector(".Gm")
const Texscore = document.querySelector(".Score")
const TexHighscore = document.querySelector(".HighScore")
const floors = document.querySelector(".Floor")

let ObsTime = 2
let minTime = 1
let maxTime = 1
let Obspos = 16
let Obstacles = []


let clouds = []
let mincloudy = 50
let maxcloudy = 150
let cloudTime = 0.5

const Create = () => {

let Obstacle = document.createElement("div")
container.appendChild(Obstacle)
Obstacle.classList.add("obs")

Obstacle.PosX = container.clientWidth
Obstacle.style.left = container.clientWidth + "px"

Obstacles.push(Obstacle)
ObsTime = minTime + Math.random() * (maxTime - minTime) / gamevel

};

const Createcloud = () => {

    let cloud = document.createElement("div")
    container.appendChild(cloud)
    cloud.classList.add("cloud")
    
    cloud.PosX = container.clientWidth
    cloud.style.left = container.clientWidth + "px"

    cloud.style.bottom = mincloudy + Math.random() * (maxcloudy-mincloudy)+ "px"

    clouds.push(cloud)
    cloudTime = minTime + Math.random() * (maxTime - minTime) / gamevel
    
};


const Win = () => {

    score += 1
    if(score == 8){

        gamevel = 1.5;
    }else if(score == 16){

        gamevel = 2
        minTime = 0.75
        maxTime = 0.80

    }else if(score == 16){

        gamevel = 2.5
    }

    
    let getHighScore = window.localStorage.getItem("HighsScore")

    if (getHighScore < score){

        window.localStorage.setItem("HighsScore", score)
        
    }

    
    
}

const Choose = () =>{

ObsTime -= DeltaTime
if(ObsTime < 0){

    Create()

}
};

const Choosecloud = () =>{

    cloudTime -= DeltaTime
    if(cloudTime < 0){
    
        Createcloud()
    
}
};




const MoveOb = () => {

for (let i = Obstacles.length - 1; i >= 0; i--) {
    if(Obstacles[i].PosX < -Obstacles[i].clientWidth){
        Obstacles[i].parentNode.removeChild(Obstacles[i])
        Obstacles.splice(i, 1)
        Win()

    }else{

        Obstacles[i].PosX -= CalculateDes()
        Obstacles[i].style.left = Obstacles[i].PosX + "px"


    }
    
}

}

const Movecloud = () => {

    for (let i = clouds.length - 1; i >= 0; i--) {
        if(clouds[i].PosX < -clouds[i].clientWidth){
            clouds[i].parentNode.removeChild(clouds[i])
            clouds.splice(i, 1)
    
        }else{
    
            clouds[i].PosX -= CalculateDes()
            clouds[i].style.left = clouds[i].PosX + "px"
    
    
    }
        
}


};


const jump = () => {

    if (dinoposY === FloorY){

        jumping = true
        velY = impulse
        dino.classList.remove("animdino")

    }

};

const touchfloor = () => {

    dinoposY = FloorY
    velY = 0

    if(jumping){

        dino.classList.add("animdino")


    }

    jumping = false

};

const MoveDino = () => {

dinoposY += velY * DeltaTime
if (dinoposY < FloorY){

    touchfloor()
}

dino.style.bottom = dinoposY + "px"


};

const HandleKeyDOwn = (ev) => {

    if(ev.keyCode == 32 || ev.keyCode == 38){

        jump()

    }

};

document.addEventListener("click", jump)       
document.addEventListener("keydown", HandleKeyDOwn)

const init = () => {

    time = new Date();
    Loop()

};

const Loop = () => {

    DeltaTime = (new Date() - time) / 1000;
    time = new Date()
    update()
    requestAnimationFrame(Loop)

};


const CalculateDes = () => {

    return sceneVel * DeltaTime * gamevel

};

const MoveFLoor = () => {

    FloorX += CalculateDes()
    floors.style.left = -(FloorX % container.clientWidth) + "px"

};

const Iscoll = (a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) => {

 let aRect = a.getBoundingClientRect()
 let bRect = b.getBoundingClientRect()

 return !(

    ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
    (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
    ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
    (aRect.left + paddingLeft > (bRect.left + bRect.width))

 )

};

const crash = () => {

    gamevel = 1
    minTime = 1
    maxTime = 1
    gameo = true
    dino.classList.remove("animdino")
    dino.classList.add("Dead")
    dino.classList.add("deaddino")

}; 

const Gameover = () => {
    
    gameover.style.display = "block"
    crash()


};

const Dectect = () => {

    for (let i = 0; i < Obstacles.length; i++) {
        if(Obstacles[i].PosX > dinoposX + dino.clientWidth){

            break

        }else{

            if(Iscoll(dino, Obstacles[i], 10, 30, 15, 20)){

                Gameover()

            }

        }
        
    }

}

const update = () => {
if(gameo) return;

    MoveFLoor()
    MoveDino()
    Choosecloud()
    MoveOb()
    Choose()
    Dectect()
    Movecloud()

    velY -= gravity * DeltaTime
    Texscore.innerHTML = score
    TexHighscore.innerHTML = window.localStorage.getItem("HighsScore")

};


gameover.addEventListener("click", () => {

    dino.classList.remove("Dead")
    dino.classList.remove("deaddino")
    dino.classList.add("animdino")
    gameover.style.display = "none"
    score = 0
    gameo = false

    Obstacles.forEach(elm => {

        elm.classList.remove("obs")

    })

    Obstacles = []


})


if(document.readyState === "complete" || document.readyState === "interactive"){

    setTimeout(init, 0)

}else{

    document.addEventListener("DOMContentLoaded", init);

}

