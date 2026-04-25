
import Relation from "~/relation";


export function parse(data) {

    const lines = data.split(/\r\n|\n/).map(l => l.trim());

    const LOADING_RELATION = "loading";
    const LOADING_ATTRIBUTES = "reading attributes";
    const LOADING_DATA = "reading data";

    let state = LOADING_RELATION;

    let lineNumber = 0;

    let relation = new Relation();

    for (let line of lines) {

        lineNumber++;

        if (line.length === 0 || line.startsWith("%")) {
            // console.log(`${lineNumber}: (Skipping) ${line.substr(1)}`);
            continue;
        }

        switch (state) {
            case LOADING_RELATION: {
                if (line.toLowerCase().startsWith("@relation")) {
                    relation.name = line.split(" ")[1];
                    state = LOADING_ATTRIBUTES;
                }
            } break;

            case LOADING_ATTRIBUTES: {
                if (line.toLowerCase().startsWith("@attribute")) {

                    relation.addAttribute(parseAttribute(line));

                } else if (line.toLowerCase().startsWith("@data")) {
                    state = LOADING_DATA;
                }
            } break;

            case LOADING_DATA: {

                relation.addInstance(line.split(","));

            } break;

            default: {
                console.log("Unknown parser state");
            }
        }
    }

    return relation;
}

export function parseAttribute(text) {


    const attr = {
        name: text.split(" ")[1]
    };

    return attr;
}

export default {
    parse,
    parseAttribute
};
