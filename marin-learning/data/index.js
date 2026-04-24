
import ArffLoader from "./arff-loader";


export function loadFromArff(data) {

    const relation = ArffLoader.parse(data);

    return relation;
}
