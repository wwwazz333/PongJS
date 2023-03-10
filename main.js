var settingsGame = {
    playing: false,

    difficulty: 1, // 0 : facile, 1 : moyen, 2 : difficile
}

var tableauScore = loadTableScore();
updateTable(tableauScore);

var menu = new Menu();

var p1 = new Player(20, (height - hp) / 2, "z", "s", coteDuCamp.left, "blue"); //on place le player un a gauche au milieu
var p2 = new Player(
    width - wp - 20,
    (height - hp) / 2,
    "i",
    "k",
    coteDuCamp.right,
    "red"
); //on place le player deux a droite au milieu
var ball = new Ball(width / 2, height / 2); //on place la ball au milieu du canva


function resteGame() {
    p1.score = p2.score = 0;
    p1.rect.y = p2.rect.y = (height - hp) / 2;
    ball.spawn();
}

function detectionWin() {
    let scoreWin = 11;
    if (p1.score >= scoreWin || p2.score >= scoreWin) {
        tableauScore.push([p1.score, p2.score]);
        updateTable(tableauScore);
        menu.stateMenu.setMenu(new WinMenu(
            p1.score > p2.score ? "Player 1" : "Player 2"
        ));
        settingsGame.playing = false;
    }
}

/**
 *  appelé quand la touche est pressée afin de mettre la vitesse du player a speedPlayer
 */
function pressKey(ev) {
    if (settingsGame.playing) {

        p1.keyPress(ev.key);
        p2.keyPress(ev.key);
    } else {//menu
        menu.keyPressed(ev.key);
    }

    if (ev.key == "Escape") {
        menu.stateMenu.setMenu(new PauseMenu());
        settingsGame.playing = false;
    }
    ev.stopPropagation();
}

/**
 * appelé quand la touche est relachée afin de remettre la vitesse du player a 0
 */
function releaseKey(ev) {
    if (settingsGame.playing) {
        p1.keyRelease(ev.key);
        p2.keyRelease(ev.key);
    } else {//menu

    }
}

const background = new Image();
background.src = 'assets/background.jpg';
/**
 * pour draw on efface tout ce qu'il y avait avant pour tout redessiner
 */
function draw() {
    clear();

    ctx.drawImage(background, 0, 0, width, height);
    if (settingsGame.playing) {
        p1.draw();
        p2.draw();
        ball.draw();
    } else {
        //menu
        menu.draw();
    }

}

/**
 * pour update la position des players et de la ball (se fait 60 fois toute les secondes)
 */
function update() {
    if (settingsGame.playing) {
        detectionWin();
        p1.update();
        p2.update();
        ball.update([p1, p2]);
    }

    draw();
}

setInterval(update, FPS * 1000); //on set l'intervalle pour update tout les FPS*1000
document.addEventListener("keydown", pressKey); //on appelle pressKey quand une touche est pressée
document.addEventListener("keyup", releaseKey); //on appelle releaseKey quand une touche est relachée



// Gestion de la popUp tuto
function removePopUp() {
    sessionStorage.setItem("tutoHasBeenSeen", true)
    var startPopUp = document.getElementById("start-popUp");
    startPopUp.parentElement.removeChild(startPopUp);
}
document.querySelector("#start-popUp button").addEventListener("click", removePopUp);
if (sessionStorage.getItem("tutoHasBeenSeen")) {
    removePopUp();
}