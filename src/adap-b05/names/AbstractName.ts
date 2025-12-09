import { escape } from "querystring";
import { Name } from "../../adap-b04/names/Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    protected isValidOtherName(other: Name): boolean {
        return (other != null && other instanceof AbstractName);
    }

    protected classInvariant(): boolean {
        if (!this.isValidDelimiter(this.delimiter)){
            return false;  
        };
        const noComponents = this.getNoComponents();
        if (noComponents < 0){
            return false;
        }
        for (let i = 0; i < noComponents; i++) {
            const c = this.getComponent(i);
            if (c == null || typeof c !== "string"){
                return false;
            }

        }
        return true;
    }


    protected isValidDelimiter(delimiter: string): boolean {
        if (typeof this.delimiter !== "string") return false;
        if (this.delimiter.length !== 1) return false;
        if (this.delimiter == ESCAPE_CHARACTER) return false
        return true;
    }

    public clone(): Name {
        const comps: string[] = [];

        for (let i = 0; i < this.getNoComponents(); i++) {
            comps.push(this.getComponent(i));
        }
        const cloned = this.createInstance(comps, this.delimiter);
        MethodFailedException.assert(cloned.isEqual(this), "Cloned name is not equal to original");
        MethodFailedException.assert(cloned !== this, "Cloned name is same instance as original");
        return cloned
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter), "delimiter must be a single character string");
        const result: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const raw = this.getComponent(i);
            const cleaned = this.unescape(raw, delimiter);
            result.push(cleaned);
        }
        return result.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.getComponent(i));
        }
        return parts.join(this.delimiter);
    }

    protected unescape(str: string, delimiter: string): string {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter), "delimiter must be a single character string");
        return str
            .replaceAll(ESCAPE_CHARACTER + delimiter, delimiter)
            .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
        }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(this.isValidOtherName(other), "Other name is not valid");
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
        return false;
    }

    if (this.getNoComponents() !== other.getNoComponents()) {
        return false;
    }

    for (let i = 0; i < this.getNoComponents(); i++) {
        if (this.getComponent(i) !== other.getComponent(i)) {
            return false;
        }
    }

    return true;
    }

    public getHashCode(): number {
        let hash = 0;
        for (let i = 0; i < this.getNoComponents(); i++) {
            const comp = this.getComponent(i);
            for (const c of comp) {
                hash = ((hash << 5) - hash) + c.charCodeAt(0);
            }
        }
        return hash >>> 0;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
    protected abstract createInstance(components: string[], delimiter: string): Name;

    public concat(other: Name): void {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before concatenation");
        IllegalArgumentException.assert(this.isValidOtherName(other), "Other name is not valid");
        const noComponents = this.getNoComponents();
        const count = other.getNoComponents();
        for (let i = 0; i < count; i++) {
            this.append(other.getComponent(i));
        }
        MethodFailedException.assert(this.getNoComponents() === noComponents + count, "Concatenation failed");
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after concatenation");
    }

}