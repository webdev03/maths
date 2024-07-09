import type { Question } from "./types";

export function defaultData(type: Question["type"]): Question["data"] {
    if(type === "number") {
        return {
            contents: "",
            solutions: []
        }
    } else {
        throw Error("Unknown type")
    }
}