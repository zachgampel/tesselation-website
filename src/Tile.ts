import { CanvasHandler } from './CanvasHandler.js';
import { Line } from './Line.js';
import { Vector2 } from './Vector2.js';
import { TileConfigurations } from './TileConfiguration.js';

export class Tile {
    lines: Array<Line> = [];
    corners: Array<Vector2> = [];

    configurations: TileConfigurations = new TileConfigurations();

    pan: Vector2 = new Vector2(0, 0);

    selected_new_point: Vector2 | null = null;
    selected_section_index: number | null = null;
    selected_line_index: number | null = null;
    selected_existing_point_index: number | null = null;
    point_relationships: any;
    point_special_settings: any;
    tesselation_pattern: string | null = null;
    tesselation_type: string | null = null;
    line_relationships: any = {};

    constructor(config_index: number, canvas_center: Vector2) {
        const config = this.configurations.data[config_index];

        this.create_corners(config['shape type'], config['sides'], config['angle'], canvas_center);
        this.tesselation_pattern = config['symmetry'];
        this.point_relationships = config['point_relationships'];
        this.point_special_settings = config['point_special_settings'];
        this.line_relationships = config['line_relationships'];
        this.tesselation_type = config['tesselation type'];
        this.create_lines();
    }

    create_corners(shape_type: string, corner_count: number, angle: number, center: Vector2) {
        const edge_length: number = 100;
        const edge_vector: Vector2 = new Vector2(edge_length, 0);
        this.corners = [];
        if (shape_type === 'regular') {
            for (let i = 0; i < corner_count; i++) {
                const curr_angle = angle + 2 * Math.PI * (i / corner_count);
                this.corners.push(center.add_xy(edge_length * Math.cos(curr_angle), edge_length * Math.sin(curr_angle)));
            }
        }
        else if (shape_type === 'pentagon1') {
            this.corners.push(center.add_xy(edge_length, 0));
            this.corners.push(center.add_xy(edge_length, edge_length));
            this.corners.push(center.add_xy(-edge_length, edge_length));
            this.corners.push(center.add_xy(-edge_length, 0));
            this.corners.push(center.add_xy(0, -edge_length));
        }
        else if (shape_type === 'kite') {
            this.corners.push(center);
            this.corners.push(this.corners[0].add(edge_vector.rotate(1/6 * Math.PI)));
            this.corners.push(this.corners[1].add(edge_vector.scale(Math.sqrt(3)).rotate(2/3 * Math.PI)));
            this.corners.push(this.corners[2].add(edge_vector.scale(Math.sqrt(3)).rotate(4/3 * Math.PI)));
            this.corners.push(this.corners.shift() as Vector2);
        }
        else if (shape_type === 'rhombus') {
            this.corners.push(center.add_xy(1.5 * edge_length, 0));
            this.corners.push(center.add_xy(0.5 * edge_length + edge_length * Math.cos(2/3 * Math.PI), edge_length * Math.sin(2/3 * Math.PI)));
            this.corners.push(center.add_xy(-1.5 * edge_length, 0));
            this.corners.push(center.add_xy(0.5 * edge_length + edge_length * Math.cos(4/3 * Math.PI), edge_length * Math.sin(4/3 * Math.PI)));
        }
        else if (shape_type === '4-way-triangle') {
            this.corners.push(center);
            this.corners.push(center.add_xy(2 * edge_length * Math.cos(1/4 * Math.PI), 2 * edge_length * Math.sin(1/4 * Math.PI)));
            this.corners.push(center.add_xy(2 * edge_length * Math.cos(3/4 * Math.PI), 2 * edge_length * Math.sin(3/4 * Math.PI)));
        }
        else if (shape_type === 'pentagon 4-way') {
            this.corners.push(center);
            this.corners.push(this.corners[0].add(edge_vector.rotate(1/6 * Math.PI)));
            this.corners.push(this.corners[1].add(edge_vector.rotate(2/3 * Math.PI)));
            this.corners.push(new Vector2(this.corners[2].x - edge_length * (Math.sqrt(3) - 1), this.corners[2].y));
            this.corners.push(this.corners[3].add(edge_vector.rotate(4/3 * Math.PI)));
        }
        else if (shape_type === 'isoscelese triangle') {
            this.corners.push(center);
            this.corners.push(this.corners[0].add(edge_vector.scale(2).rotate(1/6 * Math.PI)));
            this.corners.push(this.corners[0].add(edge_vector.scale(2).rotate(5/6 * Math.PI)));
        }
        else if (shape_type === 'pentagon6-way') {
            this.corners.push(center);
            this.corners.push(this.corners[0].add(edge_vector.scale(2).rotate(4/3 * Math.PI)));
            this.corners.push(this.corners[1].add(edge_vector.rotate(5/3 * Math.PI)));
            this.corners.push(this.corners[2].add(edge_vector));
            this.corners.push(this.corners[3].add(edge_vector.rotate(1/3 * Math.PI)));
        }
    }

    create_lines() {
        this.lines =[];
        for (let i = 0; i < this.corners.length; i++) {
            const p1: Vector2 = this.corners[i];
            const p2: Vector2 = this.corners[(i + 1) % this.corners.length];
            this.lines.push(new Line(p1, p2));
        }
    }

    get_action(): string | null {
        if (this.selected_new_point !== null) {
            return 'create';
        }
        else if (this.selected_existing_point_index !== null) {
            return 'move';
        }
        else {
            return null;
        }
    }

    update(mouse_pos: Vector2 | null, transformed_mouse_pos: Vector2 | null, thresh: number) {
        this.selected_new_point = null;
        this.selected_section_index = null;
        this.selected_line_index = null;
        this.selected_existing_point_index = null;

        this.find_user_existing_point(transformed_mouse_pos, thresh);
        if (this.selected_existing_point_index === null) {
            this.find_user_new_point(mouse_pos, thresh);
        }
    }

    find_user_existing_point(transformed_mouse_pos: Vector2 | null, thresh: number) {
        if (transformed_mouse_pos !== null) {
            let min_control_point_distance: number = thresh;
            for (let curr_line_index = 0; curr_line_index < this.lines.length; curr_line_index++) {
                const line: Line = this.lines[curr_line_index];
                for (let curr_point_index = 0; curr_point_index < line.points.length; curr_point_index++) {
                    const point: Vector2 = line.points[curr_point_index].pos;
                    let distance = point.subtract(transformed_mouse_pos).magnitude();
                    if (distance < min_control_point_distance) {
                        this.selected_line_index = curr_line_index;
                        this.selected_existing_point_index = curr_point_index;
                    }
                }
            }
        }
    }

    find_user_new_point(mouse_pos: Vector2 | null, thresh: number) {
        if (mouse_pos !== null) {
            let min_distance: number = thresh;
            for (let curr_line_index = 0; curr_line_index < this.lines.length; curr_line_index++) {
                const line: Line = this.lines[curr_line_index];
                const spline_points: Array<Array<Vector2>> = line.get_spline_points(this.pan)
                for (let spline_section_index = 0; spline_section_index < spline_points.length; spline_section_index++) {
                    const spline_subsection: Array<Vector2> = spline_points[spline_section_index];
                    for (let k = 0; k < spline_subsection.length - 1; k++) {
                        let [distance, point] = Line.closest_point(mouse_pos, spline_subsection[k], spline_subsection[k + 1], min_distance);
                        if (distance < min_distance && point !== null) {
                            min_distance = distance

                            this.selected_new_point = point;
                            this.selected_line_index = curr_line_index;
                            this.selected_section_index = spline_section_index + 1;
                        }
                    }
                }
            }
        }
    }

    is_corner_selected(): boolean {
        if (this.selected_line_index !== null) {
            return this.selected_existing_point_index === 0 || this.selected_existing_point_index === this.lines[this.selected_line_index].points.length - 1;
        }
        else {
            return false;
        }
    }

    calculate_point(relationship_settings: string, relationship_line: Line, input_point: Vector2): [number, Vector2] {
        const settings: Record<string, number> = this.configurations.get_settings(relationship_settings);
        
        if (this.selected_line_index !== null && (this.selected_existing_point_index !== null || this.selected_section_index !== null)) {
            const line: Line = this.lines[this.selected_line_index];
            let point_or_section_index: number = (this.selected_existing_point_index !== null) ? this.selected_existing_point_index : this.selected_section_index as number;

            const line_1_direction = line.points[line.points.length - 1].pos.subtract(line.points[0].pos);
            const line_2_direction = relationship_line.points[relationship_line.points.length - 1].pos.subtract(relationship_line.points[0].pos);

            let absolute_offset: Vector2 = input_point.subtract(line.points[0].pos);
            if (settings['mirror'] === 1) {
                const angle2: number = absolute_offset.angle_to(line_1_direction);
                absolute_offset = absolute_offset.rotate(2 * angle2);
            }

            const angle = line_1_direction.angle_to(line_2_direction);
            absolute_offset = absolute_offset.rotate(angle).multiply_xy(settings['reflect_x'], settings['reflect_y']);

            let relationship_point_index: number = point_or_section_index;
            let base_point_index = 0;
            if (settings['start_end'] === 1) {
                relationship_point_index = relationship_line.points.length - point_or_section_index;
                if (this.selected_section_index === null) {
                    relationship_point_index -= 1;
                }
                base_point_index = relationship_line.points.length - 1;
            }
            
            let new_pos: Vector2 = relationship_line.points[base_point_index].pos.add(absolute_offset);

            return [relationship_point_index, new_pos];
        }
        else {
            console.error(`calculate_point encountered an error.`);
            return [-1, new Vector2(0, 0)];
        }
    }

    create_point(option: boolean) {
        if (this.selected_line_index !== null && this.selected_new_point !== null && this.selected_section_index !== null) {
            const panned_selected_new_point: Vector2 = this.selected_new_point.subtract(this.pan);
            let overwrite_val: number | null = null;

            const line_relationships = this.line_relationships[this.selected_line_index];
            for (let i = 0; i < line_relationships.length; i++) {
                const [relationship_line_index, relationship_settings_1, relationship_settings_2] = line_relationships[i];     
                const relationship_line: Line = this.lines[relationship_line_index];

                if (relationship_settings_2 === undefined) {
                    let [relationship_point_index_1, p1] = this.calculate_point(relationship_settings_1, relationship_line, panned_selected_new_point);
                    if (relationship_point_index_1 !== -1) {
                        relationship_line.insert_point(relationship_point_index_1, p1, option);
                    }
                }
                else {
                    let [relationship_point_index_1, p1] = this.calculate_point(relationship_settings_1, relationship_line, panned_selected_new_point);
                    let [relationship_point_index_2, p2] = this.calculate_point(relationship_settings_2, relationship_line, panned_selected_new_point);
                    if (relationship_point_index_1 === relationship_point_index_2) {
                        if (p1.subtract(relationship_line.points[0].pos).magnitude() < p2.subtract(relationship_line.points[0].pos).magnitude()) {
                            relationship_line.insert_point(this.selected_section_index, p1, option);
                            relationship_line.insert_point(this.selected_section_index + 1, p2, option);
                        }
                        else {
                            relationship_line.insert_point(this.selected_section_index, p2, option);
                            relationship_line.insert_point(this.selected_section_index + 1, p1, option);
                            if (this.selected_line_index === relationship_line_index) {
                                overwrite_val = this.selected_section_index + 1;
                            }
                        }
                    }
                    else {
                        if (relationship_point_index_1 > relationship_point_index_2) {
                            relationship_line.insert_point(relationship_point_index_1, p1, option);
                            relationship_line.insert_point(relationship_point_index_2, p2, option);
                            if (this.selected_line_index === relationship_line_index) {
                                overwrite_val = this.selected_section_index + 1;
                            }
                        }
                        else {
                            relationship_line.insert_point(relationship_point_index_2, p2, option);
                            relationship_line.insert_point(relationship_point_index_1, p1, option);
                        }
                    }
                }
            }

            this.selected_new_point = null;
            this.selected_existing_point_index = this.selected_section_index;
            this.selected_section_index = null;

            if (overwrite_val !== null) {
                this.selected_existing_point_index = overwrite_val;
            }
        }
    }

    move_point(transformed_mouse_pos: Vector2 | null) {
        if (this.selected_line_index !== null && this.selected_existing_point_index !== null && transformed_mouse_pos !== null) {
            const line: Line = this.lines[this.selected_line_index];
            const selected_point: Vector2 = line.points[this.selected_existing_point_index].pos;
            const offset: Vector2 = transformed_mouse_pos.subtract(selected_point);
            const line_relationships = this.line_relationships[this.selected_line_index];
            this.lines[this.selected_line_index].move_point_relative(this.selected_existing_point_index, offset);
            
            for (let i = 0; i < line_relationships.length; i++) {
                const [relationship_line_index, relationship_settings_1, relationship_settings_2] = this.line_relationships[this.selected_line_index][i];     
                const relationship_line: Line = this.lines[relationship_line_index];

                if (relationship_settings_2 === undefined) {
                    let [relationship_point_index_1, p1] = this.calculate_point(relationship_settings_1, relationship_line, transformed_mouse_pos);
                    if (relationship_point_index_1 !== -1) {
                        relationship_line.move_point_absolute(relationship_point_index_1, p1);
                    }
                }
                else {
                    let [relationship_point_index_1, p1] = this.calculate_point(relationship_settings_1, relationship_line, transformed_mouse_pos);
                    let [relationship_point_index_2, p2] = this.calculate_point(relationship_settings_2, relationship_line, transformed_mouse_pos);
                    if (relationship_point_index_1 !== -1 && relationship_point_index_2 !== -1) {
                        relationship_line.move_point_absolute(relationship_point_index_1, p1);
                        relationship_line.move_point_absolute(relationship_point_index_2, p2);
                    }
                }
            }
        }
    }

    delete_point() {
        if (this.selected_line_index !== null && this.selected_existing_point_index !== null) {
            const line_relationships = this.line_relationships[this.selected_line_index];
            for (let i = 0; i < line_relationships.length; i++) {
                const [relationship_line_index, relationship_settings_1, relationship_settings_2] = this.line_relationships[this.selected_line_index][i];
                if (relationship_settings_2 === undefined) {
                    const settings: Record<string, number> = this.configurations.get_settings(relationship_settings_1);
                    let relationship_point_index: number = this.selected_existing_point_index;
                    if (settings['start_end'] === 1) {
                        relationship_point_index = this.lines[relationship_line_index].points.length - this.selected_existing_point_index - 1;
                    }

                    this.lines[relationship_line_index].delete_point(relationship_point_index);
                }
                else {
                    const relationship_point_index: number = this.lines[relationship_line_index].points.length - 1 - this.selected_existing_point_index;
                    const indexes: Array<number> = (relationship_point_index > this.selected_existing_point_index) ? [relationship_point_index, this.selected_existing_point_index] : [this.selected_existing_point_index, relationship_point_index];
                    this.lines[relationship_line_index].delete_point(indexes[0]);
                    this.lines[relationship_line_index].delete_point(indexes[1]);
                }
            }
        }
    }

    move_corner(transformed_mouse_pos: Vector2 | null) {
        if (this.selected_line_index === null || this.selected_existing_point_index === null || transformed_mouse_pos === null) {
            return;
        }

        const line: Line = this.lines[this.selected_line_index];
        const selected_corner: Vector2 = line.points[this.selected_existing_point_index].pos;
        const offset: Vector2 = transformed_mouse_pos.subtract(selected_corner);
        
        let selected_corner_index: number | null = null;
        for (let i = 0; i < this.corners.length; i++) {
            if (selected_corner === this.corners[i]) {
                selected_corner_index = i;
            }
        }
        
        if (selected_corner_index !== null) {
            if (this.point_special_settings === 1) {
                if ([0, 2, 4].includes(selected_corner_index)) {
                    const fwd_2 = (selected_corner_index + 2) % 6;
                    const fwd_3 = (selected_corner_index + 3) % 6;
                    const fwd_4 = (selected_corner_index + 4) % 6;
                    const fwd_5 = (selected_corner_index + 5) % 6;

                    this.corners[selected_corner_index].copy(transformed_mouse_pos);

                    const magnitude_1: Vector2 = this.corners[selected_corner_index + 1].subtract(this.corners[selected_corner_index]);
                    const magnitude_rotated_1: Vector2 = magnitude_1.rotate(2 / 3 * Math.PI);
                    this.corners[fwd_5].copy(this.corners[selected_corner_index].add(magnitude_rotated_1));

                    const magnitude_2: Vector2 = this.corners[fwd_5].subtract(this.corners[fwd_4]);
                    const magnitude_rotated_2: Vector2 = magnitude_2.rotate(2 / 3 * Math.PI);
                    this.corners[fwd_3].copy(this.corners[fwd_4].add(magnitude_rotated_2));

                    this.corners[fwd_2].copy(this.corners[fwd_2].add(offset.rotate(1 / 3 * Math.PI)));
                }
                if ([1, 3, 5].includes(selected_corner_index)) {
                    this.corners[selected_corner_index].copy(transformed_mouse_pos);
                    this.corners[(selected_corner_index + 2) % 6].copy(this.corners[(selected_corner_index + 2) % 6].add(offset.rotate(4 / 3 * Math.PI)));
                    this.corners[(selected_corner_index + 4) % 6].copy(this.corners[(selected_corner_index + 4) % 6].add(offset.rotate(2 / 3 * Math.PI)));
                }
            }
            else if (this.point_special_settings === 2) {
                if (selected_corner_index === 0) {
                    this.corners[selected_corner_index].copy(this.corners[selected_corner_index].add(new Vector2(0, offset.y)));
                    this.corners[1].copy(this.corners[1].add(new Vector2(-offset.y, 0)));
                    this.corners[2].copy(this.corners[2].add(new Vector2(offset.y, 0)));
                }
                if (selected_corner_index === 1) {
                    this.corners[1].copy(this.corners[1].add(new Vector2(offset.x, offset.x)));
                    this.corners[2].copy(this.corners[2].add(new Vector2(-offset.x, offset.x)));
                }
                if (selected_corner_index === 2) {
                    this.corners[2].copy(this.corners[2].add(new Vector2(offset.x, -offset.x)));
                    this.corners[1].copy(this.corners[1].add(new Vector2(-offset.x, -offset.x)));
                }
            }
            else if (this.point_special_settings === 3) {
                if (selected_corner_index === 1 || selected_corner_index === 4) {
                    let numbers: number[] = [];
                    if (selected_corner_index === 1) numbers = [1, 1, 0, 2];
                    if (selected_corner_index === 4) numbers = [4, 0, 4, 3];
                    const [a, b, c, d] = numbers;

                    this.corners[a].copy(transformed_mouse_pos);

                    const magnitude_1: Vector2 = this.corners[b].subtract(this.corners[c]);
                    const magnitude_rotated_1: Vector2 = magnitude_1.rotate(0.5 * Math.PI);
                    this.corners[d].copy(this.corners[a].add(magnitude_rotated_1));
                }
            }
            else if (this.point_special_settings === 4) {
                let angle: number = 3 / 6 * Math.PI;
                if (selected_corner_index === 1) angle = 7 / 6 * Math.PI;
                if (selected_corner_index === 2) angle = 11 / 6 * Math.PI;
                
                const projection: Vector2 = offset.projection(new Vector2(Math.cos(angle) * offset.magnitude(), Math.sin(angle) * offset.magnitude()));

                this.corners[selected_corner_index].copy(this.corners[selected_corner_index].add(projection));
                this.corners[(selected_corner_index + 1) % 3].copy(this.corners[(selected_corner_index + 1) % 3].add(projection.rotate(2 / 3 * Math.PI)));
                this.corners[(selected_corner_index + 2) % 3].copy(this.corners[(selected_corner_index + 2) % 3].add(projection.rotate(4 / 3 * Math.PI)));
            }
            else if (this.point_special_settings === 5) {
                if (selected_corner_index === 0) {
                    let y: number = this.corners[1].y - this.corners[0].y - offset.y;
                    let x: number = y / Math.tan(Math.PI / 6);
                    this.corners[0].y = transformed_mouse_pos.y;
                    this.corners[1].copy(this.corners[0].add(new Vector2(x, y)));
                    this.corners[2].copy(this.corners[0].add(new Vector2(-x, y)));
                }
                else if (selected_corner_index === 1 || selected_corner_index === 2) {
                    let angle: number = (selected_corner_index === 1) ? 1 / 6 * Math.PI : -1 / 6 * Math.PI;

                    const projection: Vector2 = offset.projection(new Vector2(Math.cos(angle) * offset.magnitude(), Math.sin(angle) * offset.magnitude()));
                    this.corners[selected_corner_index].copy(this.corners[selected_corner_index].add(projection));
                    this.corners[selected_corner_index % 2 + 1].copy(this.corners[selected_corner_index % 2 + 1].add(projection.multiply(new Vector2(-1, 1))));
                }
            }
            else if (this.point_special_settings === 6) {
                if (selected_corner_index === 0 || selected_corner_index === 2) {
                    let angle: number = (selected_corner_index === 0) ? 4/6 * Math.PI : -4/6 * Math.PI;
                    let opposite_index: number = (selected_corner_index === 0) ? 2 : 0;

                    const projection: Vector2 = offset.projection(new Vector2(Math.cos(angle) * offset.magnitude(), Math.sin(angle) * offset.magnitude()));
                    this.corners[selected_corner_index].copy(this.corners[selected_corner_index].add(projection));
                    this.corners[opposite_index].copy(this.corners[opposite_index].add(projection.multiply(new Vector2(-1, 1))));
                    this.corners[3].copy(this.corners[3].add(projection.multiply(new Vector2(0, 4/3))));
                }
                if (selected_corner_index === 3) {
                    let angle: number = 1 / 2 * Math.PI;

                    const projection: Vector2 = offset.projection(new Vector2(Math.cos(angle) * offset.magnitude(), Math.sin(angle) * offset.magnitude()));
                    this.corners[3].copy(this.corners[3].add(projection));
                    this.corners[0].copy(this.corners[0].add(projection.rotate(1/6 * Math.PI).scale(Math.sqrt(3) / 2)));
                    this.corners[2].copy(this.corners[2].add(projection.rotate(11/6 * Math.PI).scale(Math.sqrt(3) / 2)));
                }
                if (selected_corner_index === 1) {
                    let angle: number = 3 / 2 * Math.PI;

                    const projection: Vector2 = offset.projection(new Vector2(Math.cos(angle) * offset.magnitude(), Math.sin(angle) * offset.magnitude()));
                    this.corners[1].copy(this.corners[1].add(projection));
                    this.corners[0].copy(this.corners[0].add(projection.rotate(5/3 * Math.PI).scale(0.5)));
                    this.corners[2].copy(this.corners[2].add(projection.rotate(1/3 * Math.PI).scale(0.5)));
                }
            }
            else if (this.point_special_settings === 7) {
                if (selected_corner_index === 0) {
                    this.corners[0].copy(transformed_mouse_pos);
                    this.corners[1].copy(this.corners[1].add(offset.rotate(1/3 * Math.PI)));
                }
                else if (selected_corner_index === 1) {
                    this.corners[1].copy(transformed_mouse_pos);
                    this.corners[0].copy(this.corners[0].add(offset.rotate(5/3 * Math.PI)));
                }
                else if (selected_corner_index === 2) {
                    this.corners[2].copy(transformed_mouse_pos);
                    this.corners[3].copy(this.corners[3].add(offset.rotate(1/6 * Math.PI).scale(1/Math.sqrt(3))));
                }
                else if (selected_corner_index === 3) {
                    this.corners[3].copy(transformed_mouse_pos);
                    this.corners[2].copy(this.corners[2].add(offset.rotate(-1/6 * Math.PI).scale(Math.sqrt(3))));
                }
                else if (selected_corner_index === 4) {
                    this.corners[4].copy(transformed_mouse_pos);
                    this.corners[1].copy(this.corners[1].add(offset.rotate(5/3 * Math.PI)));
                    this.corners[2].copy(this.corners[2].add(offset.rotate(2/3 * Math.PI)));
                }
            }
            
            if (this.point_relationships !== undefined) {
                let point_relationships = this.point_relationships[selected_corner_index];
                for (let i = 0; i < point_relationships.length; i++) {
                    const [corresponding_point_index, x_multiplier, y_multiplier] = this.point_relationships[selected_corner_index][i];
                    const x_multiplier_type = typeof x_multiplier;
                    const y_multiplier_type = typeof y_multiplier;
                    if (x_multiplier_type === 'number') {
                        this.corners[corresponding_point_index].x += (offset.x * x_multiplier);
                    }
                    else if (x_multiplier_type === 'string') {
                        const curr_y_multiplier = +x_multiplier;
                        this.corners[corresponding_point_index].x += (offset.y * curr_y_multiplier);
                    }
                    else {
                        console.error(`Expected number or string but received ${typeof x_multiplier} for element ${i} of corner index ${selected_corner_index}.`);
                    }

                    if (y_multiplier_type === 'number') {
                        this.corners[corresponding_point_index].y += (offset.y * y_multiplier);
                    }
                    else if (y_multiplier_type === 'string') {
                        const curr_x_multiplier = +y_multiplier;
                        this.corners[corresponding_point_index].y += (offset.x * curr_x_multiplier);
                    }
                    else {
                        console.error(`Expected number or string but received ${typeof y_multiplier} for element ${i} of corner index ${selected_corner_index}.`);
                    }
                }
            }
        }

        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].update();
        }
    }

    move_tile(mouse_pos: Vector2 | null, prev_mouse_pos: Vector2 | null): void {
        if (mouse_pos !== null && prev_mouse_pos !== null) {
            const offset: Vector2 = mouse_pos.subtract(prev_mouse_pos);
            this.pan = this.pan.add(offset);
        }
    }

    create_polygon(): Array<Vector2> {
        const polygon_points: Array<Vector2> = [];
		for (const line of this.lines) {
            const spline_points: Array<Array<Vector2>> = line.get_spline_points(this.pan);
            let spline_points_flat: Array<Vector2> = [];
            for (const section of spline_points) {
                spline_points_flat.push(...section);
            }
            polygon_points.push(...spline_points_flat);
		}

        return polygon_points;
	}

    flip_polygon_x(polygon: Array<Vector2>, center: Vector2): Array<Vector2> {
        return polygon.map(point => {
            const deltaY: number = center.y - point.y;
            return new Vector2(point.x, center.y + deltaY);
        });
    }

    rotate_polygon(polygon: Array<Vector2>, angle: number | undefined, center: Vector2): Array<Vector2> {
        if (angle === undefined || Math.abs(angle) % (2 * Math.PI) === 0) {
            return polygon;
        }
        const new_polygon: Array<Vector2> = [];
        for (const point of polygon) {
            new_polygon.push(point.subtract(center).rotate(angle).add(center));
        }

        return new_polygon;
    }

    translate_polygon(polygon: Array<Vector2>, offset: Vector2 | undefined): Array<Vector2> {
        if (offset === undefined || (offset.x === 0 && offset.y === 0)) {
            return polygon;
        }
        const translated_polygon: Array<Vector2> = [];
        for (let i = 0; i < polygon.length; i++) {
            translated_polygon.push(polygon[i].add(offset));
        }

        return translated_polygon;
    }

    draw_tesselation(canvas_handler: CanvasHandler, offset: number, colors: Array<string>) {
        if (this.tesselation_type !== null) {
            let horizontal_vector: Vector2 = new Vector2(0, 0);
            let vertical_vector: Vector2 = new Vector2(0, 0);
            let rotate_flip_center: Vector2 = new Vector2(0, 0)
            let rotation_angles: Array<number | undefined> = [];
            let flip_x: Array<boolean> = [];
            let polygons_count = 0;
            let translations: Array<Vector2 | undefined> = [];
            let color_function: Function = () => 0;

            if (this.tesselation_type === 'type1') {
                polygons_count = 1;
                horizontal_vector = this.corners[1].subtract(this.corners[0]);
                vertical_vector = this.corners[2].subtract(this.corners[1]);
                color_function = (i: number, j: number, k: number) => (((i + j) % 2) + 2) % 2;
            }
            else if (this.tesselation_type === 'type2') {
                polygons_count = 3;
                horizontal_vector = this.corners[0].subtract(this.corners[3]).add(this.corners[5]).subtract(this.corners[4]);
                vertical_vector = this.corners[2].subtract(this.corners[4]).add(this.corners[0]).subtract(this.corners[4]);
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[0].subtract(this.corners[2]),
                    this.corners[0].subtract(this.corners[4]),
                ];
                color_function = (i: number, j: number, k: number) => (k);
            }
            else if (this.tesselation_type === 'type3') {
                polygons_count = 2;
                horizontal_vector = this.corners[1].subtract(this.corners[0]).scale(2);
                vertical_vector = this.corners[2].subtract(this.corners[1]);
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[3].subtract(this.corners[0]),
                ];
                color_function = (i: number, j: number, k: number) => ((((j + k) % 2) + 2) % 2);
            }
            else if (this.tesselation_type === 'type4') {
                polygons_count = 2;
                horizontal_vector = this.corners[0].subtract(this.corners[1]).add(this.corners[0]).subtract(this.corners[2]);
                vertical_vector = this.corners[0].subtract(this.corners[2]);
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[2].subtract(this.corners[0]),
                ];
                color_function = (i: number, j: number, k: number) => (k);
            }
            else if (this.tesselation_type === 'type5') {
                polygons_count = 2;
                horizontal_vector = this.corners[1].subtract(this.corners[2]);
                vertical_vector = this.corners[1].subtract(this.corners[0]).scale(2).add(this.corners[3]).subtract(this.corners[4]);
                rotate_flip_center = this.corners[1];
                rotation_angles = [0, Math.PI];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[2].subtract(this.corners[1])
                ];
                color_function = (i: number, j: number, k: number) => ((((i + j*2 + k) % 3) + 3) % 3);
            }
            else if (this.tesselation_type === 'type6') {
                polygons_count = 2;
                horizontal_vector = this.corners[0].subtract(this.corners[1]).add(this.corners[3]).subtract(this.corners[2]);
                vertical_vector = this.corners[0].subtract(this.corners[2]);
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[3].subtract(this.corners[0])
                ];
                color_function = (i: number, j: number, k: number) => (k);
            }
            else if (this.tesselation_type === 'type7') {
                polygons_count = 2;
                horizontal_vector = this.corners[0].subtract(this.corners[3]).add(this.corners[5]).subtract(this.corners[4]);
                vertical_vector = this.corners[2].subtract(this.corners[4]);
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[5].subtract(this.corners[0]),
                ];
                color_function = (i: number, j: number, k: number) => ((((j + k) % 3) + 3) % 3);
            }
            else if (this.tesselation_type === 'type8') {
                polygons_count = 2;
                horizontal_vector = this.corners[1].subtract(this.corners[0]);
                vertical_vector = new Vector2(0, 2 * (this.corners[2].y - this.corners[1].y));
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI];
                flip_x = [false, true];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[2].subtract(this.corners[0])
                ];
                color_function = (i: number, j: number, k: number) => ((((i + k) % 2) + 2) % 2);
            }
            else if (this.tesselation_type === 'type9') {
                polygons_count = 2;
                horizontal_vector = this.corners[2].subtract(this.corners[0]);
                vertical_vector = this.corners[1].subtract(this.corners[3]);
                rotate_flip_center = this.corners[1];
                rotation_angles = [0, 0];
                flip_x = [false, true];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[0].subtract(this.corners[1])
                ];
                color_function = (i: number, j: number, k: number) => (k);
            }
            else if (this.tesselation_type === 'type10') {
                polygons_count = 2;
                horizontal_vector = this.corners[2].subtract(this.corners[0]);
                vertical_vector = this.corners[4].subtract(this.corners[1]).add(new Vector2(-(this.corners[3].x - this.corners[2].x), this.corners[3].y - this.corners[2].y));
                rotate_flip_center = this.corners[1];
                rotation_angles = [0, Math.PI];
                flip_x = [false, true];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[5].subtract(this.corners[1])
                ];
                color_function = (i: number, j: number, k: number) => ((((i + k) % 3) + 3) % 3);
            }
            else if (this.tesselation_type === 'type11') {
                polygons_count = 2;
                horizontal_vector = this.corners[3].subtract(this.corners[0]).add(new Vector2(this.corners[2].x - this.corners[1].x, -(this.corners[2].y - this.corners[1].y)));
                vertical_vector = this.corners[4].subtract(this.corners[2]);
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI];
                flip_x = [false, true];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[5].subtract(this.corners[0])
                ];
                color_function = (i: number, j: number, k: number) => ((((j*2 + k) % 3) + 3) % 3);
            }
            else if (this.tesselation_type === 'type12') {
                polygons_count = 3;
                horizontal_vector = this.corners[2].subtract(this.corners[0]);
                vertical_vector = this.corners[3].subtract(this.corners[0]).add(this.corners[3]).subtract(this.corners[1]);
                rotate_flip_center = this.corners[1];
                rotation_angles = [0, 2 / 3 * Math.PI, 4 / 3 * Math.PI];

                color_function = (i: number, j: number, k: number) => (k);
            }
            else if (this.tesselation_type === 'type13') {
                polygons_count = 3;
                horizontal_vector = this.corners[3].subtract(this.corners[0]).add(this.corners[0].subtract(this.corners[5]).rotate(2 / 3 * Math.PI));
                vertical_vector = this.corners[4].subtract(this.corners[1]).add(this.corners[5].subtract(this.corners[4]).rotate(4 / 3 * Math.PI));
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, 2 / 3 * Math.PI, 4 / 3 * Math.PI];

                color_function = (i: number, j: number, k: number) => (k);
            }
            else if (this.tesselation_type === 'type14') {
                polygons_count = 4;
                horizontal_vector = this.corners[2].subtract(this.corners[1]);
                vertical_vector = new Vector2(0, 2 * (this.corners[1].y - this.corners[0].y));
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, 0.5 * Math.PI, Math.PI, 1.5 * Math.PI];
                
                color_function = (i: number, j: number, k: number) => ((((i + j + k) % 2) + 2) % 2);
            }
            else if (this.tesselation_type === 'type15') {
                polygons_count = 4;
                horizontal_vector = this.corners[1].subtract(this.corners[0]).scale(2);
                vertical_vector = this.corners[3].subtract(this.corners[0]).scale(2);
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, 0.5 * Math.PI, Math.PI, 1.5 * Math.PI];
                
                color_function = (i: number, j: number, k: number) => (k % 2);
            }
            else if (this.tesselation_type === 'type16') {
                polygons_count = 4;
                horizontal_vector = this.corners[1].subtract(this.corners[4]).add(this.corners[2].subtract(this.corners[1]).rotate(1.5 * Math.PI)).add(this.corners[3].subtract(this.corners[4]).rotate(1.5 * Math.PI));
                vertical_vector = this.corners[1].subtract(this.corners[0]).add(this.corners[2].subtract(this.corners[1]).rotate(1.5 * Math.PI)).add(this.corners[2].subtract(this.corners[3]).rotate(0.5 * Math.PI));
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, 0.5 * Math.PI, Math.PI, 1.5 * Math.PI];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[3].subtract(this.corners[0]),
                    this.corners[3].subtract(this.corners[0]).scale(2).add(this.corners[2]).subtract(this.corners[3]),
                    this.corners[2].subtract(this.corners[0])
                ];

                color_function = (i: number, j: number, k: number) => {
                    if (k === 0) return (((0 + i) % 3) + 3) % 3;
                    if (k === 1 || k === 3) return (((1 + i) % 3) + 3) % 3;
                    if (k === 2) return (((2 + i) % 3) + 3) % 3;
                };
            }
            else if (this.tesselation_type === 'type17') {
                polygons_count = 4;
                horizontal_vector = new Vector2(2 * (this.corners[0].x - this.corners[1].x), 0);
                vertical_vector = this.corners[1].subtract(this.corners[2]);
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI, 0, Math.PI];
                flip_x = [false, true, true, false];
                
                translations = [
                    new Vector2(0, 0),
                    this.corners[2].subtract(this.corners[0]),
                    this.corners[0].subtract(this.corners[1]),
                    new Vector2(0, 0)
                ]

                color_function = (i: number, j: number, k: number) => (k % 2);
            }
            else if (this.tesselation_type === 'type18') {
                polygons_count = 4;
                horizontal_vector = new Vector2(2 * (this.corners[2].x - this.corners[0].x), 0);
                vertical_vector = this.corners[3].subtract(this.corners[1]);
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI, 0, Math.PI];
                flip_x = [false, true, true, false];

                translations = [
                    new Vector2(0, 0),
                    this.corners[3].subtract(this.corners[0]),
                    new Vector2(this.corners[0].x - this.corners[2].x, -(this.corners[0].y - this.corners[2].y)),
                    new Vector2(this.corners[1].x - this.corners[2].x, -(this.corners[1].y - this.corners[2].y)),
                ]

                color_function = (i: number, j: number, k: number) => (k % 2);
            }
            else if (this.tesselation_type === 'type19') {
                polygons_count = 4;
                horizontal_vector = new Vector2(2 * (this.corners[1].x - this.corners[0].x), 0);
                vertical_vector = new Vector2(0, this.corners[1].y - this.corners[2].y + this.corners[0].y - this.corners[3].y);
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI, 0, Math.PI];
                flip_x = [false, true, true, false];

                translations = [
                    new Vector2(0, 0),
                    this.corners[1].subtract(this.corners[0]).add(new Vector2(-this.corners[0].x + this.corners[3].x, this.corners[0].y - this.corners[3].y)),
                    new Vector2(this.corners[0].x - this.corners[1].x, this.corners[1].y - this.corners[0].y),
                    this.corners[3].subtract(this.corners[0])
                ]

                color_function = (i: number, j: number, k: number) => (k % 2);
            }
            else if (this.tesselation_type === 'type20') {
                polygons_count = 4;
                horizontal_vector = this.corners[0].subtract(this.corners[1]).scale(2);
                vertical_vector = this.corners[0].subtract(this.corners[3]).scale(2);
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI, Math.PI, 0];
                flip_x = [false, true, false, true];

                translations = [
                    new Vector2(0, 0),
                    this.corners[1].subtract(this.corners[3]),
                    new Vector2(0, 0),
                    this.corners[3].subtract(this.corners[1]),
                ]

                color_function = (i: number, j: number, k: number) => (k % 2);
            }
            else if (this.tesselation_type === 'type21') {
                polygons_count = 4;
                horizontal_vector = this.corners[1].subtract(this.corners[2]);
                vertical_vector = new Vector2(0, 4 * (this.corners[1].y - this.corners[0].y) + 2 * (this.corners[0].y - this.corners[4].y));
                rotate_flip_center = this.corners[1];
                rotation_angles = [0, 0, Math.PI, Math.PI];
                flip_x = [false, true, true, false];

                translations = [
                    new Vector2(0, 0),
                    this.corners[4].subtract(this.corners[3]).add(new Vector2(0, 2 * (this.corners[0].y - this.corners[1].y))),
                    new Vector2(this.corners[3].x - this.corners[4].x, this.corners[4].y - this.corners[1].y + this.corners[0].y - this.corners[1].y),
                    this.corners[2].subtract(this.corners[1]),
                ]

                color_function = (i: number, j: number, k: number) => {
                    i = (((i % 3) + 3) % 3);
                    if (k === 0) return (i + k) % 3;
                    if (k === 1) return (i + k + 1) % 3;
                    return (i + k + 2) % 3;
                };
            }
            else if (this.tesselation_type === 'type22') {
                polygons_count = 4;
                horizontal_vector = this.corners[0].subtract(this.corners[3]).add(this.corners[5]).subtract(this.corners[4]).multiply(new Vector2(2, 0));
                vertical_vector = this.corners[4].subtract(this.corners[2]);
                rotate_flip_center = this.corners[0];
                rotation_angles = [Math.PI, 0, Math.PI, 0];
                flip_x = [false, false, true, true];

                translations = [
                    this.corners[3].subtract(this.corners[0]).scale(2).add(this.corners[2]).subtract(this.corners[3]),
                    new Vector2(0, 0),
                    this.corners[1].subtract(this.corners[0]),
                    this.corners[0].subtract(this.corners[3]).add(this.corners[5]).subtract(this.corners[4]).multiply(new Vector2(1, -1))
                ]

                color_function = (i: number, j: number, k: number) => {
                    j = ((j % 3) + 3) % 3;
                    if (j === 0) return k % 2;
                    if (j === 1) return ((k % 2) + 2) % 3;
                    else return ((k % 2) + 1) % 3;
                };
            }
            else if (this.tesselation_type === 'type23') {
                polygons_count = 4;
                horizontal_vector = this.corners[1].subtract(this.corners[4]).scale(2);
                vertical_vector = this.corners[1].subtract(this.corners[0]).add(this.corners[2].subtract(this.corners[4]).transpose());
                
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, Math.PI, 0.5 * Math.PI, 1.5 * Math.PI];
                flip_x = [false, false, true, true];

                translations = [
                    new Vector2(0, 0),
                    this.corners[2].subtract(this.corners[0]).add(this.corners[3]).subtract(this.corners[0]),
                    this.corners[4].subtract(this.corners[0]).add(this.corners[1].subtract(this.corners[0]).transpose()),
                    this.corners[1].subtract(this.corners[0]).add(this.corners[0].subtract(this.corners[4]).transpose()),
                ]

                color_function = (i: number, j: number, k: number) => {
                    i = ((-i % 3) + 3) % 3;
                    if (k === 0) return (k + i) % 3;
                    if (k === 1) return (k + i) % 3;
                    return (2 + i) % 3;
                };
            }
            else if (this.tesselation_type === 'type24') {
                polygons_count = 4;
                horizontal_vector = new Vector2(this.corners[0].x - this.corners[3].x + this.corners[5].x - this.corners[4].x, 0);
                vertical_vector = new Vector2(0, this.corners[1].y - this.corners[5].y + this.corners[2].y - this.corners[4].y);
                
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, 0, Math.PI, Math.PI];
                flip_x = [false, true, true, false];

                translations = [
                    new Vector2(0, 0),
                    this.corners[1].subtract(this.corners[0]).add(this.corners[0].subtract(this.corners[3]).multiply(new Vector2(1, -1))),
                    this.corners[3].subtract(this.corners[0]).add(this.corners[1].subtract(this.corners[5]).multiply(new Vector2(-1, 1))),
                    new Vector2(this.corners[5].x - this.corners[0].x, this.corners[2].y - this.corners[4].y + this.corners[1].y - this.corners[0].y),
                ];

                color_function = (i: number, j: number, k: number) => {
                    return (((k + j) % 3) + 3) % 3;
                };
            }
            else if (this.tesselation_type === 'type25') {
                polygons_count = 6;
                horizontal_vector = this.corners[2].subtract(this.corners[1]).add(this.corners[0]).subtract(this.corners[1]);
                vertical_vector = this.corners[0].subtract(this.corners[2]).add(this.corners[0]).subtract(this.corners[1]);
                
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, 1/3*Math.PI, 2/3*Math.PI, 3/3*Math.PI, 4/3*Math.PI, 5/3*Math.PI];
                flip_x = [false, false, false, false, false, false];

                color_function = (i: number, j: number, k: number) => {
                    return k % 2;
                };
            }
            else if (this.tesselation_type === 'type26') {
                polygons_count = 6;
                horizontal_vector = this.corners[1].subtract(this.corners[2]);
                vertical_vector = this.corners[2].subtract(this.corners[1]).rotate(2/3 * Math.PI);
                
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, 2/3*Math.PI, 4/3*Math.PI, 1/3*Math.PI, Math.PI, 5/3*Math.PI];

                const vec = new Vector2(0, 2 * (this.corners[0].y - this.corners[1].y));
                translations = [
                    new Vector2(0, 0),
                    new Vector2(0, 0),
                    new Vector2(0, 0),
                    vec.rotate(1/3 * Math.PI),
                    vec.rotate(Math.PI),
                    vec.rotate(5/3 * Math.PI)
                ];

                color_function = (i: number, j: number, k: number) => {
                    return (((2*i + 1*j + k) % 3) + 3) % 3;
                };
            }
            else if (this.tesselation_type === 'type27') {
                polygons_count = 6;
                horizontal_vector = this.corners[0].subtract(this.corners[1]).rotate(1/3 * Math.PI).scale(2);
                vertical_vector = this.corners[0].subtract(this.corners[1]).rotate(2/3 * Math.PI).scale(2);
                
                rotate_flip_center = this.corners[1];
                rotation_angles = [0, 1/3*Math.PI, 2/3*Math.PI, Math.PI, 4/3*Math.PI, 5/3*Math.PI];

                color_function = (i: number, j: number, k: number) => k % 3;
            }
            else if (this.tesselation_type === 'type28') {
                polygons_count = 6;
                horizontal_vector = this.corners[4].subtract(this.corners[0]).rotate(1/3 * Math.PI).scale(2).add(this.corners[2].subtract(this.corners[1]).rotate(2/3 * Math.PI));
                vertical_vector = horizontal_vector.rotate(4/6 * Math.PI);
                
                rotate_flip_center = this.corners[0];
                rotation_angles = [0, 1/3*Math.PI, 2/3*Math.PI, Math.PI, 4/3*Math.PI, 5/3*Math.PI];

                color_function = (i: number, j: number, k: number) => {
                    return ((((k % 2) + i + j) % 3) + 3) % 3;
                }
            }

            const polygon: Array<Vector2> = this.create_polygon();
            const polygons: Array<Array<Vector2>> = [];

            rotate_flip_center = rotate_flip_center.add(this.pan);

            for (let i = 0; i < polygons_count; i++) {
                const rotated = this.rotate_polygon(polygon, rotation_angles[i], rotate_flip_center);
                let flipped = rotated;
                if (flip_x[i]) {
                    flipped = this.flip_polygon_x(rotated, rotate_flip_center);
                }
                const rotated_translated = this.translate_polygon(flipped, translations[i]);
                polygons.push(rotated_translated);
            }
            
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const scale: Vector2 = horizontal_vector.scale(i).add(vertical_vector.scale(j));
                    for (let k = 0; k < polygons.length; k++) {
                        canvas_handler.draw_shape(colors[color_function(i, j, k)], polygons[k], scale, true);
                    }
                }
            }

            let top: number = Infinity;
            let bottom: number = -Infinity;
            let left: number = Infinity;
            let right: number = -Infinity;
            for (const { x, y } of polygon) {
                top = Math.min(top, y);
                bottom = Math.max(bottom, y);
                left = Math.min(left, x);
                right = Math.max(right, x);
            }
            const box = [
                new Vector2(left, top),
                new Vector2(right, top),
                new Vector2(right, bottom),
                new Vector2(left, bottom),
                new Vector2(left, top),
            ];
            // canvas_handler.draw_shape('black', box, false);
        }
    }
}