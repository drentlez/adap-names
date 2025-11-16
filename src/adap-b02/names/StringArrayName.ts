import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        if (!Array.isArray(source)){
                    throw new TypeError("Array expected here")
                }
                for (const c of source){
                    if (typeof c !== "string"){
                        throw new TypeError("All components must be strings")
                    }
                }
        
                this.components = source; 
                this.delimiter = delimiter ?? DEFAULT_DELIMITER;
    }

    private removeEscapecharacter(original: string, delimiter: string): string {
    
    const delimiterEscaped = "\\" + this.getDelimiterCharacter();
    return original
        .replaceAll(delimiterEscaped, this.getDelimiterCharacter())
        .replaceAll("\\\\", "\\");
    }

        


    public asString(delimiter: string = this.delimiter): string {
        if (typeof delimiter !== "string" || delimiter.length != 1){
            throw new TypeError("delimiter expected to be a character");
        }
        const cleanedComponents = this.components.map(c => this.removeEscapecharacter(c, delimiter));

        return cleanedComponents.join(delimiter);
    }


    public asDataString(): string {
        return this.components.join(this.getDelimiterCharacter());
    }

    public getDelimiterCharacter(): string {
        return this.delimiter
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidI(i);

        return this.components[i]
    }

    public setComponent(i: number, c: string): void {
        this.assertIsValidI(i);
        this.assertCisString(c);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.assertIsValidinsert(i);
        this.assertCisString(c);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.assertCisString(c);
        this.components.push(c)
    }

    public remove(i: number): void {
        this.assertIsValidI(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        const count = other.getNoComponents();
        for (let i=0; i<count; i++){
            this.components.push(other.getComponent(i));
        }
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
}