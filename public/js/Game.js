import { Vector2 } from './Vector2.js';
import { CanvasHandler } from './CanvasHandler.js';
import { Debug } from './Debug.js';
import { Tile } from './Tile.js';
import { TileSelector } from './TileSelector.js';
import { TileConfigurations } from './TileConfiguration.js';
/*
Go to Terminal -> New, then enter this command to start auto-compilation: tsc --watch
*/
class Game {
    constructor() {
        this.color_1 = 'rgb(38, 70, 83)';
        this.color_2 = 'rgb(42, 157, 143)';
        this.color_3 = 'rgb(233, 196, 106)';
        this.color_4 = 'rgb(244, 162, 97)';
        this.color_5 = 'rgb(254, 250, 224)';
        this.color_6 = 'rgb(250, 237, 205)';
        this.color_7 = 'rgb(212, 163, 115)';
        this.threshold_distance = 10;
        this.canvas_handler = new CanvasHandler('drawCanvas');
        this.mouse_pos = new Vector2(0, 0);
        this.transformed_mouse_pos = new Vector2(0, 0);
        this.prev_mouse_pos = null;
        this.mouse_down = false;
        this.selected_section_index = null;
        this.selected_point = new Vector2(0, 0);
        this.corner_type = false;
        this.tiles = [];
        this.tile_selector = new TileSelector('tesselationSelection');
        const debug_settings = {
            'mouse_pos': null,
            'this.tile.pan': null,
            'selectedNewPoint': null,
            'selected_existing_point_index': null,
            'selected_section_index': null,
            'selected_line_index': null,
            'corner': null
        };
        this.debug = new Debug('debug', debug_settings, false);
        const canvas_center = this.canvas_handler.get_center();
        for (let i = 0; i < new TileConfigurations().data.length; i++) {
            this.tiles.push(new Tile(i, canvas_center));
        }
        this.tile = this.tiles[this.tile_selector.current_selection];
        window.addEventListener('resize', () => {
            this.canvas_handler.update_size();
            this.draw();
        });
    }
    update() {
        if (this.canvas_handler.updated || this.tile !== this.tiles[this.tile_selector.current_selection]) {
            this.tile = this.tiles[this.tile_selector.current_selection];
            this.handle_user_input();
            this.handle_mouse_motion();
            this.draw();
            this.debug.update();
        }
    }
    handle_user_input() {
        var _a;
        this.mouse_pos = this.canvas_handler.mouse_pos;
        if (this.mouse_pos !== null) {
            this.transformed_mouse_pos = this.mouse_pos.subtract(this.tile.pan);
        }
        this.mouse_down = this.canvas_handler.mouse_down;
        this.prev_mouse_pos = this.canvas_handler.prev_mouse_pos;
        if (this.canvas_handler.mouse_right_clicked) {
            this.corner_type = !this.corner_type;
        }
        if (this.canvas_handler.mouse_center_clicked) {
            this.tile.delete_point();
        }
        this.canvas_handler.update();
        if (!this.mouse_down) {
            this.tile.update(this.mouse_pos, this.transformed_mouse_pos, this.threshold_distance);
        }
        this.debug.updatePointer('mouse_pos', this.mouse_pos);
        this.debug.updatePointer('this.tile.pan', this.tile.pan);
        this.debug.updatePointer('selectedNewPoint', (_a = this.tile.selected_new_point) === null || _a === void 0 ? void 0 : _a.toString());
        this.debug.updatePointer('selected_existing_point_index', this.tile.selected_existing_point_index);
        this.debug.updatePointer('selected_section_index', this.tile.selected_section_index);
        this.debug.updatePointer('selected_line_index', this.tile.selected_line_index);
        this.debug.updatePointer('corner', this.tile.corners[0].toString());
    }
    handle_mouse_motion() {
        if (this.mouse_down) {
            if (this.tile.get_action() === 'move') {
                if (this.tile.is_corner_selected()) {
                    this.tile.move_corner(this.transformed_mouse_pos);
                }
                else {
                    this.tile.move_point(this.transformed_mouse_pos);
                }
            }
            else if (this.tile.get_action() === 'create') {
                this.tile.create_point(this.corner_type);
            }
            else if (this.prev_mouse_pos !== null) {
                this.tile.move_tile(this.mouse_pos, this.prev_mouse_pos);
            }
        }
    }
    draw() {
        this.canvas_handler.clear_to_white();
        this.tile.draw_tesselation(this.canvas_handler, 10, [this.color_5, this.color_6, this.color_7]);
        this.canvas_handler.draw_shape(this.color_1, this.tile.create_polygon(), new Vector2(0, 0), false);
        for (const line of this.tile.lines) {
            line.draw_control_points(this.canvas_handler, this.tile.pan, this.color_2, this.color_3, this.color_4, 3);
        }
        if (this.tile.selected_new_point !== null) {
            this.canvas_handler.draw_circle(this.tile.selected_new_point.x, this.tile.selected_new_point.y, 4, this.color_4);
        }
        else if (this.tile.selected_existing_point_index !== null && this.tile.selected_line_index !== null) {
            const point = this.tile.lines[this.tile.selected_line_index].points[this.tile.selected_existing_point_index].pos;
            this.canvas_handler.draw_circle(point.x + this.tile.pan.x, point.y + this.tile.pan.y, 4, this.color_4);
        }
    }
}
function updateEveryFrame(game) {
    game.update();
    requestAnimationFrame(() => updateEveryFrame(game));
}
document.addEventListener('DOMContentLoaded', function () {
    const game = new Game();
    game.draw(); // Render the game once
    updateEveryFrame(game);
});
