import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected readonly components: readonly string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter!), "delimiter must be a single character string");

        IllegalArgumentException.assert(this.isArray(source), "source must be array");

        for (const c of source) {
            IllegalArgumentException.assert(this.isString(c), "component must be string");
        }

        this.components = [...source];
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after construction");
    }

    protected override classInvariant(): boolean {
        if (!super.classInvariant()){
            return false;
        }
        if (!this.isArray(this.components)){
            return false;
        }
        return true;
    }
    private isArray(source: readonly unknown[]): boolean {
        return Array.isArray(source);
    }

    private isString(c: string) : boolean {
        return (typeof c === "string");
    }

    private isValidI(i: number): boolean {
        if (typeof i !== "number" || !Number.isInteger(i)){
            return false;
        }
        else{
            if (i<0 || i>(this.getNoComponents() -1)) {
            return false;
            }
            else{
                return true;
            }
        }
    }

    private isValidinsertI(i: number): boolean {
        if (typeof i !== "number" || !Number.isInteger(i)){
            return false;
        }
            else{
                if (i<0 || i>(this.getNoComponents())) {
            return false;
            }
            else{
                return true;
            }
        }
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this.isValidI(i), "i is out of bounds");
        return this.components[i];
    }

    public override setComponent(i: number, c: string): Name {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before setting component");
        IllegalArgumentException.assert(this.isValidI(i), "i is out of bounds");
        IllegalArgumentException.assert(this.isString(c), "Component must be a string");
        const comps = [...this.components];
        comps[i] = c;
        const result = new StringArrayName(comps, this.delimiter);
        return result;
    }

    public override insert(i: number, c: string): Name {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before inserting component");
        IllegalArgumentException.assert(this.isValidinsertI(i), "i is out of bounds");
        IllegalArgumentException.assert(this.isString(c), "Component must be a string");
        const comps = [...this.components];
        comps.splice(i, 0, c);
        const result = new StringArrayName(comps, this.delimiter);
        return result;
    }

    public override append(c: string): Name {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before appending component");
        IllegalArgumentException.assert(this.isString(c), "Component must be a string");
        const comps = [...this.components, c];
        const result = new StringArrayName(comps, this.delimiter);
        return result;
    }

    public override remove(i: number): Name {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before removing component");
        IllegalArgumentException.assert(this.isValidI(i), "i is out of bounds");
        const comps = [...this.components];
        comps.splice(i, 1);
        const result = new StringArrayName(comps, this.delimiter);
        return result;
    }

    protected createInstance(components: string[], delimiter: string): Name {
        return new StringArrayName([...components], delimiter);
    }
}