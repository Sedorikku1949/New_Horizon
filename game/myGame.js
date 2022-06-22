
// define the game
const game = new Game("New Horizon", { height: 900, width: 1200, fixedSize: true, background: "#333" });

const ASSETS = {
	main: {
		background: { url: "./cdn/img/homepage.jpg", type: "IMG", src: null, name: "HOMEPAGE" }
	}
}

let ACTUAL_STATE = "HOME";
let MENU_OPTIONS_HOVER = "NEW"
const MENU_OPTIONS = [
	{ name: "Nouvelle partie", id: "NEW", xDecal: 0, yDecal: 0 },
	{ name: "Charger une partie", id: "LOAD", xDecal: 0, yDecal: 0 },
	{ name: "Options", id: "OPTIONS", xDecal: 0, yDecal: 0 },
	{ name: "Succès", id: "SUCCESS", xDecal: 0, yDecal: 0 },
	{ name: "Quitter", id: "EXIT", xDecal: 0, yDecal: 0 },
];
let IS_EXIT_MENU_OPEN = false;
let EXIT_MENU_RESPONSE_HOVER = 1;

/**
 *
 * For any key:
 * @param {Object<state: Number, held: Number, key: String, last: null|Number>}
 *
 * State possibilities:
 * 0 - key is not touch
 * 1 - key was just pressed
 * 2 - The key is down
 * 3 - the key was just released
 *
 */
const KEYBOARDS_KEYS = { ".data": { heldTime: 250, heldTimeBetween: 150 } }


game.update = function update(dt){
	
	
	// update keyboard
	Object.keys(KEYBOARDS_KEYS).forEach((k) => {
		if (k !== ".data") {
			// keyboard key
			if ([1,2].includes(KEYBOARDS_KEYS[k].state)){
				if (KEYBOARDS_KEYS[k].state === 1){
					keyboardEvent(k, 1, KEYBOARDS_KEYS[k].held);
					KEYBOARDS_KEYS[k].state = 2;
					KEYBOARDS_KEYS[k].held = KEYBOARDS_KEYS[k].held + dt;
				} else if (KEYBOARDS_KEYS[k].state === 2){
					keyboardEvent(k, 2, KEYBOARDS_KEYS[k].held);
					KEYBOARDS_KEYS[k].held = KEYBOARDS_KEYS[k].held + dt;
				}
			} else {
				if (KEYBOARDS_KEYS[k].state === 3){
					KEYBOARDS_KEYS[k].state = 0;
					KEYBOARDS_KEYS[k].held = 0;
				}
			}
		}
	});
	
	
	// specific
	// depend on where we are
	switch(ACTUAL_STATE){
		case "OPTIONS": {
			optionsHomePage.update(dt);
			break;
		}
	}
	
}


game.draw = function draw(){
	const [WIDTH, HEIGHT] = [game.canvas.width,game.canvas.height];
	switch(ACTUAL_STATE){
		case "HOME": {
			// main menu
			
			// draw background
			const background = ASSETS.main.background.src;
			game.ctx.drawImage(background, 0, 0, background.width, background.height, (WIDTH/2) - background.width / 2, 0, background.width, HEIGHT);
			
			// draw main name
			game.ctx.font = "700 80px Poppins";
			game.ctx.fillStyle = "#fff";
			game.ctx.textAlign = "end";
			game.ctx.fillText(game.name, (game.ctx.measureText(game.name).width / 2) + (WIDTH/2), HEIGHT / 4);
			
			// draw menu options
			game.ctx.font = "600 40px Poppins";
			game.ctx.textAlign = "center";
			MENU_OPTIONS.forEach((section, index) => {
				game.ctx.fillStyle = MENU_OPTIONS_HOVER === section.id ? "#5172de" : "#fff";
				game.ctx.fillText(section.name, (WIDTH/2) + section.xDecal, (section.id === "EXIT" ? HEIGHT - 50 : (HEIGHT / 3) + 100 + (80 * index)) + section.yDecal);
			})
			
			game.ctx.font = "700 17px Poppins";
			game.ctx.fillStyle = "#a160ec";
			game.ctx.textAlign = "start";
			game.ctx.fillText("By Sedorriku#1949", 10, HEIGHT - 10)
			break;
		}
		case "OPTIONS": {
			const background = ASSETS.main.background.src;
			game.ctx.drawImage(background, 0, 0, background.width, background.height, (WIDTH/2) - background.width / 2, 0, background.width, HEIGHT);
			
			optionsHomePage.draw(WIDTH, HEIGHT)
			break;
		}
		case "GAME": {
			
			//    --  draw FPS
			game.ctx.font = "700 16px Poppins"; // "weight size font-family"
			game.ctx.fillStyle = "#fff";
			game.ctx.textAlign = "end";
			game.ctx.fillText(`FPS:  ${game.fps}`, game.ctx.measureText(`FPS: ${game.fps}`).width + 10, 24, 100);
		}
	}
	
	// exit page
	if (IS_EXIT_MENU_OPEN){
		
		game.ctx.fillStyle = "rgba(20,20,20,0.7)";
		game.ctx.fillRect(0,0, WIDTH, HEIGHT);
		game.ctx.fillStyle = "#222";
		game.ctx.roundRect(WIDTH/2 - 200, HEIGHT/2 - 100, 400, 200, 10).fill();
		game.ctx.textAlign = "center";
		game.ctx.font = "700 20px Poppins";
		game.ctx.fillStyle = "#fff";
		game.ctx.fillText("Etes vous sûr de vouloir partir ?", WIDTH/2, HEIGHT/2 - 25);
		// yes and no
		
		game.ctx.fillStyle = EXIT_MENU_RESPONSE_HOVER < 1 ? "#d95656" : "#fff";
		game.ctx.fillText("Oui", WIDTH/2 - 40, HEIGHT/2 + 35);
		game.ctx.fillStyle = EXIT_MENU_RESPONSE_HOVER > 0 ? "#d95656" : "#fff";
		game.ctx.fillText("Non", WIDTH/2 + 40, HEIGHT/2 + 35);
	}
}





game.keydown = (key) => {
	if (!KEYBOARDS_KEYS[key.key]) KEYBOARDS_KEYS[key.key] = { state: 0, held: 0, key: key.key, last: null }
	if (![1,2].includes(KEYBOARDS_KEYS[key.key].state)) KEYBOARDS_KEYS[key.key].state = 1;
}

game.keyup = (key) => {
	if (!KEYBOARDS_KEYS[key.key]) KEYBOARDS_KEYS[key.key] = { state: 2, held: 0, key: key.key, last: null }
	if (KEYBOARDS_KEYS[key.key].state !== 3) KEYBOARDS_KEYS[key.key].state = 3;
}

function loadAssets(obj){
	Object.keys(obj).forEach((k) => {
		if (!obj[k].type) loadAssets(obj[k]);
		else if (Array.isArray(obj[k])) obj[k].map((a) => loadAssets(a));
		else {
			switch(obj[k].type){
				case "IMG": {
					const img = new Image();
					img.src = obj[k].url;
					obj[k].src = img;
					break;
				}
				default:
					console.log("Unknown assets type: " + obj[k].type)
			}
		}
	})
}

game.load = async() => {
	loadAssets(ASSETS);
};


window.onload = () => {
	game.start()
}
