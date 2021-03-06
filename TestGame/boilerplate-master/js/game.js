/* Game namespace */
var game = {

    // an object where to store game information
    data: {
        // score
        score: 0,
        total_score: 0,

        //to track which story we are on
        story_count : 2,

        //This is the count of level that will be used to determine which leve they are at
        level_count: 1,
        // Will use this to determine which sub level should be loaded.
        sub_l_count: 0,
		
		// this will contain the data structure for the levels. at the top is are the stories, 
		//then the differententiated version of each story, then the altered versoin of each of those levels
        level: {
			//collecting story
            1: {
                1: ["area00"]
            },
            // jumping story
            2: {
				//School setting
                1: ["area01", "area02", "area03", "area04"],
				//home setting
				2: [],
				//other
				3: [],
				//other
				4: []
            }
        }




    },



    // Run on page load.
    "onload": function() {
        // Initialize the video.
        if (!me.video.init(960, 640, {
                wrapper: "screen",
                scale: "auto"
            })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function() {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.
    "loaded": function() {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // add our player entity in the entity pool
        me.pool.register("boy", game.PlayerEntity);
        me.pool.register("CoinEntity", game.CoinEntity);
        me.pool.register("CoinEntity2", game.CoinEntity);
        me.pool.register("boys", game.EnemyEntity);
        me.pool.register("move1", game.LevelChangeEntity);
		me.pool.register("coin1_1_1", game.CoinEntity);
		me.pool.register("silly",game.EnemyEntity);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X, "jump", true);

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};