import Instance from "./Instance";

export function create(data) {

}


export default class Relation {

    constructor(name) {
        this.name = name;
        this.attributes = [];
        this.instances = [];
    }

    addAttribute(attr) {
        this.attributes.push(attr);
    }

    addInstance(data) {
        const newInstance = Instance.create(this.attributes, data);
        this.instances.push(newInstance);
    }
};
