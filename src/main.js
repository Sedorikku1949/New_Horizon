const wait = (ms) => new Promise((r) => setTimeout(r, ms));

class Game {
	/**
	 *
	 * @param {String} name
	 * @param {Object} [options]
	 *
	 * @param {Boolean} [options.fixedSize]
	 * @param {Boolean} [options.auto_resize]
	 * @param {Number} [options.width]
	 * @param {Number} [options.height]
	 * @param {String} [options.background]
	 */
	constructor(name, options = {}) {
		this.name = name;
		this.dtProgress = 0;
		this.lastRender = 0;
		this.lastLoop = Date.now();
		this.fps = -1;
		this.fpsUpdate = 0;
		
		this.canvas = document.querySelector("canvas");
		this.canvas.width = options.width;
		this.canvas.height = options.height;
		this.ctx = this.canvas.getContext("2d");
		
		// options
		if (options?.constructor?.name !== "Object") options = {}
		if (options.fixedSize && options.auto_resize) throw new Error("Cannot set a dynamic size if the size is fixed")
		
		// fixed size
		if (options.fixedSize && !options.auto_resize){
			if (!options["height"] && !options["width"]) throw new Error("Cannot fix size without height and width");
			else {
				this.height = options["height"];
				this.width = options["width"];
				document.querySelector("canvas").style.width = `${this.width}px`;
				document.querySelector("canvas").style.height = `${this.height}px`;
				document.querySelector("body").style["min-height"] = window.innerHeight;
				this.fixedSize = true;
			}
		} else this.fixedSize = false;
		
		// dynamic size
		this.auto_resize = options.auto_resize;
		if (this.auto_resize) window.addEventListener('resize', this.autoResize, false);
		
		this.background = options.background ? options.background : null;
		if (this.background) document.querySelector("canvas").style.background = this.background;
		
		this.working = false;
	}
	
	autoResize(){
		const canvas = document.querySelector("canvas");
		let [canvasRatio, windowRatio] = [canvas.height / canvas.width, window.innerHeight / window.innerWidth];
		canvas.style.height = `${windowRatio < canvasRatio ? window.innerHeight : window.innerWidth * canvasRatio}px`;
		canvas.style.width = `${windowRatio < canvasRatio ? window.innerHeight / canvasRatio : window.innerWidth}px`;
		document.querySelector("body").style["min-height"] = window.innerHeight;
	}
	async start(){
		this.working = true;
		
		this.ctx.font = "900 40px Helvetica"
		game.ctx.fillStyle = "#fff";
		game.ctx.textAlign = "center";
		this.ctx.fillText("Chargement...", this.canvas.width/2, this.canvas.height/2);
		
		if (typeof this.load == "function") await this.load();
		
		if(typeof this.keydown == "function") window.addEventListener("keydown", this.keydown);
		if(typeof this.keyup == "function") window.addEventListener("keyup", this.keyup);
		
		await this.loop();
	}
	
	async loop(tmp){
		// update dt && fps
		game.dtProgress = tmp - game.lastRender;
		if (game.fpsUpdate > 20){
			game.fps = Math.round(1000 / ((Date.now() - game.lastLoop)));
			//console.debug("FPS: " + game.fps)
			game.fpsUpdate = 0;
		} else game.fpsUpdate = game.fpsUpdate + 1;
		
		// use custom functions
		if (typeof game.update == "function") await game.update(game.dtProgress);
		
		game.ctx.clearRect(0,0,game.canvas.width, game.canvas.height);
		if (typeof game.draw == "function")   await game.draw();
		
		game.lastRender = tmp;
		game.lastLoop = Date.now();
		
		if (game.working) window.requestAnimationFrame(game.loop);
	}
}