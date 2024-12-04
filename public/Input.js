import { TileConfigurations } from './ShapeConfiguration.js';
export class Input {
    constructor(s) {
        this.current_selection = 0;
        const data = new TileConfigurations().data;
        const sections = {};
        for (let shape_info of data) {
            const shape_name = shape_info['name'];
            const shape_pattern = shape_info['symmetry'];
            if (shape_name !== '') {
                if (!sections.hasOwnProperty(shape_pattern)) {
                    sections[shape_pattern] = [];
                }
                sections[shape_pattern].push(shape_name);
            }
        }
        this.tesselation_selection = document.getElementById(s);
        if (this.tesselation_selection) {
            let html = '';
            let curr_index = 0;
            for (const [section_name, value] of Object.entries(sections)) {
                let sections_string = '';
                for (const shape_name of value) {
                    sections_string += `<label><input type="radio" name="shape" data-id="${curr_index}" value="${shape_name}"/> ${shape_name}</label>`;
                    curr_index++;
                }
                sections_string = `<fieldset><legend>${section_name}</legend>${sections_string}</fieldset>`;
                html += sections_string;
            }
            this.tesselation_selection.innerHTML = html;
            const inputs = this.tesselation_selection.querySelectorAll('input[type="radio"]');
            inputs.forEach(input => {
                input.addEventListener('change', this.updateShape.bind(this)); // Bind to the class instance
            });
            const first_input = inputs[0];
            if (first_input) {
                first_input.checked = true;
                first_input.dispatchEvent(new Event('change'));
            }
        }
        else {
            console.error(`Could not find element ${s}.`);
        }
    }
    updateShape(event) {
        const target = event.target;
        const element_id = target.dataset.id;
        if (element_id !== undefined) {
            this.current_selection = +element_id;
        }
    }
}
