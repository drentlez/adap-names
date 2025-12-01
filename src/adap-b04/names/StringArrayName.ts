import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

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
    private isArray(source: string[]): boolean {
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

    public setComponent(i: number, c: string) {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before setting component");
        IllegalArgumentException.assert(this.isValidI(i), "i is out of bounds");
        IllegalArgumentException.assert(this.isString(c), "Component must be a string");
        this.components[i] = c;
        MethodFailedException.assert(this.components[i] === c, "Setting component failed");
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after setting component");
    }

    public insert(i: number, c: string) {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before inserting component");
        IllegalArgumentException.assert(this.isValidinsertI(i), "i is out of bounds");
        IllegalArgumentException.assert(this.isString(c), "Component must be a string");
        const noComponents = this.getNoComponents();
        this.components.splice(i, 0, c);
        MethodFailedException.assert(this.components[i] === c, "Inserting component failed");
        MethodFailedException.assert(this.getNoComponents() === noComponents + 1, "Inserting component failed");
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after inserting component");
    }

    public append(c: string) {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before appending component");
        IllegalArgumentException.assert(this.isString(c), "Component must be a string");
        const noComponents = this.getNoComponents();
        this.components.push(c);
        MethodFailedException.assert(this.getNoComponents() === noComponents + 1, "Appending component failed");
        MethodFailedException.assert(this.components[noComponents] === c, "Appending component failed");
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after appending component");
    }

    public remove(i: number) {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before removing component");
        IllegalArgumentException.assert(this.isValidI(i), "i is out of bounds");
        const noComponents = this.getNoComponents();
        this.components.splice(i, 1);
        MethodFailedException.assert(this.getNoComponents() === noComponents - 1, "Removing component failed");
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after removing component");
    }

    protected createInstance(components: string[], delimiter: string): Name {
        return new StringArrayName([...components], delimiter);
    }
}