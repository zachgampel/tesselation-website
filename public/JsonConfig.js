var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class JsonConfig {
    // Private constructor to prevent external instantiation
    constructor() {
        this.data = null;
    }
    // Public method to get the singleton instance
    static getInstance() {
        if (!JsonConfig.instance) {
            JsonConfig.instance = new JsonConfig();
        }
        return JsonConfig.instance;
    }
    // Load the JSON data (simulating async fetching)
    loadConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = './shapeConfiguration.json';
            if (this.data)
                return; // Prevent re-loading
            try {
                const response = yield fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch JSON from ${url}: ${response.statusText}`);
                }
                this.data = yield response.json();
            }
            catch (error) {
                console.error('Error loading JSON configuration:', error);
            }
        });
    }
    // Method to get the JSON data
    getConfig() {
        if (!this.data) {
            console.warn('Configuration data not loaded yet!');
        }
        return this.data;
    }
}
