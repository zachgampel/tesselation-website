class Point {
    constructor(pos, is_straight, angle, t) {
        this.pos = pos;
        this.type = is_straight;
        this.angle = angle;
        this.t = t;
    }
}
export class Line {
    constructor(line_start, line_end) {
        this.points = [new Point(line_start, true, 0, 0), new Point(line_end, true, 0, 1)];
    }
    static closest_point(point, start, end, thresh) {
        let ab = end.subtract(start);
        let ap = point.subtract(start);
        let ab_squared = ab.length_squared();
        // Handle the case where start and end are the same point
        if (ab_squared == 0) {
            let closest_point = start; // Since start and end are the same
            let closest_distance = closest_point.distance_to(point);
            if (closest_distance <= thresh) {
                return [closest_distance, closest_point];
            }
            else {
                return [thresh, null];
            }
        }
        let t = ap.dot(ab) / ab_squared;
        t = Math.max(0, Math.min(1, t));
        let closest_point = start.add(ab.scale(t));
        let closest_distance = closest_point.distance_to(point);
        if (closest_distance <= thresh) {
            return [closest_distance, closest_point];
        }
        else {
            return [thresh, null];
        }
    }
    get_spline_points() {
        const spline_points = [];
        const spline_sections = this._get_spline_sections();
        for (let spline_section of spline_sections) {
            if (spline_section.length == 2)
                spline_points.push(spline_section);
            else {
                spline_section = [spline_section[0]].concat(spline_section, spline_section[spline_section.length - 1]);
                for (let i = 1; i < spline_section.length - 2; i++) {
                    spline_points.push(Line._catmull_rom_spline(spline_section[i - 1], spline_section[i], spline_section[i + 1], spline_section[i + 2]));
                }
            }
        }
        return spline_points;
    }
    // Separate the full spline into sections based on if they're curved or straight
    _get_spline_sections() {
        const spline_sections = [];
        let curr_section = [];
        for (const point of this.points) {
            let control_point_type = point.type;
            let control_point_pos = point.pos;
            if (curr_section.length === 0 || control_point_type)
                curr_section.push(control_point_pos);
            else {
                curr_section.push(control_point_pos);
                spline_sections.push(curr_section);
                curr_section = [control_point_pos];
            }
        }
        if (curr_section.length > 1) {
            spline_sections.push(curr_section);
        }
        return spline_sections;
    }
    static _catmull_rom_spline(p0, p1, p2, p3, num_points = 10) {
        // Generates Catmull-Rom spline points between p1 and p2.
        const curve_points = [];
        for (let i = 0; i < num_points; i++) {
            let t = i / num_points;
            const a = p1.scale(2);
            const b = p2.subtract(p0);
            const c = p0.scale(2).subtract(p1.scale(5)).add(p2.scale(4)).subtract(p3);
            const d = p0.scale(-1).add(p1.scale(3)).subtract(p2.scale(3)).add(p3);
            const point = (a.add(b.scale(t)).add(c.scale(t ** 2)).add(d.scale(t ** 3))).scale(0.5);
            curve_points.push(point);
        }
        curve_points.push(p2); // Ensure the spline finishes at the end of the section
        return curve_points;
    }
    draw_spline(canvas_handler, color) {
        for (const spline_segment of this.get_spline_points()) {
            canvas_handler.draw_aalines(color, spline_segment);
        }
    }
    draw_control_points(canvas_handler, color_1, color_2, color_3, radius) {
        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            let color = null;
            let point_pos = point.pos;
            if (i == 0 || i == this.points.length - 1) {
                color = color_1;
            }
            else if (point.type) {
                color = color_2;
            }
            else {
                color = color_3;
            }
            canvas_handler.drawCircle(Math.floor(point_pos.x), Math.floor(point_pos.y), radius, color);
        }
    }
    get_point_relative_parameters(point_pos) {
        let line_start = this.points[0].pos;
        let line_end = this.points[this.points.length - 1].pos;
        const end_start = line_end.subtract(line_start);
        const end_start_normalized = end_start.normalize();
        let end_start_magnitude = end_start.magnitude();
        const mid_start = point_pos.subtract(line_start);
        const mid_start_normalized = mid_start.normalize();
        let mid_start_magnitude = mid_start.magnitude();
        let t = mid_start_magnitude / end_start_magnitude;
        let angle = end_start_normalized.angle_to(mid_start_normalized);
        return [t, angle];
    }
    insert_point(selected_section_index, pos, option) {
        const [t, angle] = this.get_point_relative_parameters(pos);
        const new_point = new Point(pos, option, angle, t);
        this.points.splice(selected_section_index, 0, new_point);
    }
    update() {
        const curr_start = this.points[0].pos;
        const curr_end = this.points[this.points.length - 1].pos;
        let direction = curr_end.subtract(curr_start);
        direction = direction.normalize();
        for (let j = 1; j < this.points.length - 1; j++) {
            let angle = this.points[j].angle;
            let t = this.points[j].t;
            const new_pos = curr_start.add(curr_end.subtract(curr_start).rotate(angle).scale(t));
            this.points[j].pos = new_pos;
        }
    }
    delete_point(point_index) {
        if (point_index != 0 && point_index != this.points.length - 1) {
            this.points.splice(point_index, 1);
        }
    }
    move_point(point_index, point_delta) {
        this.points[point_index].pos.copy(this.points[point_index].pos.add(point_delta));
        const [t, angle] = this.get_point_relative_parameters(this.points[point_index].pos);
        this.points[point_index].t = t;
        this.points[point_index].angle = angle;
    }
    move_point2(point_index, new_pos) {
        this.points[point_index].pos.copy(new_pos);
        const [t, angle] = this.get_point_relative_parameters(this.points[point_index].pos);
        this.points[point_index].t = t;
        this.points[point_index].angle = angle;
    }
}
