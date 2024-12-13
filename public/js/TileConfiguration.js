export class TileConfigurations {
    constructor() {
        this.data = {};
        const translate = 'reflect_x:-1 reflect_y:-1 start_end:1 mirror:0';
        const self = 'reflect_x:1 reflect_y:1 start_end:0 mirror:0';
        const rotated = 'reflect_x:1 reflect_y:1 start_end:0 mirror:1';
        const mirrored = 'reflect_x:-1 reflect_y:-1 start_end:1 mirror:1';
        const self_mirrored = 'reflect_x:-1 reflect_y:1 start_end:1 mirror:0';
        const mirrored_translated = 'reflect_x:1 reflect_y:-1 start_end:0 mirror:0';
        const flip_mirrored = 'reflect_x:-1 reflect_y:1 start_end:0 mirror:0';
        this.data = [
            {
                'name': 'Parallelograms',
                'symmetry': '1-way',
                'shape type': 'regular',
                'tesselation type': 'type1',
                'sides': 4,
                'angle': 0.25 * Math.PI,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, 0, 1],
                        [3, 1, 0],
                    ],
                    1: [
                        [1, 1, 1],
                        [0, 0, 1],
                        [2, 1, 0]
                    ],
                    2: [
                        [2, 1, 1],
                        [3, 1, 1]
                    ],
                    3: [
                        [3, 1, 1],
                        [2, 1, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, translate]
                    ],
                    1: [
                        [1, self],
                        [3, translate]
                    ],
                    2: [
                        [2, self],
                        [0, translate]
                    ],
                    3: [
                        [3, self],
                        [1, translate]
                    ]
                }
            },
            {
                'name': 'Hexagons',
                'symmetry': '1-way',
                'shape type': 'regular',
                'tesselation type': 'type2',
                'sides': 6,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [3, -1, -1]
                    ],
                    1: [
                        [1, 1, 1],
                        [4, -1, -1]
                    ],
                    2: [
                        [2, 1, 1],
                        [5, -1, -1]
                    ],
                    3: [
                        [3, 1, 1],
                        [0, -1, -1]
                    ],
                    4: [
                        [4, 1, 1],
                        [1, -1, -1]
                    ],
                    5: [
                        [5, 1, 1],
                        [2, -1, -1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [3, translate]
                    ],
                    1: [
                        [1, self],
                        [4, translate]
                    ],
                    2: [
                        [2, self],
                        [5, translate]
                    ],
                    3: [
                        [3, self],
                        [0, translate]
                    ],
                    4: [
                        [4, self],
                        [1, translate]
                    ],
                    5: [
                        [5, self],
                        [2, translate]
                    ],
                }
            },
            {
                'name': 'Hexagons, with inner mirror',
                'symmetry': '1-way',
                'shape type': 'regular',
                'tesselation type': 'type2',
                'sides': 6,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 0],
                        [3, -1, 0]
                    ],
                    1: [
                        [1, 1, 1],
                        [2, -1, 1],
                        [4, -1, -1],
                        [5, 1, -1]
                    ],
                    2: [
                        [2, 1, 1],
                        [4, 1, -1],
                        [5, -1, -1],
                        [1, -1, 1]
                    ],
                    3: [
                        [3, 1, 0],
                        [0, -1, 0]
                    ],
                    4: [
                        [4, 1, 1],
                        [5, -1, 1],
                        [1, -1, -1],
                        [2, 1, -1]
                    ],
                    5: [
                        [5, 1, 1],
                        [1, 1, -1],
                        [2, -1, -1],
                        [4, -1, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, mirrored],
                        [3, translate],
                        [5, rotated],
                    ],
                    1: [
                        [1, self, self_mirrored],
                        [4, translate, mirrored_translated]
                    ],
                    2: [
                        [2, self],
                        [0, mirrored],
                        [3, rotated],
                        [5, translate],
                    ],
                    3: [
                        [3, self],
                        [0, translate],
                        [2, rotated],
                        [5, mirrored],
                    ],
                    4: [
                        [4, self, self_mirrored],
                        [1, translate, mirrored_translated]
                    ],
                    5: [
                        [5, self],
                        [0, rotated],
                        [2, translate],
                        [3, mirrored],
                    ]
                }
            },
            {
                'name': 'Rhombuses, with inner mirror',
                'symmetry': '1-way',
                'shape type': 'regular',
                'tesselation type': 'type1',
                'sides': 4,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 0],
                        [2, -1, 0]
                    ],
                    1: [
                        [1, 0, 1],
                        [3, 0, -1]
                    ],
                    2: [
                        [2, 1, 0],
                        [0, -1, 0]
                    ],
                    3: [
                        [3, 0, 1],
                        [1, 0, -1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [1, mirrored],
                        [2, translate],
                        [3, rotated],
                    ],
                    1: [
                        [1, self],
                        [0, mirrored],
                        [2, rotated],
                        [3, translate],
                    ],
                    2: [
                        [2, self],
                        [0, translate],
                        [1, rotated],
                        [3, mirrored],
                    ],
                    3: [
                        [3, self],
                        [0, rotated],
                        [1, translate],
                        [2, mirrored],
                    ],
                }
            },
            {
                'name': 'Parallelograms, rotated',
                'symmetry': '2-way',
                'shape type': 'regular',
                'tesselation type': 'type3',
                'sides': 4,
                'angle': 0.25 * Math.PI,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, 0, 1],
                        [3, 1, 0],
                    ],
                    1: [
                        [1, 1, 1],
                        [0, 0, 1],
                        [2, 1, 0]
                    ],
                    2: [
                        [2, 1, 1],
                        [3, 1, 1]
                    ],
                    3: [
                        [3, 1, 1],
                        [2, 1, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, translate],
                    ],
                    1: [
                        [1, self, translate]
                    ],
                    2: [
                        [2, self],
                        [0, translate],
                    ],
                    3: [
                        [3, self, translate]
                    ],
                }
            },
            {
                'name': 'Triangles, rotated',
                'symmetry': '2-way',
                'shape type': 'regular',
                'tesselation type': 'type4',
                'sides': 3,
                'angle': 1 / 6 * Math.PI,
                'point_relationships': {
                    0: [
                        [0, 1, 1]
                    ],
                    1: [
                        [1, 1, 1]
                    ],
                    2: [
                        [2, 1, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self, translate]
                    ],
                    1: [
                        // [1, self, translate],
                        [1, self, translate]
                    ],
                    2: [
                        [2, self, translate],
                    ]
                }
            },
            {
                'name': 'Pentagons, rotated',
                'symmetry': '2-way',
                'shape type': 'pentagon1',
                'tesselation type': 'type5',
                'sides': 5,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [2, -1, -1]
                    ],
                    1: [
                        [1, 1, 1],
                        [3, -1, -1]
                    ],
                    2: [
                        [2, 1, 1],
                        [0, -1, -1]
                    ],
                    3: [
                        [3, 1, 1],
                        [1, -1, -1]
                    ],
                    4: [
                        [4, 1, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, translate],
                    ],
                    1: [
                        [1, self, translate]
                    ],
                    2: [
                        [2, self],
                        [0, translate],
                    ],
                    3: [
                        [3, self, translate]
                    ],
                    4: [
                        [4, self, translate]
                    ]
                }
            },
            {
                'name': 'Rectangles (with inner mirror), rotated',
                'symmetry': '2-way',
                'shape type': 'regular',
                'tesselation type': 'type3',
                'sides': 4,
                'angle': 0.25 * Math.PI,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, -1, 1],
                        [2, -1, 0],
                        [3, 1, 0],
                    ],
                    1: [
                        [1, 1, 1],
                        [0, -1, 1],
                        [2, 1, 0],
                        [3, -1, 0]
                    ],
                    2: [
                        [2, 1, 1],
                        [0, -1, 0],
                        [1, 1, 0],
                        [3, -1, 1]
                    ],
                    3: [
                        [3, 1, 1],
                        [0, 1, 0],
                        [1, -1, 0],
                        [2, -1, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self, self_mirrored],
                        [2, translate, mirrored_translated],
                    ],
                    1: [
                        [1, self, translate],
                        [3, mirrored, flip_mirrored]
                    ],
                    2: [
                        [2, self, self_mirrored],
                        [0, translate, mirrored_translated],
                    ],
                    3: [
                        [3, self, translate],
                        [1, mirrored, flip_mirrored]
                    ]
                }
            },
            {
                'name': 'Quadrilaterals, rotated',
                'symmetry': '2-way',
                'shape type': 'regular',
                'tesselation type': 'type6',
                'sides': 4,
                'angle': 0.25 * Math.PI,
                'point_relationships': {
                    0: [
                        [0, 1, 1]
                    ],
                    1: [
                        [1, 1, 1]
                    ],
                    2: [
                        [2, 1, 1]
                    ],
                    3: [
                        [3, 1, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self, translate]
                    ],
                    1: [
                        [1, self, translate]
                    ],
                    2: [
                        [2, self, translate]
                    ],
                    3: [
                        [3, self, translate]
                    ]
                }
            },
            {
                'name': 'Kites (with inner mirror) rotated',
                'symmetry': '2-way',
                'shape type': 'kite',
                'tesselation type': 'type6',
                'sides': 4,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [2, -1, 1]
                    ],
                    1: [
                        [1, 0, 1]
                    ],
                    2: [
                        [2, 1, 1],
                        [0, -1, 1]
                    ],
                    3: [
                        [3, 0, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self, translate],
                        [1, mirrored, rotated]
                    ],
                    1: [
                        [1, self, translate],
                        [0, mirrored, rotated]
                    ],
                    2: [
                        [2, self, translate],
                        [3, mirrored, rotated]
                    ],
                    3: [
                        [3, self, translate],
                        [2, mirrored, rotated]
                    ]
                }
            },
            {
                'name': 'Hexagons, rotated',
                'symmetry': '2-way',
                'shape type': 'regular',
                'tesselation type': 'type7',
                'sides': 6,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1]
                    ],
                    1: [
                        [1, 1, 1],
                        [4, -1, -1]
                    ],
                    2: [
                        [2, 1, 1],
                        [5, -1, -1]
                    ],
                    3: [
                        [3, 1, 1]
                    ],
                    4: [
                        [4, 1, 1],
                        [1, -1, -1]
                    ],
                    5: [
                        [5, 1, 1],
                        [2, -1, -1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self, translate],
                    ],
                    1: [
                        [1, self],
                        [4, translate]
                    ],
                    2: [
                        [2, self, translate]
                    ],
                    3: [
                        [3, self, translate]
                    ],
                    4: [
                        [4, self],
                        [1, translate]
                    ],
                    5: [
                        [5, self, translate]
                    ],
                }
            },
            {
                'name': 'Hexagons (with inner mirror), rotated',
                'symmetry': '2-way',
                'shape type': 'regular',
                'tesselation type': 'type7',
                'sides': 6,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [3, -1, 1]
                    ],
                    1: [
                        [1, 1, 1],
                        [2, -1, 1],
                        [4, -1, 0],
                        [5, 1, 0]
                    ],
                    2: [
                        [2, 1, 1],
                        [1, -1, 1],
                        [4, 1, 0],
                        [5, -1, 0]
                    ],
                    3: [
                        [3, 1, 1],
                        [0, -1, 1]
                    ],
                    4: [
                        [4, 1, 1],
                        [5, -1, 1],
                        [1, -1, 0],
                        [2, 1, 0]
                    ],
                    5: [
                        [5, 1, 1],
                        [1, 1, 0],
                        [2, -1, 0],
                        [4, -1, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self, translate],
                        [2, mirrored, rotated]
                    ],
                    1: [
                        [1, self, self_mirrored],
                        [4, translate, mirrored_translated],
                    ],
                    2: [
                        [2, self, translate],
                        [0, mirrored, rotated]
                    ],
                    3: [
                        [3, self, translate],
                        [5, mirrored, rotated]
                    ],
                    4: [
                        [4, self, self_mirrored],
                        [1, translate, mirrored_translated],
                    ],
                    5: [
                        [5, self, translate],
                        [3, mirrored, rotated]
                    ],
                }
            },
            {
                'name': 'Parallelograms',
                'symmetry': '2-way with flip',
                'shape type': 'regular',
                'tesselation type': 'type8',
                'sides': 4,
                'angle': 0.25 * Math.PI,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, 0, 1],
                        [3, 1, 0],
                    ],
                    1: [
                        [1, 1, 1],
                        [0, 0, 1],
                        [2, 1, 0]
                    ],
                    2: [
                        [2, 1, 1],
                        [3, 1, 1]
                    ],
                    3: [
                        [3, 1, 1],
                        [2, 1, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, rotated]
                    ],
                    1: [
                        [1, self],
                        [3, translate]
                    ],
                    2: [
                        [2, self],
                        [0, rotated]
                    ],
                    3: [
                        [3, self],
                        [1, translate]
                    ]
                }
            },
            {
                'name': 'Kites',
                'symmetry': '2-way with flip',
                'shape type': 'kite',
                'tesselation type': 'type9',
                'sides': 4,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [2, -1, 1]
                    ],
                    1: [
                        [1, 1, 1],
                        [0, 2, 0],
                        [3, 1, 0]
                    ],
                    2: [
                        [2, 1, 1],
                        [0, -1, 1]
                    ],
                    3: [
                        [3, 1, 1],
                        [0, 2, 0],
                        [1, 1, 0],
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [1, rotated]
                    ],
                    1: [
                        [1, self],
                        [0, rotated]
                    ],
                    2: [
                        [2, self],
                        [3, rotated]
                    ],
                    3: [
                        [3, self],
                        [2, rotated]
                    ]
                }
            },
            {
                'name': 'Hexagons, flipped on perpendicular axis',
                'symmetry': '2-way with flip',
                'shape type': 'regular',
                'tesselation type': 'type10',
                'sides': 6,
                'angle': 1 / 6 * Math.PI,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, 1, 1],
                        [2, 1, 1]
                    ],
                    1: [
                        [1, 1, 1],
                        [4, 1, -1]
                    ],
                    2: [
                        [2, 1, 1],
                        [0, 1, 1],
                        [1, 1, 1]
                    ],
                    3: [
                        [3, 1, 1],
                        [2, 1, 0],
                        [4, 0, 1],
                        [5, 0, 1]
                    ],
                    4: [
                        [4, 1, 1],
                        [1, 1, -1]
                    ],
                    5: [
                        [5, 1, 1],
                        [0, 1, 0],
                        [3, 0, 1],
                        [4, 0, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [4, rotated]
                    ],
                    1: [
                        [1, self],
                        [3, rotated]
                    ],
                    2: [
                        [2, self],
                        [5, translate]
                    ],
                    3: [
                        [3, self],
                        [1, rotated]
                    ],
                    4: [
                        [4, self],
                        [0, rotated]
                    ],
                    5: [
                        [5, self],
                        [2, translate]
                    ],
                }
            },
            {
                'name': 'Hexagons, flipped on parallel axis',
                'symmetry': '2-way with flip',
                'shape type': 'regular',
                'tesselation type': 'type11',
                'sides': 6,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, 0, 1],
                        [5, 0, 1]
                    ],
                    1: [
                        [1, 1, 1],
                        [2, 0, 1],
                        [4, 0, -1],
                        [5, 1, -1]
                    ],
                    2: [
                        [2, 1, 1],
                        [1, 0, 1],
                        [4, 1, -1],
                        [5, 0, -1],
                    ],
                    3: [
                        [3, 1, 1],
                        [2, 0, 1],
                        [4, 0, 1]
                    ],
                    4: [
                        [4, 1, 1],
                        [1, 0, -1],
                        [2, 1, -1],
                        [5, 0, 1]
                    ],
                    5: [
                        [5, 1, 1],
                        [1, 1, -1],
                        [2, 0, -1],
                        [4, 0, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [5, rotated]
                    ],
                    1: [
                        [1, self],
                        [4, translate]
                    ],
                    2: [
                        [2, self],
                        [3, rotated]
                    ],
                    3: [
                        [3, self],
                        [2, rotated]
                    ],
                    4: [
                        [4, self],
                        [1, translate]
                    ],
                    5: [
                        [5, self],
                        [0, rotated]
                    ],
                }
            },
            {
                'name': 'Rhombuses',
                'symmetry': '3-way',
                'shape type': 'rhombus',
                'tesselation type': 'type12',
                'sides': 4,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 0],
                        [1, 0, '0.5773502691896258'],
                        [2, -1, 0],
                        [3, 0, '-0.5773502691896258']
                    ],
                    1: [
                        [1, 0, 1],
                        [0, '1.732050807568877', 0],
                        [2, '-1.732050807568877', 0],
                        [3, 0, -1]
                    ],
                    2: [
                        [2, 1, 0],
                        [0, -1, 0],
                        [1, 0, '-0.5773502691896258'],
                        [3, 0, '0.5773502691896258']
                    ],
                    3: [
                        [3, 0, 1],
                        [0, '-1.732050807568877', 0],
                        [1, 0, -1],
                        [2, '1.732050807568877', 0],
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [1, translate]
                    ],
                    1: [
                        [1, self],
                        [0, translate]
                    ],
                    2: [
                        [2, self],
                        [3, translate]
                    ],
                    3: [
                        [3, self],
                        [2, translate]
                    ]
                }
            },
            {
                'name': 'Rhombuses with inner mirror',
                'symmetry': '3-way',
                'shape type': 'rhombus',
                'tesselation type': 'type12',
                'sides': 4,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 0],
                        [1, 0, '0.5773502691896258'],
                        [2, -1, 0],
                        [3, 0, '-0.5773502691896258']
                    ],
                    1: [
                        [1, 0, 1],
                        [0, '1.732050807568877', 0],
                        [2, '-1.732050807568877', 0],
                        [3, 0, -1]
                    ],
                    2: [
                        [2, 1, 0],
                        [0, -1, 0],
                        [1, 0, '-0.5773502691896258'],
                        [3, 0, '0.5773502691896258']
                    ],
                    3: [
                        [3, 0, 1],
                        [0, '-1.732050807568877', 0],
                        [1, 0, -1],
                        [2, '1.732050807568877', 0],
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [1, translate],
                        [2, rotated],
                        [3, mirrored],
                    ],
                    1: [
                        [0, translate],
                        [1, self],
                        [2, mirrored],
                        [3, rotated],
                    ],
                    2: [
                        [0, rotated],
                        [1, mirrored],
                        [2, self],
                        [3, translate],
                    ],
                    3: [
                        [0, mirrored],
                        [1, rotated],
                        [2, translate],
                        [3, self],
                    ]
                }
            },
            {
                'name': 'Hexagons',
                'symmetry': '3-way',
                'shape type': 'regular',
                'tesselation type': 'type13',
                'sides': 6,
                'angle': 0,
                'point_special_settings': 1,
                'line_relationships': {
                    0: [
                        [0, self],
                        [5, translate]
                    ],
                    1: [
                        [1, self],
                        [2, translate]
                    ],
                    2: [
                        [2, self],
                        [1, translate]
                    ],
                    3: [
                        [3, self],
                        [4, translate]
                    ],
                    4: [
                        [4, self],
                        [3, translate]
                    ],
                    5: [
                        [5, self],
                        [0, translate]
                    ]
                }
            },
            {
                'name': 'Triangles',
                'symmetry': '4-way',
                'shape type': '4-way-triangle',
                'tesselation type': 'type14',
                'sides': 3,
                'angle': 0,
                'point_special_settings': 2,
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, translate]
                    ],
                    1: [
                        [1, self, translate]
                    ],
                    2: [
                        [2, self],
                        [0, translate]
                    ]
                }
            },
            {
                'name': 'Squares',
                'symmetry': '4-way',
                'shape type': 'regular',
                'tesselation type': 'type15',
                'sides': 4,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 0],
                        [1, 0, '1'],
                        [2, -1, 0],
                        [3, 0, '-1']
                    ],
                    1: [
                        [1, 0, 1],
                        [0, '1', 0],
                        [2, '-1', 0],
                        [3, 0, -1],
                    ],
                    2: [
                        [2, 1, 0],
                        [1, 0, '-1'],
                        [0, -1, 0],
                        [3, 0, '1']
                    ],
                    3: [
                        [3, 0, 1],
                        [0, '-1', 0],
                        [1, 0, -1],
                        [2, '1', 0],
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [3, translate]
                    ],
                    1: [
                        [1, self],
                        [2, translate]
                    ],
                    2: [
                        [2, self],
                        [1, translate]
                    ],
                    3: [
                        [3, self],
                        [0, translate]
                    ]
                }
            },
            {
                'name': 'Pentagons',
                'symmetry': '4-way',
                'shape type': 'pentagon 4-way',
                'tesselation type': 'type16',
                'sides': 5,
                'angle': 0,
                'point_special_settings': 3,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [2, '1', '-1'],
                        [3, '-1', '1']
                    ],
                    1: [],
                    2: [
                        [2, 1, 1],
                        [0, '-1', '1'],
                        [3, -1, -1]
                    ],
                    3: [
                        [3, 1, 1],
                        [0, '1', '-1'],
                        [2, -1, -1]
                    ],
                    4: []
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [1, translate]
                    ],
                    1: [
                        [1, self],
                        [0, translate]
                    ],
                    2: [
                        [2, self],
                        [2, translate]
                    ],
                    3: [
                        [3, self],
                        [4, translate]
                    ],
                    4: [
                        [4, self],
                        [3, translate]
                    ]
                }
            },
            {
                'name': 'Squares with inner mirror',
                'symmetry': '4-way',
                'shape type': 'regular',
                'tesselation type': 'type15',
                'sides': 4,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 0],
                        [1, 0, '1'],
                        [2, -1, 0],
                        [3, 0, '-1']
                    ],
                    1: [
                        [1, 0, 1],
                        [0, '1', 0],
                        [2, '-1', 0],
                        [3, 0, -1],
                    ],
                    2: [
                        [2, 1, 0],
                        [1, 0, '-1'],
                        [0, -1, 0],
                        [3, 0, '1']
                    ],
                    3: [
                        [3, 0, 1],
                        [0, '-1', 0],
                        [1, 0, -1],
                        [2, '1', 0],
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [1, mirrored],
                        [2, rotated],
                        [3, translate]
                    ],
                    1: [
                        [1, self],
                        [0, mirrored],
                        [2, translate],
                        [3, rotated]
                    ],
                    2: [
                        [2, self],
                        [0, rotated],
                        [1, translate],
                        [3, mirrored]
                    ],
                    3: [
                        [3, self],
                        [0, translate],
                        [1, rotated],
                        [2, mirrored]
                    ]
                }
            },
            {
                'name': 'Triangles',
                'symmetry': '4-way with flip',
                'shape type': 'regular',
                'tesselation type': 'type17',
                'sides': 3,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, 0, 2]
                    ],
                    1: [
                        [1, 1, 1],
                        [2, 1, -1]
                    ],
                    2: [
                        [2, 1, 1],
                        [1, 1, -1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, rotated]
                    ],
                    1: [
                        [1, self, translate],
                    ],
                    2: [
                        [2, self],
                        [0, rotated],
                    ]
                }
            },
            {
                'name': 'Quadrilaterals (touching) rotated and flipped',
                'symmetry': '4-way with flip',
                'shape type': 'regular',
                'tesselation type': 'type18',
                'sides': 4,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, 0, 1],
                        [3, 0, 1]
                    ],
                    1: [
                        [1, 1, 1],
                        [3, 1, -1]
                    ],
                    2: [
                        [2, 1, 1]
                    ],
                    3: [
                        [3, 1, 1],
                        [1, 1, -1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [3, rotated]
                    ],
                    1: [
                        [1, self, translate],
                    ],
                    2: [
                        [2, self, translate],
                    ],
                    3: [
                        [3, self],
                        [0, rotated]
                    ]
                }
            },
            {
                'name': 'Quadrilaterals (isolated) rotated and flipped',
                'symmetry': '4-way with flip',
                'shape type': 'regular',
                'tesselation type': 'type19',
                'sides': 4,
                'angle': 0.25 * Math.PI,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [2, -1, 1]
                    ],
                    1: [
                        [1, 1, 1],
                        [3, -1, 1]
                    ],
                    2: [
                        [2, 1, 1],
                        [1, 1, -1]
                    ],
                    3: [
                        [3, 1, 1],
                        [0, 1, -1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, rotated]
                    ],
                    1: [
                        [1, self, translate],
                    ],
                    2: [
                        [2, self],
                        [0, rotated]
                    ],
                    3: [
                        [3, self, translate],
                    ]
                }
            },
            {
                'name': 'Rectangles with 2-way flip',
                'symmetry': '4-way with flip',
                'shape type': 'regular',
                'tesselation type': 'type20',
                'sides': 4,
                'angle': 0.25 * Math.PI,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, 0, 1],
                        [3, 1, 0],
                    ],
                    1: [
                        [1, 1, 1],
                        [0, 0, 1],
                        [2, 1, 0]
                    ],
                    2: [
                        [2, 1, 1],
                        [1, 1, 0],
                        [3, 0, 1]
                    ],
                    3: [
                        [3, 1, 1],
                        [0, 1, 0],
                        [2, 0, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, rotated]
                    ],
                    1: [
                        [1, self],
                        [3, rotated]
                    ],
                    2: [
                        [2, self],
                        [0, rotated]
                    ],
                    3: [
                        [3, self],
                        [1, rotated]
                    ]
                }
            },
            {
                'name': 'Pentagons rotated and flipped',
                'symmetry': '4-way with flip',
                'shape type': 'pentagon1',
                'tesselation type': 'type21',
                'sides': 5,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, 1, 0],
                        [2, -1, 0],
                        [3, -1, 1]
                    ],
                    1: [
                        [1, 1, 1],
                        [2, 1, 1]
                    ],
                    2: [
                        [2, 1, 1],
                        [1, 1, 1]
                    ],
                    3: [
                        [3, 1, 1],
                        [0, -1, 1],
                        [1, -1, 0],
                        [2, 1, 0]
                    ],
                    4: [
                        [4, 1, 1],
                        [0, 1, 0],
                        [3, 1, 0]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, translate]
                    ],
                    1: [
                        [1, self, translate],
                    ],
                    2: [
                        [2, self],
                        [0, translate]
                    ],
                    3: [
                        [3, self],
                        [4, rotated]
                    ],
                    4: [
                        [4, self],
                        [3, rotated]
                    ]
                }
            },
            {
                'name': 'Hexagons rotated and flipped',
                'symmetry': '4-way with flip',
                'shape type': 'regular',
                'tesselation type': 'type22',
                'sides': 6,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [1, 0, 1],
                        [5, 0, 1]
                    ],
                    1: [
                        [1, 1, 1],
                        [2, 0, 1],
                        [4, 0, -1],
                        [5, 1, -1]
                    ],
                    2: [
                        [2, 1, 1],
                        [4, 1, 1]
                    ],
                    3: [
                        [3, 1, 1]
                    ],
                    4: [
                        [4, 1, 1],
                        [2, 1, 1]
                    ],
                    5: [
                        [5, 1, 1],
                        [1, 1, -1],
                        [2, 0, -1],
                        [4, 0, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [5, rotated]
                    ],
                    1: [
                        [1, self],
                        [4, translate]
                    ],
                    2: [
                        [2, self, translate]
                    ],
                    3: [
                        [3, self, translate]
                    ],
                    4: [
                        [4, self],
                        [1, translate]
                    ],
                    5: [
                        [5, self],
                        [0, rotated]
                    ]
                }
            },
            {
                'name': 'Pentagons with 2-way flip',
                'symmetry': '4-way with flip',
                'shape type': 'pentagon 4-way',
                'tesselation type': 'type23',
                'sides': 5,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [2, '1', '1'],
                        [3, '-1', '-1']
                    ],
                    1: [
                        [1, 1, 1],
                        [2, 1, 1],
                        [3, '1', '1']
                    ],
                    2: [
                        [2, 1, 1],
                        [1, 1, 1],
                        [3, '1', '1']
                    ],
                    3: [
                        [3, 1, 1],
                        [2, '-1', '-1'],
                        [4, 1, 1]
                    ],
                    4: [
                        [4, 1, 1],
                        [2, '-1', '-1'],
                        [3, 1, 1]
                    ],
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [3, rotated]
                    ],
                    1: [
                        [1, self],
                        [4, rotated]
                    ],
                    2: [
                        [2, self, translate]
                    ],
                    3: [
                        [3, self],
                        [0, rotated]
                    ],
                    4: [
                        [4, self],
                        [1, rotated]
                    ],
                }
            },
            {
                'name': 'Hexagons with 2-way flip',
                'symmetry': '4-way with flip',
                'shape type': 'regular',
                'tesselation type': 'type24',
                'sides': 6,
                'angle': 0,
                'point_relationships': {
                    0: [
                        [0, 1, 1],
                        [3, -1, 1],
                    ],
                    1: [
                        [1, 1, 1],
                        [3, 1, -1],
                        [4, -1, 1]
                    ],
                    2: [
                        [2, 1, 1],
                        [0, 1, -1],
                        [5, -1, 1]
                    ],
                    3: [
                        [3, 1, 1],
                        [0, -1, 1]
                    ],
                    4: [
                        [4, 1, 1],
                        [0, 1, 1],
                        [2, 1, -1]
                    ],
                    5: [
                        [5, 1, 1],
                        [1, 1, -1],
                        [3, 1, 1]
                    ]
                },
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, rotated]
                    ],
                    1: [
                        [1, self],
                        [4, rotated]
                    ],
                    2: [
                        [2, self],
                        [0, rotated]
                    ],
                    3: [
                        [3, self, translate]
                    ],
                    4: [
                        [4, self],
                        [1, rotated]
                    ],
                    5: [
                        [5, self, translate]
                    ],
                }
            },
            {
                'name': 'Triangles',
                'symmetry': '6-way',
                'shape type': 'regular',
                'tesselation type': 'type25',
                'sides': 3,
                'angle': 0.5 * Math.PI,
                'point_special_settings': 4,
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, translate]
                    ],
                    1: [
                        [1, self, translate]
                    ],
                    2: [
                        [2, self],
                        [0, translate]
                    ]
                }
            },
            {
                'name': 'Isoscelese Triangles',
                'symmetry': '6-way',
                'shape type': 'isoscelese triangle',
                'tesselation type': 'type26',
                'sides': 3,
                'angle': 0,
                'point_special_settings': 5,
                'line_relationships': {
                    0: [
                        [0, self],
                        [2, translate]
                    ],
                    1: [
                        [1, self, translate]
                    ],
                    2: [
                        [2, self],
                        [0, translate]
                    ]
                }
            },
            {
                'name': 'Kites',
                'symmetry': '6-way',
                'shape type': 'kite',
                'tesselation type': 'type27',
                'sides': 3,
                'angle': 0,
                'point_special_settings': 6,
                'line_relationships': {
                    0: [
                        [0, self],
                        [1, translate]
                    ],
                    1: [
                        [1, self],
                        [0, translate]
                    ],
                    2: [
                        [2, self],
                        [3, translate]
                    ],
                    3: [
                        [3, self],
                        [2, translate]
                    ]
                }
            },
            {
                'name': 'Pentagons',
                'symmetry': '6-way',
                'shape type': 'pentagon6-way',
                'tesselation type': 'type28',
                'sides': 5,
                'angle': 0,
                'point_special_settings': 7,
                'line_relationships': {
                    0: [
                        [0, self],
                        [4, translate]
                    ],
                    1: [
                        [1, self, translate]
                    ],
                    2: [
                        [2, self],
                        [3, translate]
                    ],
                    3: [
                        [3, self],
                        [2, translate]
                    ],
                    4: [
                        [4, self],
                        [0, translate]
                    ]
                }
            },
        ];
    }
    get_settings(settings_string) {
        const settings = {};
        const input_settings = settings_string.split(' ');
        for (let input_setting of input_settings) {
            const [key, value] = input_setting.split(':');
            settings[key] = +value;
        }
        return settings;
    }
}
