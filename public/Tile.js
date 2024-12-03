import { Line } from './Line.js';
import { Vector2 } from './Vector2.js';
import { TileConfigurations } from './ShapeConfiguration.js';
export class Tile {
    constructor(tile_type) {
        this.lines = [];
        this.corners = [];
        this.configurations = new TileConfigurations();
        this.tesselation_type = null;
        this.line_relationships = {};
        this.tile_type = tile_type;
        this.tesselation_pattern = null;
        const config = this.configurations.getConfig(this.tile_type);
        if (config !== null) {
            this.create_corners(config['shape type'], config['sides'], config['angle']);
            this.tesselation_pattern = config['symmetry'];
            this.point_relationships = config['point_relationships'];
            this.point_special_settings = config['point_special_settings'];
            this.line_relationships = config['line_relationships'];
            this.tesselation_type = config['tesselation type'];
            this.create_lines();
        }
        else {
            console.error(`Failed to retrieve value ${this.tile_type} from configurations.`);
        }
        this.selected_new_point = null;
        this.selected_section_index = null;
        this.selected_line_index = null;
        this.selected_existing_point_index = null;
    }
    create_corners(shape_type, corner_count, angle) {
        this.corners = [];
        if (shape_type === 'regular') {
            for (let i = angle; i < 360 + angle; i += 360 / corner_count) {
                let x = 350 + 100 * Math.cos(Math.PI * i / 180);
                let y = 350 + 100 * Math.sin(Math.PI * i / 180);
                this.corners.push(new Vector2(x, y));
            }
        }
        else if (shape_type === 'pentagon1') {
            this.corners.push(new Vector2(350 + 100, 350 + 0));
            this.corners.push(new Vector2(350 + 100, 350 + 100));
            this.corners.push(new Vector2(350 - 100, 350 + 100));
            this.corners.push(new Vector2(350 - 100, 350 + 0));
            this.corners.push(new Vector2(350 + 0, 350 - 100));
        }
        else if (shape_type === 'kite') {
            this.corners.push(new Vector2(350 + 100, 350 + 0));
            this.corners.push(new Vector2(350 + 0, 350 + 200));
            this.corners.push(new Vector2(350 - 100, 350 + 0));
            this.corners.push(new Vector2(350 + 0, 350 - 100));
        }
        else if (shape_type === 'rhombus') {
            this.corners.push(new Vector2(400 + 100, 350));
            this.corners.push(new Vector2(400 + 100 * Math.cos(Math.PI * 120 / 180), 350 + 100 * Math.sin(Math.PI * 120 / 180)));
            this.corners.push(new Vector2(400 - 200, 350));
            this.corners.push(new Vector2(400 + 100 * Math.cos(Math.PI * 240 / 180), 350 + 100 * Math.sin(Math.PI * 240 / 180)));
        }
        else if (shape_type === '4-way-triangle') {
            this.corners.push(new Vector2(350 + 0, 350 + 0));
            this.corners.push(new Vector2(350 + 200 * Math.cos(Math.PI * 0.25), 350 + 200 * Math.sin(Math.PI * 0.25)));
            this.corners.push(new Vector2(350 + 200 * Math.cos(Math.PI * 0.75), 350 + 200 * Math.sin(Math.PI * 0.75)));
        }
        else if (shape_type === 'pentagon 4-way') {
            let edge_length = 100;
            this.corners.push(new Vector2(350, 350));
            let edge = new Vector2(edge_length, 0);
            this.corners.push(this.corners[0].add(edge.rotate(Math.PI / 6)));
            this.corners.push(this.corners[1].add(edge.rotate(2 * Math.PI / 3)));
            this.corners.push(new Vector2(this.corners[2].x - edge_length * (Math.sqrt(3) - 1), this.corners[2].y));
            this.corners.push(this.corners[3].add(edge.rotate(4 * Math.PI / 3)));
        }
    }
    create_lines() {
        this.lines = [];
        for (let i = 0; i < this.corners.length; i++) {
            const p1 = this.corners[i];
            const p2 = this.corners[(i + 1) % this.corners.length];
            this.lines.push(new Line(p1, p2));
        }
    }
    get_action() {
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
    update(mouse_pos, thresh) {
        this.selected_new_point = null;
        this.selected_section_index = null;
        this.selected_line_index = null;
        this.selected_existing_point_index = null;
        this.find_user_existing_point(mouse_pos, thresh);
        if (this.selected_existing_point_index === null) {
            this.find_user_new_point(mouse_pos, thresh);
        }
    }
    find_user_existing_point(mouse_pos, thresh) {
        if (mouse_pos !== null) {
            let min_control_point_distance = thresh;
            for (let curr_line_index = 0; curr_line_index < this.lines.length; curr_line_index++) {
                const line = this.lines[curr_line_index];
                for (let curr_point_index = 0; curr_point_index < line.points.length; curr_point_index++) {
                    const point = line.points[curr_point_index];
                    let distance = point.pos.subtract(mouse_pos).magnitude();
                    if (distance < min_control_point_distance) {
                        this.selected_line_index = curr_line_index;
                        this.selected_existing_point_index = curr_point_index;
                    }
                }
            }
        }
    }
    find_user_new_point(mouse_pos, thresh) {
        if (mouse_pos !== null) {
            let min_distance = thresh;
            for (let curr_line_index = 0; curr_line_index < this.lines.length; curr_line_index++) {
                const line = this.lines[curr_line_index];
                const spline_points = line.get_spline_points();
                for (let spline_section_index = 0; spline_section_index < spline_points.length; spline_section_index++) {
                    const spline_subsection = spline_points[spline_section_index];
                    for (let k = 0; k < spline_subsection.length - 1; k++) {
                        let [distance, point] = Line.closest_point(mouse_pos, spline_subsection[k], spline_subsection[k + 1], min_distance);
                        if (distance < min_distance) {
                            min_distance = distance;
                            this.selected_new_point = point;
                            this.selected_line_index = curr_line_index;
                            this.selected_section_index = spline_section_index + 1;
                        }
                    }
                }
            }
        }
    }
    is_corner_selected() {
        if (this.selected_line_index !== null) {
            return this.selected_existing_point_index === 0 || this.selected_existing_point_index === this.lines[this.selected_line_index].points.length - 1;
        }
        else {
            return false;
        }
    }
    get_settings(relationship_type) {
        const settings = {};
        const input_settings = relationship_type.split(' ');
        for (let i = 1; i < input_settings.length; i++) {
            const parameter = input_settings[i].split(':')[0];
            const setting = input_settings[i].split(':')[1];
            settings[parameter] = setting;
        }
        return settings;
    }
    rotated4_helper(relationship_type, relationship_line, input_point) {
        if (this.selected_line_index !== null && (this.selected_existing_point_index !== null || this.selected_section_index !== null)) {
            const line = this.lines[this.selected_line_index];
            let point_or_section_index = (this.selected_existing_point_index !== null) ? this.selected_existing_point_index : this.selected_section_index;
            let settings = this.get_settings(relationship_type);
            const line_1_direction = line.points[line.points.length - 1].pos.subtract(line.points[0].pos);
            const line_2_direction = relationship_line.points[relationship_line.points.length - 1].pos.subtract(relationship_line.points[0].pos);
            let absolute_offset = input_point.subtract(line.points[0].pos);
            if (+settings['mirror'] === 1) {
                const angle2 = absolute_offset.angle_to(line_1_direction);
                absolute_offset = absolute_offset.rotate(2 * angle2);
            }
            const angle = line_1_direction.angle_to(line_2_direction);
            absolute_offset = absolute_offset.rotate(angle);
            absolute_offset = new Vector2(+settings['reflect_x'] * absolute_offset.x, +settings['reflect_y'] * absolute_offset.y);
            let relationship_point_index = point_or_section_index;
            let base_point_index = 0;
            if (+settings['start_end'] === 1) {
                relationship_point_index = relationship_line.points.length - point_or_section_index;
                if (this.selected_section_index === null) {
                    relationship_point_index -= 1;
                }
                base_point_index = relationship_line.points.length - 1;
            }
            let new_pos = relationship_line.points[base_point_index].pos.add(absolute_offset);
            return [relationship_point_index, new_pos];
        }
        else {
            console.error(`rotated4 helper encountered an error.`);
            return [-1, new Vector2(0, 0)];
        }
    }
    create_point(option) {
        if (this.selected_line_index !== null && this.selected_new_point !== null && this.selected_section_index !== null) {
            const line = this.lines[this.selected_line_index];
            const offset = this.selected_new_point.subtract(line.points[0].pos);
            let overwrite_val = null;
            const line_relationships = this.line_relationships[this.selected_line_index];
            for (let i = 0; i < line_relationships.length; i++) {
                const [relationship_line_index, relationship_type] = line_relationships[i];
                const relationship_line = this.lines[relationship_line_index];
                if (relationship_type.includes('rotated4')) {
                    const [relationship_point_index, new_pos] = this.rotated4_helper(relationship_type, relationship_line, this.selected_new_point);
                    if (relationship_point_index !== -1) {
                        relationship_line.insert_point(relationship_point_index, new_pos, option);
                    }
                }
                else if (relationship_type === 'self_mirrored') {
                    let p1 = line.points[0].pos.add(offset);
                    let p2 = line.points[line.points.length - 1].pos.add(new Vector2(-offset.x, offset.y));
                    const corresponding_index = line.points.length - this.selected_section_index;
                    if (this.selected_section_index === corresponding_index) {
                        if (p1.subtract(line.points[0].pos).magnitude() < p2.subtract(line.points[0].pos).magnitude()) {
                            line.insert_point(this.selected_section_index, p1, option);
                            line.insert_point(this.selected_section_index + 1, p2, option);
                        }
                        else {
                            line.insert_point(this.selected_section_index, p2, option);
                            line.insert_point(this.selected_section_index + 1, p1, option);
                            overwrite_val = this.selected_section_index + 1;
                        }
                    }
                    else {
                        if (this.selected_section_index > corresponding_index) {
                            line.insert_point(this.selected_section_index, p1, option);
                            line.insert_point(corresponding_index, p2, option);
                            overwrite_val = this.selected_section_index + 1;
                        }
                        else {
                            line.insert_point(corresponding_index, p2, option);
                            line.insert_point(this.selected_section_index, p1, option);
                        }
                    }
                }
                else if (relationship_type === 'mirrored_translated') {
                    let p1 = relationship_line.points[relationship_line.points.length - 1].pos.add(offset);
                    let p2 = relationship_line.points[0].pos.add(new Vector2(-offset.x, offset.y));
                    let corresponding_index = relationship_line.points.length - this.selected_section_index;
                    if (this.selected_section_index === corresponding_index) {
                        if (p1.subtract(relationship_line.points[0].pos).magnitude() < p2.subtract(relationship_line.points[0].pos).magnitude()) {
                            relationship_line.insert_point(this.selected_section_index, p1, option);
                            relationship_line.insert_point(corresponding_index + 1, p2, option);
                        }
                        else {
                            relationship_line.insert_point(this.selected_section_index, p2, option);
                            relationship_line.insert_point(corresponding_index + 1, p1, option);
                        }
                    }
                    else {
                        if (this.selected_section_index > corresponding_index) {
                            relationship_line.insert_point(this.selected_section_index, p2, option);
                            relationship_line.insert_point(corresponding_index, p1, option);
                        }
                        else {
                            relationship_line.insert_point(corresponding_index, p1, option);
                            relationship_line.insert_point(this.selected_section_index, p2, option);
                        }
                    }
                }
                else if (relationship_type === 'translated_flip_rotate') {
                    let p1 = relationship_line.points[relationship_line.points.length - 1].pos.add(new Vector2(-offset.x, offset.y));
                    let p2 = relationship_line.points[0].pos.add(new Vector2(offset.x, -offset.y));
                    let corresponding_index = relationship_line.points.length - this.selected_section_index;
                    if (this.selected_section_index === corresponding_index) {
                        if (p1.subtract(relationship_line.points[0].pos).magnitude() < p2.subtract(relationship_line.points[0].pos).magnitude()) {
                            relationship_line.insert_point(this.selected_section_index, p1, option);
                            relationship_line.insert_point(corresponding_index + 1, p2, option);
                        }
                        else {
                            relationship_line.insert_point(this.selected_section_index, p2, option);
                            relationship_line.insert_point(corresponding_index + 1, p1, option);
                        }
                    }
                    else {
                        if (this.selected_section_index > corresponding_index) {
                            relationship_line.insert_point(this.selected_section_index, p2, option);
                            relationship_line.insert_point(corresponding_index, p1, option);
                        }
                        else {
                            relationship_line.insert_point(corresponding_index, p1, option);
                            relationship_line.insert_point(this.selected_section_index, p2, option);
                        }
                    }
                }
                else if (relationship_type === 'flip_rotate') {
                    let p1 = line.points[0].pos.add(offset);
                    let p2 = line.points[line.points.length - 1].pos.add(new Vector2(-offset.x, -offset.y));
                    const corresponding_index = line.points.length - this.selected_section_index;
                    if (this.selected_section_index === corresponding_index) {
                        if (p1.subtract(line.points[0].pos).magnitude() < p2.subtract(line.points[0].pos).magnitude()) {
                            line.insert_point(this.selected_section_index, p1, option);
                            line.insert_point(this.selected_section_index + 1, p2, option);
                        }
                        else {
                            line.insert_point(this.selected_section_index, p2, option);
                            line.insert_point(this.selected_section_index + 1, p1, option);
                            overwrite_val = this.selected_section_index + 1;
                        }
                    }
                    else {
                        if (this.selected_section_index > corresponding_index) {
                            line.insert_point(this.selected_section_index, p1, option);
                            line.insert_point(corresponding_index, p2, option);
                            overwrite_val = this.selected_section_index + 1;
                        }
                        else {
                            line.insert_point(corresponding_index, p2, option);
                            line.insert_point(this.selected_section_index, p1, option);
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
    move_point(mouse_pos) {
        if (this.selected_line_index !== null && this.selected_existing_point_index !== null && mouse_pos !== null) {
            const line = this.lines[this.selected_line_index];
            const selected_point = line.points[this.selected_existing_point_index].pos;
            const offset = mouse_pos.subtract(selected_point);
            const line_relationships = this.line_relationships[this.selected_line_index];
            this.lines[this.selected_line_index].move_point(this.selected_existing_point_index, offset);
            for (let i = 0; i < line_relationships.length; i++) {
                const [relationship_line_index, relationship_type] = this.line_relationships[this.selected_line_index][i];
                const relationship_line = this.lines[relationship_line_index];
                const relationship_point_index = relationship_line.points.length - this.selected_existing_point_index - 1;
                if (relationship_type.includes('rotated4')) {
                    const [relationship_point_index, new_pos] = this.rotated4_helper(relationship_type, relationship_line, mouse_pos);
                    if (relationship_point_index !== -1) {
                        relationship_line.move_point2(relationship_point_index, new_pos);
                    }
                }
                else if (relationship_type === 'self_mirrored') {
                    relationship_line.move_point(relationship_point_index, new Vector2(-offset.x, offset.y));
                }
                else if (relationship_type === 'mirrored_translated') {
                    const mirror_index = relationship_line.points.length - relationship_point_index - 1;
                    relationship_line.move_point(relationship_point_index, offset);
                    relationship_line.move_point(mirror_index, new Vector2(-offset.x, offset.y));
                }
                else if (relationship_type === 'translated_flip_rotate') {
                    const mirror_index = relationship_line.points.length - relationship_point_index - 1;
                    relationship_line.move_point(relationship_point_index, new Vector2(-offset.x, offset.y));
                    relationship_line.move_point(mirror_index, new Vector2(offset.x, -offset.y));
                }
                else if (relationship_type === 'flip_rotate') {
                    line.move_point(relationship_point_index, new Vector2(-offset.x, -offset.y));
                }
            }
        }
    }
    delete_point() {
        if (this.selected_line_index !== null && this.selected_existing_point_index !== null) {
            const line_relationships = this.line_relationships[this.selected_line_index];
            for (let i = 0; i < line_relationships.length; i++) {
                const [relationship_line_index, relationship_type] = this.line_relationships[this.selected_line_index][i];
                if (relationship_type.includes('rotated4')) {
                    let settings = this.get_settings(relationship_type);
                    let relationship_point_index = this.selected_existing_point_index;
                    if (+settings['start_end'] === 1) {
                        relationship_point_index = this.lines[relationship_line_index].points.length - this.selected_existing_point_index - 1;
                    }
                    this.lines[relationship_line_index].delete_point(relationship_point_index);
                }
                else if (relationship_type === 'self_mirrored' || relationship_type === 'flip_rotate') {
                    const relationship_point_index = this.lines[this.selected_line_index].points.length - 1 - this.selected_existing_point_index;
                    const indexes = (relationship_point_index > this.selected_existing_point_index) ? [relationship_point_index, this.selected_existing_point_index] : [this.selected_existing_point_index, relationship_point_index];
                    this.lines[this.selected_line_index].delete_point(indexes[0]);
                    this.lines[this.selected_line_index].delete_point(indexes[1]);
                }
                else if (relationship_type === 'mirrored_translated' || relationship_type === 'translated_flip_rotate') {
                    const relationship_point_index = this.lines[relationship_line_index].points.length - 1 - this.selected_existing_point_index;
                    const indexes = (relationship_point_index > this.selected_existing_point_index) ? [relationship_point_index, this.selected_existing_point_index] : [this.selected_existing_point_index, relationship_point_index];
                    this.lines[relationship_line_index].delete_point(indexes[0]);
                    this.lines[relationship_line_index].delete_point(indexes[1]);
                }
            }
        }
    }
    move_corner(mouse_pos) {
        if (this.selected_line_index === null || this.selected_existing_point_index === null || mouse_pos === null) {
            return;
        }
        const line = this.lines[this.selected_line_index];
        const selected_corner = line.points[this.selected_existing_point_index].pos;
        const offset = mouse_pos.subtract(selected_corner);
        let selected_corner_index = null;
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
                    this.corners[selected_corner_index].copy(mouse_pos);
                    const magnitude_1 = this.corners[selected_corner_index + 1].subtract(this.corners[selected_corner_index]);
                    const magnitude_rotated_1 = magnitude_1.rotate(2 / 3 * Math.PI);
                    this.corners[fwd_5].copy(this.corners[selected_corner_index].add(magnitude_rotated_1));
                    const magnitude_2 = this.corners[fwd_5].subtract(this.corners[fwd_4]);
                    const magnitude_rotated_2 = magnitude_2.rotate(2 / 3 * Math.PI);
                    this.corners[fwd_3].copy(this.corners[fwd_4].add(magnitude_rotated_2));
                    this.corners[fwd_2].copy(this.corners[fwd_2].add(offset.rotate(1 / 3 * Math.PI)));
                }
                if ([1, 3, 5].includes(selected_corner_index)) {
                    this.corners[selected_corner_index].copy(mouse_pos);
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
                let numbers = [];
                if (selected_corner_index === 0)
                    numbers = [0, 1, 0, 2, 1, 4, 0, 3, 4];
                if (selected_corner_index === 1)
                    numbers = [1, 1, 0, 2, 1];
                if (selected_corner_index === 2)
                    numbers = [2, 2, 1, 0, 1, 4, 0, 3, 4];
                if (selected_corner_index === 3)
                    numbers = [3, 4, 3, 0, 4, 0, 1, 2, 1];
                if (selected_corner_index === 4)
                    numbers = [4, 0, 4, 3, 4];
                const [a, b, c, d, e, f, g, h, i] = numbers;
                this.corners[a].copy(mouse_pos);
                const magnitude_1 = this.corners[b].subtract(this.corners[c]);
                const magnitude_rotated_1 = magnitude_1.rotate(0.5 * Math.PI);
                this.corners[d].copy(this.corners[e].add(magnitude_rotated_1));
                if (f !== undefined) {
                    const magnitude_2 = this.corners[f].subtract(this.corners[g]);
                    const magnitude_rotated_2 = magnitude_2.rotate(1.5 * Math.PI);
                    this.corners[h].copy(this.corners[i].add(magnitude_rotated_2));
                }
            }
            else {
                const point_relationships = this.point_relationships[selected_corner_index];
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
    move_tile(mouse_pos, prev_mouse_pos) {
        if (mouse_pos !== null && prev_mouse_pos !== null) {
            const offset = mouse_pos.subtract(prev_mouse_pos);
            for (let i = 0; i < this.lines.length; i++) {
                const line = this.lines[i];
                for (let j = 1; j < line.points.length - 1; j++) {
                    const point = line.points[j].pos;
                    point.copy(point.add(offset));
                }
                const line_start = line.points[0].pos;
                const line_end = line.points[line.points.length - 1].pos;
                line_start.copy(line_start.add(offset.multiply(0.5)));
                line_end.copy(line_end.add(offset.multiply(0.5)));
            }
        }
    }
    create_polygon() {
        const polygon_points = [];
        for (const line of this.lines) {
            const spline_points = line.get_spline_points();
            let spline_points_flat = [];
            for (const section of spline_points) {
                spline_points_flat.push(...section);
            }
            polygon_points.push(...spline_points_flat);
        }
        return polygon_points;
    }
    transform_polygon(polygon, offset, flip_x, flip_y) {
        const new_polygon = [];
        let center = new Vector2(0, 0);
        for (const corner of this.corners) {
            center = center.add(corner);
        }
        center = center.multiply(1 / this.corners.length);
        for (const point of polygon) {
            let new_point = new Vector2(point.x, point.y);
            if (flip_x) {
                if (new_point.x < center.x) {
                    new_point.x = new_point.x + (2 * (center.x - new_point.x));
                }
                else {
                    new_point.x = new_point.x - (2 * (new_point.x - center.x));
                }
            }
            if (flip_y) {
                if (new_point.y < center.y) {
                    new_point.y = new_point.y + (2 * (center.y - new_point.y));
                }
                else {
                    new_point.y = new_point.y - (2 * (new_point.y - center.y));
                }
            }
            new_point = new_point.add(offset);
            new_polygon.push(new_point);
        }
        return new_polygon;
    }
    rotate_polygon(polygon, offset, angle = Math.PI, corner_index = null) {
        let center = new Vector2(0, 0);
        if (corner_index === null) {
            for (const corner of this.corners) {
                center = center.add(corner);
            }
            center = center.multiply(1 / this.corners.length);
        }
        else {
            center = this.corners[corner_index];
        }
        const new_polygon = [];
        for (const point of polygon) {
            new_polygon.push(point.subtract(center).rotate(angle).add(center).add(offset));
        }
        return new_polygon;
    }
    translate_polygon(polygon, offset) {
        const translated_polygon = [];
        for (let i = 0; i < polygon.length; i++) {
            translated_polygon.push(polygon[i].add(offset));
        }
        return translated_polygon;
    }
    get_center() {
        let center = new Vector2(0, 0);
        for (let point of this.corners) {
            center = center.add(point);
        }
        return center.multiply(1 / this.corners.length);
    }
    draw_tesselation(canvas_handler, offset, colors) {
        const [color_1, color_2, _] = colors;
        const polygon = this.create_polygon();
        if (this.tesselation_type === 'type1') {
            let horizontal_vector = this.corners[1].subtract(this.corners[0]);
            let vertical_vector = this.corners[2].subtract(this.corners[1]);
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    let new_polygon = [];
                    for (const point of polygon) {
                        const vertical_scale = vertical_vector.multiply(i);
                        const horizontal_scale = horizontal_vector.multiply(j);
                        const new_point = point.add(vertical_scale).add(horizontal_scale);
                        new_polygon.push(new_point);
                    }
                    const color = (i + j) % 2 ? color_1 : color_2;
                    canvas_handler.draw_polygon(color, new_polygon);
                }
            }
        }
        else if (this.tesselation_type === 'type2') {
            const vertical_vector = this.corners[1].subtract(this.corners[4]).add(this.corners[0]).subtract(this.corners[5]);
            const horizontal_vector = this.corners[0].subtract(this.corners[3]).add(this.corners[1]).subtract(this.corners[2]);
            const offset_vectors = [];
            offset_vectors.push(new Vector2(0, 0));
            offset_vectors.push(this.corners[0].subtract(this.corners[4]));
            offset_vectors.push(this.corners[2].subtract(this.corners[4]));
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    for (let k = 0; k < offset_vectors.length; k++) {
                        let new_polygon = [];
                        for (const point of polygon) {
                            const vertical_scale = vertical_vector.multiply(i);
                            const horizontal_scale = horizontal_vector.multiply(j);
                            const new_point = point.add(vertical_scale).add(horizontal_scale).add(offset_vectors[k]);
                            new_polygon.push(new_point);
                        }
                        canvas_handler.draw_polygon(colors[k], new_polygon);
                    }
                }
            }
        }
        else if (this.tesselation_type === 'type3') {
            let horizontal_vector = this.corners[1].subtract(this.corners[0]);
            let vertical_vector = this.corners[2].subtract(this.corners[1]);
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const vertical_scale = vertical_vector.multiply(i);
                    const horizontal_scale = horizontal_vector.multiply(j);
                    let new_polygon = [];
                    for (let k = 0; k < polygon.length; k++) {
                        new_polygon.push(polygon[k].add(vertical_scale).add(horizontal_scale));
                    }
                    const color = (i + j) % 2 ? color_1 : color_2;
                    if (j % 2 === 0) {
                        canvas_handler.draw_polygon(color, new_polygon);
                    }
                    else {
                        new_polygon = this.transform_polygon(new_polygon, new Vector2(0, 0), true, true);
                        canvas_handler.draw_polygon(color, new_polygon);
                    }
                }
            }
        }
        else if (this.tesselation_type === 'type4') {
            const flipped_point = this.transform_polygon([this.corners[0]], new Vector2(0, 0), true, true)[0];
            const flipped_offset = this.corners[this.corners.length - 1].subtract(flipped_point);
            const flipped_polygon = this.transform_polygon(polygon, flipped_offset, true, true);
            let horizontal_vector = this.corners[0].subtract(this.corners[1]);
            let vertical_vector = this.corners[1].subtract(this.corners[2]);
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const vertical_scale = vertical_vector.multiply(i);
                    const horizontal_scale = horizontal_vector.multiply(j);
                    let new_polygon = [];
                    let new_flipped = [];
                    for (let k = 0; k < polygon.length; k++) {
                        new_polygon.push(polygon[k].add(vertical_scale).add(horizontal_scale));
                        new_flipped.push(flipped_polygon[k].add(vertical_scale).add(horizontal_scale));
                    }
                    canvas_handler.draw_polygon(color_1, new_polygon);
                    canvas_handler.draw_polygon(color_2, new_flipped);
                }
            }
        }
        else if (this.tesselation_type === 'type5') {
            let horizontal_vector = this.corners[1].subtract(this.corners[2]);
            let vertical_vector = this.corners[3].subtract(this.corners[2]).multiply(2).add(this.corners[4].subtract(this.corners[0]));
            const flipped_point = this.transform_polygon([this.corners[0]], new Vector2(0, 0), true, true)[0];
            const flipped_offset = this.corners[this.corners.length - 1].subtract(flipped_point);
            const flipped_polygon = this.transform_polygon(polygon, flipped_offset, true, true);
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const vertical_scale = vertical_vector.multiply(i);
                    const horizontal_scale = horizontal_vector.multiply(j);
                    let new_polygon = [];
                    let new_flipped = [];
                    for (let k = 0; k < polygon.length; k++) {
                        new_polygon.push(polygon[k].add(vertical_scale).add(horizontal_scale));
                        new_flipped.push(flipped_polygon[k].add(vertical_scale).add(horizontal_scale));
                    }
                    const index = (((2 * i - 2 * j) % 3) + 3) % 3;
                    canvas_handler.draw_polygon(colors[index], new_polygon);
                    canvas_handler.draw_polygon(colors[(2 + index) % 3], new_flipped);
                }
            }
        }
        else if (this.tesselation_type === 'type6') {
            let diagonal_vector_1 = this.corners[0].subtract(this.corners[2]);
            let diagonal_vector_2 = this.corners[1].subtract(this.corners[3]);
            const flipped_point = this.transform_polygon([this.corners[0]], new Vector2(0, 0), true, true)[0];
            const flipped_offset = this.corners[this.corners.length - 1].subtract(flipped_point);
            const rotated_polygon = this.rotate_polygon(polygon, flipped_offset, Math.PI, null);
            for (let i = -offset; i < offset; i++) {
                const diagonal_scale = diagonal_vector_1.multiply(i);
                for (let j = -offset; j < offset; j++) {
                    const diagonal_scale_2 = diagonal_vector_2.multiply(j);
                    let new_polygon = [];
                    let new_flipped = [];
                    for (let k = 0; k < polygon.length; k++) {
                        new_polygon.push(polygon[k].add(diagonal_scale).add(diagonal_scale_2));
                        new_flipped.push(rotated_polygon[k].add(diagonal_scale).add(diagonal_scale_2));
                    }
                    canvas_handler.draw_polygon(color_1, new_polygon);
                    canvas_handler.draw_polygon(color_2, new_flipped);
                }
            }
        }
        else if (this.tesselation_type === 'type7') {
            const flipped_point = this.transform_polygon([this.corners[0]], new Vector2(0, 0), true, true)[0];
            const flipped_offset = this.corners[this.corners.length - 1].subtract(flipped_point);
            const rotated_polygon = this.rotate_polygon(polygon, flipped_offset, Math.PI, null);
            let horizontal_vector = this.corners[0].subtract(this.corners[3]).add(this.corners[1]).subtract(this.corners[2]);
            let vertical_vector = this.corners[1].subtract(this.corners[5]);
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const new_polygon = [];
                    let new_flipped = [];
                    let horizontal_scale = horizontal_vector.multiply(i);
                    let vertical_scale = vertical_vector.multiply(j);
                    for (let k = 0; k < polygon.length; k++) {
                        new_polygon.push(polygon[k].add(horizontal_scale).add(vertical_scale));
                        new_flipped.push(rotated_polygon[k].add(horizontal_scale).add(vertical_scale));
                    }
                    let index = ((j % 3) + 3) % 3;
                    canvas_handler.draw_polygon(colors[index], new_polygon);
                    canvas_handler.draw_polygon(colors[(index + 1) % 3], new_flipped);
                }
            }
        }
        else if (this.tesselation_type === 'type8') {
            let horizontal_vector = this.corners[1].subtract(this.corners[0]);
            let vertical_vector = this.corners[2].subtract(this.corners[1]);
            const flipped_point = this.transform_polygon([this.corners[0]], new Vector2(0, 0), true, false)[0];
            const flipped_offset = this.corners[1].subtract(flipped_point);
            const flipped_polygon = this.transform_polygon(polygon, flipped_offset.add(vertical_vector), true, false);
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const vertical_scale = new Vector2(0 * vertical_vector.x, 2 * i * vertical_vector.y);
                    const horizontal_scale = horizontal_vector.multiply(j);
                    let new_polygon = [];
                    let new_flipped_polygon = [];
                    for (let k = 0; k < polygon.length; k++) {
                        new_polygon.push(polygon[k].add(vertical_scale).add(horizontal_scale));
                        new_flipped_polygon.push(flipped_polygon[k].add(vertical_scale).add(horizontal_scale));
                    }
                    let [c1, c2] = (j % 2) ? [color_1, color_2] : [color_2, color_1];
                    canvas_handler.draw_polygon(c1, new_polygon);
                    canvas_handler.draw_polygon(c2, new_flipped_polygon);
                }
            }
        }
        else if (this.tesselation_type === 'type9') {
            let horizontal_vector = this.corners[2].subtract(this.corners[0]);
            let vertical_vector = this.corners[3].subtract(this.corners[1]);
            const flipped_point = this.transform_polygon([this.corners[0]], new Vector2(0, 0), false, true)[0];
            const flipped_offset = this.corners[1].subtract(flipped_point);
            const flipped_polygon = this.transform_polygon(polygon, flipped_offset, false, true);
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const vertical_scale = vertical_vector.multiply(i);
                    const horizontal_scale = horizontal_vector.multiply(j);
                    let new_polygon = [];
                    let new_flipped_polygon = [];
                    for (let k = 0; k < polygon.length; k++) {
                        new_polygon.push(polygon[k].add(vertical_scale).add(horizontal_scale));
                        new_flipped_polygon.push(flipped_polygon[k].add(vertical_scale).add(horizontal_scale));
                    }
                    canvas_handler.draw_polygon(color_1, new_polygon);
                    canvas_handler.draw_polygon(color_2, new_flipped_polygon);
                }
            }
        }
        else if (this.tesselation_type === 'type10') {
            let horizontal_vector = this.corners[2].subtract(this.corners[0]);
            let vertical_vector = this.corners[3].subtract(this.corners[1]);
            const flipped_point = this.transform_polygon([this.corners[0]], new Vector2(0, 0), true, false)[0];
            const flipped_offset = this.corners[3].subtract(flipped_point).add(this.corners[4]).subtract(this.corners[3]);
            const flipped_polygon = this.transform_polygon(polygon, flipped_offset, true, false);
            // let center_1 = this.get_center();
            // let center_2 = center_1.add(flipped_offset);
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const vertical_scale = new Vector2(0 * vertical_vector.x, 2 * i * vertical_vector.y);
                    const horizontal_scale = horizontal_vector.multiply(j);
                    let new_polygon = [];
                    let new_flipped_polygon = [];
                    for (let k = 0; k < polygon.length; k++) {
                        new_polygon.push(polygon[k].add(vertical_scale).add(horizontal_scale));
                        new_flipped_polygon.push(flipped_polygon[k].add(vertical_scale).add(horizontal_scale));
                    }
                    const curr_index = (((j % 3) + 3) % 3);
                    canvas_handler.draw_polygon(colors[curr_index], new_polygon);
                    canvas_handler.draw_polygon(colors[(curr_index + 1) % 3], new_flipped_polygon);
                    // let curr_center_1 = center_1.add(vertical_scale).add(horizontal_scale);
                    // canvas_handler.draw_text(`(${i},${j}) ${curr_index}`, curr_center_1.x, curr_center_1.y);
                    // let curr_center_2 = center_2.add(vertical_scale).add(horizontal_scale);
                    // canvas_handler.draw_text(`(${i},${j}) ${curr_index}`, curr_center_2.x, curr_center_2.y);
                }
            }
            // canvas_handler.draw_aalines('black', flipped_polygon);
        }
        else if (this.tesselation_type === 'type11') {
            let horizontal_vector = this.corners[0].subtract(this.corners[3]).add(this.corners[5]).subtract(this.corners[4]);
            let vertical_vector = this.corners[4].subtract(this.corners[2]);
            const flipped_point = this.transform_polygon([this.corners[0]], new Vector2(0, 0), true, false)[0];
            const flipped_offset = this.corners[1].subtract(flipped_point);
            const flipped_polygon = this.transform_polygon(polygon, flipped_offset, true, false);
            // canvas_handler.draw_polygon(color_1, polygon);
            // canvas_handler.draw_polygon(color_2, flipped_polygon);
            let center_1 = this.get_center();
            let center_2 = center_1.add(flipped_offset);
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const scale = new Vector2(j * horizontal_vector.x, i * vertical_vector.y);
                    let new_polygon = [];
                    let new_flipped_polygon = [];
                    for (let k = 0; k < polygon.length; k++) {
                        new_polygon.push(polygon[k].add(scale));
                        new_flipped_polygon.push(flipped_polygon[k].add(scale));
                    }
                    const curr_index = (((i % 3) + 3) % 3);
                    canvas_handler.draw_polygon(colors[curr_index], new_polygon);
                    // canvas_handler.draw_aalines('black', new_polygon);
                    canvas_handler.draw_polygon(colors[(curr_index + 1) % 3], new_flipped_polygon);
                    // canvas_handler.draw_aalines('black', new_flipped_polygon);
                    // let curr_center_1 = center_1.add(scale);
                    // canvas_handler.draw_text(`(${i},${j}) ${curr_index}`, curr_center_1.x, curr_center_1.y);
                    // let curr_center_2 = center_2.add(scale);
                    // canvas_handler.draw_text(`(${i},${j}) ${curr_index}`, curr_center_2.x, curr_center_2.y);
                }
            }
            // canvas_handler.draw_aalines('black', flipped_polygon);
        }
        else if (this.tesselation_type === 'type12') {
            let horizontal_vector = this.corners[0].subtract(this.corners[2]);
            let vertical_vector = this.corners[0].subtract(this.corners[3]).add(this.corners[1]).subtract(this.corners[3]);
            const polygons = [];
            polygons.push(polygon);
            polygons.push(this.rotate_polygon(polygon, new Vector2(0, 0), 2 * Math.PI / 3, 1));
            polygons.push(this.rotate_polygon(polygon, new Vector2(0, 0), 4 * Math.PI / 3, 1));
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const scale = horizontal_vector.multiply(i).add(vertical_vector.multiply(j));
                    let translated_polygons = [[], [], []];
                    for (let k = 0; k < polygon.length; k++) {
                        for (let a = 0; a < polygons.length; a++) {
                            translated_polygons[a].push(polygons[a][k].add(scale));
                        }
                    }
                    for (let a = 0; a < polygons.length; a++) {
                        canvas_handler.draw_polygon(colors[a], translated_polygons[a]);
                    }
                }
            }
        }
        else if (this.tesselation_type === 'type13') {
            let horizontal_vector = this.corners[0].subtract(this.corners[3]).add(this.corners[0].subtract(this.corners[1]).rotate(1 / 3 * Math.PI));
            let vertical_vector = this.corners[1].subtract(this.corners[4]).add(this.corners[4].subtract(this.corners[3]).rotate(2 / 3 * Math.PI));
            const polygons = [];
            polygons.push(polygon);
            polygons.push(this.rotate_polygon(polygon, new Vector2(0, 0), 2 * Math.PI / 3, 0));
            polygons.push(this.rotate_polygon(polygon, new Vector2(0, 0), 4 * Math.PI / 3, 0));
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const scale = horizontal_vector.multiply(i).add(vertical_vector.multiply(j));
                    let translated_polygons = [[], [], []];
                    for (let k = 0; k < polygon.length; k++) {
                        for (let a = 0; a < polygons.length; a++) {
                            translated_polygons[a].push(polygons[a][k].add(scale));
                        }
                    }
                    for (let a = 0; a < polygons.length; a++) {
                        canvas_handler.draw_polygon(colors[a], translated_polygons[a]);
                    }
                }
            }
        }
        else if (this.tesselation_type === 'type14') {
            let horizontal_vector = this.corners[1].subtract(this.corners[2]);
            let vertical_vector = new Vector2(0, 2 * (this.corners[1].y - this.corners[0].y));
            const polygons = [];
            for (let i = 0; i < 4; i++) {
                polygons.push(this.rotate_polygon(polygon, new Vector2(0, 0), Math.PI * (i / 2), 0));
            }
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const scale = horizontal_vector.multiply(i).add(vertical_vector.multiply(j));
                    let translated_polygons = [[], [], [], []];
                    for (let k = 0; k < polygon.length; k++) {
                        for (let a = 0; a < polygons.length; a++) {
                            translated_polygons[a].push(polygons[a][k].add(scale));
                        }
                    }
                    for (let a = 0; a < translated_polygons.length; a++) {
                        let color = color_1;
                        if ((i + j + a) % 2) {
                            color = color_2;
                        }
                        canvas_handler.draw_polygon(color, translated_polygons[a]);
                    }
                }
            }
        }
        else if (this.tesselation_type === 'type15') {
            let horizontal_vector = this.corners[1].subtract(this.corners[0]).multiply(2);
            let vertical_vector = this.corners[1].subtract(this.corners[2]).multiply(2);
            const polygons = [];
            for (let i = 0; i < 4; i++) {
                polygons.push(this.rotate_polygon(polygon, new Vector2(0, 0), Math.PI * (i / 2), 0));
            }
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const scale = horizontal_vector.multiply(i).add(vertical_vector.multiply(j));
                    let translated_polygons = [];
                    for (let k = 0; k < polygons.length; k++) {
                        translated_polygons.push(this.translate_polygon(polygons[k], scale));
                    }
                    for (let a = 0; a < translated_polygons.length; a++) {
                        let color = color_1;
                        if (a % 2) {
                            color = color_2;
                        }
                        canvas_handler.draw_polygon(color, translated_polygons[a]);
                    }
                }
            }
        }
        else if (this.tesselation_type === 'type16') {
            let horizontal_vector = this.corners[1].subtract(this.corners[4]).add(this.corners[2].subtract(this.corners[1]).rotate(1.5 * Math.PI)).add(this.corners[3].subtract(this.corners[4]).rotate(1.5 * Math.PI));
            let vertical_vector = this.corners[1].subtract(this.corners[0]).add(this.corners[2].subtract(this.corners[1]).rotate(1.5 * Math.PI)).add(this.corners[2].subtract(this.corners[3]).rotate(0.5 * Math.PI));
            const polygons = [
                this.rotate_polygon(polygon, new Vector2(0, 0), Math.PI * (0 / 2), 0),
                this.rotate_polygon(polygon, this.corners[3].subtract(this.corners[0]), Math.PI * (1 / 2), 0),
                this.rotate_polygon(polygon, this.corners[3].subtract(this.corners[0]).multiply(2).add(this.corners[2]).subtract(this.corners[3]), Math.PI * (2 / 2), 0),
                this.rotate_polygon(polygon, this.corners[2].subtract(this.corners[0]), Math.PI * (3 / 2), 0)
            ];
            for (let i = -offset; i < offset; i++) {
                for (let j = -offset; j < offset; j++) {
                    const scale = horizontal_vector.multiply(i).add(vertical_vector.multiply(j));
                    let translated_polygons = [];
                    for (let k = 0; k < polygons.length; k++) {
                        translated_polygons.push(this.translate_polygon(polygons[k], scale));
                    }
                    canvas_handler.draw_polygon(colors[(((0 + i) % 3) + 3) % 3], translated_polygons[0]);
                    canvas_handler.draw_polygon(colors[(((1 + i) % 3) + 3) % 3], translated_polygons[1]);
                    canvas_handler.draw_polygon(colors[(((2 + i) % 3) + 3) % 3], translated_polygons[2]);
                    canvas_handler.draw_polygon(colors[(((1 + i) % 3) + 3) % 3], translated_polygons[3]);
                }
            }
        }
    }
}
