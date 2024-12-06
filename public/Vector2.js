export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    normalize() {
        const mag = this.magnitude();
        if (mag === 0)
            return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    }
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    magnitude_squared() {
        return this.x * this.x + this.y * this.y;
    }
    // Calculate the angle to another vector in radians
    angle_to(other) {
        const dot = this.dot(other);
        let magnitudes_multiplied = this.magnitude() * other.magnitude();
        const cosTheta = (magnitudes_multiplied !== 0) ? dot / magnitudes_multiplied : 0;
        const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
        let angle = Math.acos(clampedCosTheta);
        // Determine the sign of the angle using the cross product
        const crossProduct = this.x * other.y - this.y * other.x;
        if (crossProduct < 0) {
            angle = 2 * Math.PI - angle;
        }
        return angle;
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    scale(multiplier) {
        return new Vector2(this.x * multiplier, this.y * multiplier);
    }
    multiply(other) {
        return new Vector2(this.x * other.x, this.y * other.y);
    }
    length_squared() {
        return this.x ** 2 + this.y ** 2;
    }
    distance_to(other) {
        return Math.sqrt(((this.x - other.x) ** 2) + ((this.y - other.y) ** 2));
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    copy(other) {
        this.x = other.x;
        this.y = other.y;
    }
    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const newX = this.x * cos - this.y * sin;
        const newY = this.x * sin + this.y * cos;
        return new Vector2(newX, newY);
    }
    transpose() {
        return new Vector2(this.y, this.x);
    }
    projection(other) {
        const dot_product = this.dot(other);
        const magnitude_squared = other.magnitude_squared();
        if (magnitude_squared === 0) {
            return new Vector2(0, 0);
        }
        return other.scale(dot_product / magnitude_squared);
    }
}
