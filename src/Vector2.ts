export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	
    // Normalize the vector (make its magnitude 1)
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    }

    // Add another vector to this one
    add(other: Vector2) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    // Subtract another vector from this one
    subtract(other: Vector2) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    // Get the magnitude (length) of the vector
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Calculate the angle to another vector in radians
    angle_to(other: Vector2) {
        const cosTheta = this.dot(other) / (this.magnitude() * other.magnitude());
        const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
        let angle = Math.acos(clampedCosTheta);

        // Determine the sign of the angle using the cross product
        const crossProduct = this.x * other.y - this.y * other.x;
        if (crossProduct < 0) {
            angle = 2 * Math.PI - angle;
        }

        return angle;
    }
	
	dot(other: Vector2) {
		return this.x * other.x + this.y * other.y;
	}
	
	multiply(multiplier: number) {
		return new Vector2(this.x * multiplier, this.y * multiplier);
	}
	
	length_squared() {
        return this.x ** 2 + this.y ** 2;
    }
	
	distance_to(other: Vector2) {
		return Math.sqrt(((this.x - other.x) ** 2) + ((this.y - other.y) ** 2))
	}

    toString() {
        return `(${this.x}, ${this.y})`;
    }

    copy(other: Vector2) {
        this.x = other.x;
        this.y = other.y;
    }

    equals(other: Vector2) {
        return this.x == other.x && this.y == other.y;
    }

    rotate(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const newX = this.x * cos - this.y * sin;
        const newY = this.x * sin + this.y * cos;

        return new Vector2(newX, newY);
    }
}