export function create(attributes, tuple) {

    const instance = {};

    attributes.forEach((a, index) => {
        instance[a.name] = tuple[index];
    });

    return instance;
}


export default {
    create
}
