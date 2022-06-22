
function keyboardEvent(key, state, held){
	
	if (state === 1 || (state === 2 && held >= KEYBOARDS_KEYS[".data"].heldTime && Math.round(held / KEYBOARDS_KEYS[".data"].heldTimeBetween) > KEYBOARDS_KEYS[key].last)) {
		KEYBOARDS_KEYS[key].last = Math.round(held / KEYBOARDS_KEYS[".data"].heldTimeBetween);
		console.log(`Touch: ${key}`)
		
		if (IS_EXIT_MENU_OPEN){
			// exit menu
			// Select "yes" or "no" and "enter"
			// "escape" is the equivalent to "no" and "enter"
			switch(key){
				case "ArrowRight": {
					EXIT_MENU_RESPONSE_HOVER = (EXIT_MENU_RESPONSE_HOVER < 1 ? 1 : 0)
					break;
				}
				case "ArrowLeft": {
					EXIT_MENU_RESPONSE_HOVER = (EXIT_MENU_RESPONSE_HOVER > 0 ? 0 : 1)
					break;
				}
				case "Enter": {
					if (EXIT_MENU_RESPONSE_HOVER > 0){
						// don't close
						EXIT_MENU_RESPONSE_HOVER = 1;
						IS_EXIT_MENU_OPEN = false;
					} else {
						// close window
						window.close()
					}
					break;
				}
				case "Escape": {
					EXIT_MENU_RESPONSE_HOVER = 1;
					IS_EXIT_MENU_OPEN = false;
					break;
				}
			}
		}
		else if (ACTUAL_STATE === "HOME"){
			// homepage
			// ONLY HOME PAGE
			// categories of home page don't included
			switch(key){
				// navigate between different options
				case "ArrowDown": {
					const index = MENU_OPTIONS.findIndex(({ id }) => id === MENU_OPTIONS_HOVER);
					if (index >= 0) MENU_OPTIONS_HOVER = MENU_OPTIONS[(index + 1) % MENU_OPTIONS.length].id;
					break;
				}
				case "ArrowUp": {
					const index = MENU_OPTIONS.findIndex(({ id }) => id === MENU_OPTIONS_HOVER);
					if (index >= 0) MENU_OPTIONS_HOVER = MENU_OPTIONS[(index - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length].id;
					break;
				}
				case "Enter": {
					if (MENU_OPTIONS_HOVER === "EXIT")
						IS_EXIT_MENU_OPEN = true;
					else if (MENU_OPTIONS_HOVER === "NEW"){
						console.log("launch new game")
					} else if (MENU_OPTIONS_HOVER === "LOAD"){
						console.log("load game")
					} else if (MENU_OPTIONS_HOVER === "OPTIONS"){
						optionsHomePage.open();
					} else if (MENU_OPTIONS_HOVER === "SUCCESS"){
						console.log("open success panel")
					}
					break;
				}
				case "Escape": {
					IS_EXIT_MENU_OPEN = true;
					break;
				}
			}
		} else if (ACTUAL_STATE === "OPTIONS"){
			switch (key){
				case "Escape": {
					optionsHomePage.close();
				}
			}
		}
		
		
	}
}