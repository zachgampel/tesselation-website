import { Vector2 } from './Vector2.js';

export class CanvasHandler {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;

    mouse_pos: Vector2 | null = null;
    mouse_down: boolean = false;
    prev_mouse_pos: Vector2 | null = null;
    mouse_right_clicked: boolean = false;
    mouse_center_clicked: boolean = false;
    updated: boolean = false;
    pan: Vector2 = new Vector2(0, 0);

    constructor(canvas_id: string) {
        this.canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d', {alpha: false});
            if (this.ctx) {
                this.ctx.font = '24px serif';
                this.update_size();
            }
            this.setup_event_listeners();
        }
        else {
            this.ctx = null;
            console.error('Failed to get canvas element');
        }
    }

    update() {
        this.mouse_right_clicked = false;
        this.mouse_center_clicked = false;
        this.updated = false;
    }

    get_center(): Vector2 {
        if (this.canvas !== null) {
            return new Vector2(Math.floor(this.canvas.width / 2), Math.floor(this.canvas.height / 2));
        }
        return new Vector2(0, 0);
    }

    get_width_height(): Vector2 {
        if (this.canvas !== null) {
            return new Vector2(this.canvas.width, this.canvas.height);
        }
        return new Vector2(0, 0);
    }

    setup_event_listeners() {
        if (this.canvas) {
            this.canvas.addEventListener('mousedown', (e) => {
                if (e.button === 0) {
                    this.mouse_down = true;
                }
                else if (e.button === 1) {
                    e.preventDefault(); // Prevent the scroll wheel from appearing
                    this.mouse_center_clicked = true;
                }
                else if (e.button === 2) {
                    this.mouse_right_clicked = true;
                }
                this.update_mouse_position(e);
                this.updated = true;
            });

            this.canvas.addEventListener('mousemove', (e) => {
                this.update_mouse_position(e);
                this.updated = true;
            });

            this.canvas.addEventListener('mouseup', (e) => {
                this.mouse_down = false;
                this.update_mouse_position(e);
                this.updated = true;
            });

            this.canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.update_mouse_position(e);
                this.updated = true;
            });
        }
    }

    update_mouse_position(event: MouseEvent) {
        if (this.mouse_pos === null) {
            this.prev_mouse_pos = null;
        }
        else {
            this.prev_mouse_pos = new Vector2(this.mouse_pos.x, this.mouse_pos.y);
        }
        if (this.canvas) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse_pos = new Vector2(Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top));
        }
    }

    update_size() {
        if (this.canvas !== null) {
            this.canvas.width = window.innerWidth;
            this.canvas.style.width = `${this.canvas.width}px`;

            this.canvas.height = window.innerHeight;
            this.canvas.style.height = `${this.canvas.height}px`;
        }
    }

    draw_circle(x: number, y: number, radius: number, color: string = 'black') {
        if (this.ctx) {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

	clear_to_white() {
        if (this.canvas && this.ctx) {
            this.ctx.fillStyle = 'white'; // Set the fill color to white
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // Fill the canvas with white
        }
	}

    draw_shape(color: string, points: Array<Vector2>, scale: Vector2, is_polygon: boolean) {
        if (points.length < 2) {
            return;
        }
        
        if (this.ctx) {
            is_polygon ? this.ctx.fillStyle = color : this.ctx.strokeStyle = color;
            this.ctx.save();
            this.ctx.translate(scale.x, scale.y);
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            if (is_polygon === true) {
                this.ctx.closePath();
                this.ctx.fill();
            }
            else {
                this.ctx.stroke();
            }

            this.ctx.restore();
        }
    }

    draw_text(text: string, x: number, y: number) {
        if (this.ctx !== null) {
            this.ctx.fillStyle = 'black';
            this.ctx.textAlign = "center";
            this.ctx.fillText(text, x, y);
        }
    }
}