import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected removedAll: boolean = false;

    constructor(source: string, delimiter?: string) {
        if (typeof source !== "string"){
            throw new TypeError("String expected here")
        }
        this.name = source;
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
    }

    private splitNameIntoComponents(): string[] {

        const components: string[] = [];
        let currentComponent: string = "";
        let escaping: boolean = false;
        if (this.name == null){
            return components;
        }
        
        for (let i = 0; i < this.name.length; i++) {
            const char = this.name[i];
            if (escaping) {
                currentComponent += char;
                escaping = false;
            }
            else if (char === ESCAPE_CHARACTER) {
                escaping = true;
            }
            else if (char === this.getDelimiterCharacter()) {
                components.push(currentComponent);
                currentComponent = "";
            }
            else {
                currentComponent += char;
            }
        }
        components.push(currentComponent);
        return components;
    }

    private removeEscapecharacter(original: string, delimiter: string): string {
    
    const delimiterEscaped = "\\" + this.getDelimiterCharacter();
    return original
        .replaceAll(delimiterEscaped, this.getDelimiterCharacter())
        .replaceAll("\\\\", "\\");
    }


    private AssertIsValidI(i: number): void {
        const components = this.splitNameIntoComponents(); 
        if (typeof i !== "number" || !Number.isInteger(i)){
            throw new TypeError("i expected to be Integer");
        }
        
        if (i<0 || i>this.getNoComponents() -1) {
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

    private AssertCisString(c: string) : void {
        if (typeof c !== "string") {
        throw new TypeError("Component must be a string");
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        if (typeof delimiter !== "string" || delimiter.length != 1){
            throw new TypeError("delimiter expected to be a character");
        }
        const components = this.splitNameIntoComponents();
        const cleanedComponents = components.map(c => this.removeEscapecharacter(c, delimiter));
        return cleanedComponents.join(delimiter);
    }

    public asDataString(): string {
        return this.name
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean { 
        return this.removedAll;
    }

    public getNoComponents(): number {
        if(this.removedAll) {
            return 0;
        }
        else{
            return this.splitNameIntoComponents().length;
            }
        }

    public getComponent(x: number): string {
        this.AssertIsValidI(x);
        const components = this.splitNameIntoComponents();
        return components[x];
    }

    public setComponent(n: number, c: string): void {
        this.AssertIsValidI(n);
        this.AssertCisString(c);
        const components = this.splitNameIntoComponents();
        components[n] = c;
        this.name = components.join(this.getDelimiterCharacter());
    }

    public insert(n: number, c: string): void {
        this.assertIsValidinsert(n);
        this.AssertCisString(c);
        if (this.removedAll){
            this.name = c;
            this.removedAll = false;
        }
        else
        {
            const components = this.splitNameIntoComponents();
            components.splice(n, 0, c);
            this.name = components.join(this.getDelimiterCharacter());
        }
    }

    public append(c: string): void {
        this.AssertCisString(c);
        if (this.removedAll){
            this.name = c;
            this.removedAll = false;
        }
        else
        {
            const components = this.splitNameIntoComponents();
            components.push(c);
            this.name = components.join(this.getDelimiterCharacter());
        }
    }

    public remove(n: number): void {
        this.AssertIsValidI(n);
        const components = this.splitNameIntoComponents();

        if(this.getNoComponents() === 1 && n === 0){
            this.removedAll = true
        }
        components.splice(n, 1);
        this.name = components.join(this.getDelimiterCharacter());
    }

    public concat(other: Name): void {
        const components = this.splitNameIntoComponents();
        const count = other.getNoComponents();
        for (let i=0; i<count; i++){
            components.push(other.getComponent(i));
        }
        this.name = components.join(this.getDelimiterCharacter());
        if(!other.isEmpty()) {
            this.removedAll = false;
        }
    }

}