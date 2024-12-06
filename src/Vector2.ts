export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	
    normalize(): Vector2 {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magnitude_squared(): number {
        return this.x * this.x + this.y * this.y;
    }

    // Calculate the angle to another vector in radians
    angle_to(other: Vector2): number {
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
	
	dot(other: Vector2): number {
		return this.x * other.x + this.y * other.y;
	}
	
	scale(multiplier: number): Vector2 {
		return new Vector2(this.x * multiplier, this.y * multiplier);
	}

    multiply(other: Vector2): Vector2 {
        return new Vector2(this.x * other.x, this.y * other.y);
    }
	
	length_squared(): number {
        return this.x ** 2 + this.y ** 2;
    }
	
	distance_to(other: Vector2): number {
		return Math.sqrt(((this.x - other.x) ** 2) + ((this.y - other.y) ** 2))
	}

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    copy(other: Vector2): void {
        this.x = other.x;
        this.y = other.y;
    }

    equals(other: Vector2): boolean {
        return this.x == other.x && this.y == other.y;
    }

    rotate(angle: number): Vector2 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const newX = this.x * cos - this.y * sin;
        const newY = this.x * sin + this.y * cos;

        return new Vector2(newX, newY);
    }

    transpose(): Vector2 {
        return new Vector2(this.y, this.x);
    }

    projection(other: Vector2): Vector2 {
        const dot_product: number = this.dot(other);
        const magnitude_squared: number = other.magnitude_squared();
        if (magnitude_squared === 0) {
            return new Vector2(0, 0);
        }
        return other.scale(dot_product / magnitude_squared);
    }
}