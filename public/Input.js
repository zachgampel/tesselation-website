import { TileConfigurations } from './ShapeConfiguration.js';
export class Input {
    constructor(s = 'tesselationSelection', options) {
        this.options = options;
        this.current_selection = options[0];
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
            let abc = false;
            if (abc) {
                for (const [section_name, value] of Object.entries(sections)) {
                    const section_element = document.createElement('fieldset');
                    this.tesselation_selection.appendChild(section_element);
                    const legend_element = document.createElement('legend');
                    const legend_element_text = document.createTextNode(`${section_name}`);
                    legend_element.appendChild(legend_element_text);
                    section_element.appendChild(legend_element);
                    this.tesselation_selection.appendChild(section_element);
                    for (const shape_name of value) {
                        const label_element = document.createElement('label');
                        section_element.appendChild(label_element);
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = 'shape';
                        input.value = shape_name;
                        label_element.appendChild(input);
                        const input_text_element = document.createTextNode(`${shape_name}`);
                        label_element.appendChild(input_text_element);
                    }
                }
            }
            else {
                let html = '';
                for (const [section_name, value] of Object.entries(sections)) {
                    let sections_string = '';
                    for (const shape_name of value) {
                        sections_string += `<label><input type="radio" name="shape" value="${shape_name}"/> ${shape_name}</label>`;
                    }
                    sections_string = `<fieldset><legend>${section_name}</legend>${sections_string}</fieldset>`;
                    html += sections_string;
                }
                this.tesselation_selection.innerHTML = html;
            }
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
        this.current_selection = target.value;
    }
}
