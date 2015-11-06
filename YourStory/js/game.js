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
		
		story_nums:2,
		
		number_mess_ups:0,
		//This will be for checking if they put their coins in the box before leaving
		in_box: false,
		
		// this will contain the data structure for the levels. at the top is are the stories, 
		//then the differententiated version of each story, then the altered versoin of each of those levels
		
		//each sublevel should be of type  {"level":[],"intro":""}  where each entry in the "level" 
		//list is the same level with differently placed objects.
        level: {
			//collecting story
            1: {
                1: {"level":["story_collect"],"intro":"story_collect"}
            },
            // jumping story
            2: {
				//home setting	
                1: {"level":["story_jump_1_1","story_jump_1_2","story_jump_1_3","story_jump_1_4"],"intro":"room1"},
				//home setting
				2: {"level":["story_jump_2_1","story_jump_2_2","story_jump_2_3","story_jump_2_4"],"intro":"room1"},
				//school setting	
				3: {"level":["story_jump_3_1","story_jump_3_2","story_jump_3_3","story_jump_3_4"],"intro":"room2"},
				//school setting
				4: {"level":["story_jump_4_1","story_jump_4_2","story_jump_4_3","story_jump_4_4"],"intro":"room2"}
            }
        },
		kids:["boy1","boy2","boy3","boy4","girl1","girl2","girl3",""],
		
		adult:["woman1","woman2","woman3","woman3","woman4","woman5", ""],
		
		stories:["Collect","Jumping"],
		
		hurt_sounds:["oooh","Oh, my",""],
		
		end:"end"



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
        me.pool.register("boys", game.EnemyEntity);
        me.pool.register("move1", game.LevelChangeEntity);
		me.pool.register("coin1_1_1", game.CoinEntity);
		me.pool.register("coin", game.CoinEntity);
		me.pool.register("tramp", game.TrampEntity);
		me.pool.register("box",game.BoxEntity);
		me.pool.register("adult",game.EnemyEntity);
		me.pool.register("door",game.DoorEntity);
		me.pool.register("play",game.PlayEntity);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
		me.input.bindKey(me.input.KEY.X,"put");

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};