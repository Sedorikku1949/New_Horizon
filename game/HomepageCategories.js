let optionsHomePage = {
	draw: (WIDTH, HEIGHT) => {
		game.ctx.fillStyle = "rgba(20,20,20,0.7)";
		game.ctx.fillRect(0,0, WIDTH, HEIGHT);
		
		game.ctx.fillStyle = "#222";
		game.ctx.roundRect(WIDTH/2 - 500, HEIGHT/2-400, 1000, 800, 10).fill();
		
		// disable
		game.ctx.textAlign = "center";
		game.ctx.fillStyle = "#bdbdbd";
		game.ctx.font = "700 30px Poppins";
		game.ctx.fillText("Cette fonctionnalité n'est pas encore disponible.", WIDTH/2, HEIGHT/2);
		game.ctx.font = "700 20px 'Press Start 2P'";
		game.ctx.fillStyle = "#666";
		game.ctx.fillText("[EXIT]", WIDTH/2, HEIGHT/2 + 350);
	},
	update: (dt) => {},
	open: () => {
		this.last = ACTUAL_STATE;
		ACTUAL_STATE = "OPTIONS";
	},
	close: () => {
		ACTUAL_STATE = this.last;
		this.last = null;
	},
	last: null
}