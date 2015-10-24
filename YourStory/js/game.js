/* Game namespace */
var game = {

    // an object where to store game information
    data: {
        // score
        score: 0,
        total_score: 0,

        //to track which story we are on
        story_count: 2,

        //This is the count of level that will be used to determine which leve they are at
        level_count: 1,
        // Will use this to determine which sub level should be loaded.
        sub_l_count: 0,
		//This will be for checking if they put their coins in the box before leaving
		in_box: false,
		
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
                1: ["story_jump_1_1","story_jump_1_2"],
				//home setting
				2: ["story_jump_2_1"],
				//other
				3: [],
				//other
				4: []
            }
        },
		kids:["boy1","boy2","boy3","boy4","girl1",""]



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
        me.pool.register("boys", game.EnemyEntity)
        me.pool.register("move1", game.LevelChangeEntity);
		me.pool.register("coin1_1_1", game.CoinEntity);
		me.pool.register("tramp", game.TrampEntity);
		me.pool.register("box",game.BoxEntity);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
		me.input.bindKey(me.input.KEY.X,"put");

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};