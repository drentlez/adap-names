import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringName extends AbstractName {

    protected name: string = "";
    protected removedAll: boolean = false;

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        if (typeof source !== "string") {
            throw new TypeError("source must be a string");
        }

        this.name = source;
    }



    private assertIsValidI(i: number): void {
        const components = this.split(); 
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

    private split(): string[] {
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

    public getNoComponents(): number {
        return this.removedAll ? 0 : this.split().length;
    }

    public getComponent(i: number): string {
        this.assertIsValidI(i);
        const arr = this.split();
        return arr[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidI(i);
        this.AssertCisString(c);
        const arr = this.split();
        arr[i] = c;
        this.name = arr.join(this.delimiter);
    }

    public insert(i: number, c: string) {
        this.assertIsValidinsert(i);
        this.AssertCisString(c);
        const arr = this.split();
        arr.splice(i, 0, c);
        this.name = arr.join(this.delimiter);
        this.removedAll = false;
    }

    public append(c: string) {
        this.AssertCisString(c);
        if (this.removedAll) {
            this.name = c;
            this.removedAll = false;
            return;
        }
        const arr = this.split();
        arr.push(c);
        this.name = arr.join(this.delimiter);
    }

    public remove(i: number) {
        this.assertIsValidI(i);
        const components = this.split();

        if(this.getNoComponents() === 1 && i === 0){
            this.removedAll = true
        }
        components.splice(i, 1);
        this.name = components.join(this.getDelimiterCharacter());
    }

    protected createInstance(components: string[], delimiter: string): Name {
        return new StringName(components.join(delimiter), delimiter);
    }   


}
