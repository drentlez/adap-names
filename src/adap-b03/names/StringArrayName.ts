import { DEFAULT_DELIMITER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        if (!Array.isArray(source)) {
            throw new TypeError("source must be array");
        }

        for (const c of source) {
            if (typeof c !== "string") {
                throw new TypeError("component must be string");
            }
        }

        this.components = [...source];
    }

    private assertCisString(c: string) : void {
        if (typeof c !== "string") {
        throw new TypeError("Component must be a string");
        }
    }

    private assertIsValidI(i: number): void {
        if (typeof i !== "number" || !Number.isInteger(i)){
            throw new TypeError("i expected to be Integer");
        }

        if (i<0 || i>(this.getNoComponents() -1)) {
            throw new RangeError("Inted out of bounds");
        }
    }
    private assertIsValidinsert(i: number): void {
        if (typeof i !== "number" || !Number.isInteger(i)){
            throw new TypeError("i expected to be Integer");
        }

        if (i<0 || i>(this.getNoComponents())) {
            throw new RangeError("Inted out of bounds");
        }
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidI(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidI(i);
        this.assertCisString(c);
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        this.assertIsValidinsert(i);
        this.assertCisString(c);
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.assertCisString(c);
        this.components.push(c);
    }

    public remove(i: number) {
        this.assertIsValidI(i);
        this.components.splice(i, 1);
    }

    protected createInstance(components: string[], delimiter: string): Name {
        return new StringArrayName([...components], delimiter);
    }

}
