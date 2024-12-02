import { Vector2 } from './Vector2.js';
import { CanvasHandler } from './CanvasHandler.js';
import { Debug } from './Debug.js';
import { Tile } from './Tile.js';
import { Input } from './Input.js';
import { TileConfigurations } from './ShapeConfiguration.js';

/*
Go to Terminal -> New, then enter this command to start auto-compilation: tsc --watch
*/
class Game {
    color_1: string;
    color_2: string;
    color_3: string;
    color_4: string;
    color_5: string;
    color_6: string;
    color_7: string;

    THRESHOLD_DISTANCE: number;
    ZOOM_STEP: number;

    canvas_handler: CanvasHandler;
    mouse_pos: Vector2 | null;
    prev_mouse_pos: Vector2 | null;
    mouse_down: boolean;

    selected_lines_info: [number, number, boolean][];
    selected_section_index: number | null;
    selected_point: Vector2;
    
    option: boolean;
    step: number;
    debug: Debug;

    tile: Tile;
    tiles: Record<string, Tile>;
    input: Input;

	constructor() {
        this.color_1 = 'rgb(38, 70, 83)';
        this.color_2 = 'rgb(42, 157, 143)';
        this.color_3 = 'rgb(233, 196, 106)';
        this.color_4 = 'rgb(244, 162, 97)';
        this.color_5 = 'rgb(254, 250, 224)';
        this.color_6 = 'rgb(250, 237, 205)';
        this.color_7 = 'rgb(212, 163, 115)';

        this.THRESHOLD_DISTANCE = 10;
        this.ZOOM_STEP = 0.1;

		this.canvas_handler = new CanvasHandler('drawCanvas');
		this.mouse_pos = new Vector2(0, 0);
		this.mouse_down = false;

        this.selected_lines_info = [];
        this.selected_section_index = null;
        this.selected_point = new Vector2(0, 0);
        this.prev_mouse_pos = null;

        this.option = true;
        
        this.step = 0;
        const debug_settings = {
            // 'mousePos': null,
            // 'currentStep': null,
            // 'userAction': null,
            'selectedNewPoint': null,
            'selected_existing_point_index': null,
            'selected_section_index': null,
            'selected_line_index': null,
            // 'option': null,
            // 'isCornerSelected': null
        }

        const options = new TileConfigurations().getShapeNames();

        this.debug = new Debug('debug', debug_settings, true);
        this.input = new Input('tesselationSelection', options);
        this.tiles = {};
        for (let tile_option of options) {
            this.tiles[tile_option] = new Tile(tile_option);
        }
        this.tile = this.tiles[this.input.current_selection];
	}
	
    update() {
        if (this.step === 0 || this.canvas_handler.updated || this.tile !== this.tiles[this.input.current_selection]) { // Only run if there's been an input
            this.step++;
            
            this.tile = this.tiles[this.input.current_selection];

            this.handle_user_input();
            this.handle_mouse_motion();

            this.draw();
            this.debug.update();
        }
	}

    handle_user_input() {
        this.mouse_pos = this.canvas_handler.mouse_pos;
		this.mouse_down = this.canvas_handler.mouse_down;
        this.prev_mouse_pos = this.canvas_handler.prev_mouse_pos;

        if (this.canvas_handler.mouse_right_clicked) {
            this.option = !this.option;
        }
        if (this.canvas_handler.mouse_center_clicked) {
            this.tile.delete_point();
        }
        this.canvas_handler.update();
		
        if (!this.mouse_down) {
            this.tile.update(this.mouse_pos, this.THRESHOLD_DISTANCE);
        }

        this.debug.updatePointer('selectedNewPoint', this.tile.selected_new_point?.toString());
        this.debug.updatePointer('selected_existing_point_index', this.tile.selected_existing_point_index);
        this.debug.updatePointer('selected_section_index', this.tile.selected_section_index);
        this.debug.updatePointer('selected_line_index', this.tile.selected_line_index);
	}

    handle_mouse_motion() {
        if (this.mouse_down && this.tile.get_action() === 'move') {
            if (this.tile.is_corner_selected()) {
                this.tile.move_corner(this.mouse_pos);
            }
            else {
                this.tile.move_point(this.mouse_pos);
            }
		}
        else if (this.mouse_down && this.tile.get_action() == 'create') {
            this.tile.create_point(this.option);
		}
        else if (this.mouse_down && this.prev_mouse_pos !== null) {
            this.tile.move_tile(this.mouse_pos, this.prev_mouse_pos);
		}
	}
	
    draw() {
		this.canvas_handler.clearToWhite();
        this.tile.draw_tesselation(this.canvas_handler, 10, [this.color_5, this.color_6, this.color_7]);
        
        for (const line of this.tile.lines) {
            line.draw_spline(this.canvas_handler, this.color_1)
            line.draw_control_points(this.canvas_handler, this.color_2, this.color_3, this.color_4, 3)
		}
        if (this.tile.selected_new_point !== null) {
            this.canvas_handler.drawCircle(this.tile.selected_new_point.x, this.tile.selected_new_point.y, 4, this.color_4);
        }
        else if (this.tile.selected_existing_point_index !== null && this.tile.selected_line_index !== null) {
            const point: Vector2 = this.tile.lines[this.tile.selected_line_index].points[this.tile.selected_existing_point_index].pos;
            this.canvas_handler.drawCircle(point.x, point.y, 4, this.color_4);
        }
	}

}


function updateEveryFrame(game: Game) {
	game.update();
    // Schedule the next call
    requestAnimationFrame(() => updateEveryFrame(game));
}

document.addEventListener('DOMContentLoaded', function() {
    const game = new Game();
    updateEveryFrame(game);
});