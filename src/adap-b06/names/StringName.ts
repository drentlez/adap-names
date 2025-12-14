import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected removedAll: boolean = false;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        IllegalArgumentException.assert(this.isString(source), "source must be string");
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter!), "delimiter must be a single character string");

        this.name = source;
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after construction");
    }
    protected escapecomponent(component: string): string {
        let escapedComponent: string = "";
        for (let i = 0; i < component.length; i++) {
            const char = component[i];
            if (char === ESCAPE_CHARACTER || char === this.getDelimiterCharacter()) {
                escapedComponent += ESCAPE_CHARACTER;
            }
            escapedComponent += char;
        }
        return escapedComponent;
    }

    protected override classInvariant(): boolean {
        if (!super.classInvariant()){
            return false;
        }
        if (!this.isString(this.name)){
            return false;
        }
        const components = this.split();
        if (this.removedAll && this.getNoComponents() !== 0){
            return false;
        }
        else{
            if (this.removedAll !== true && components.length !== this.getNoComponents()){
                return false;
            }
        return true;
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
                    if(char === ESCAPE_CHARACTER)
                    {
                    currentComponent += char;

                    }
                    if(char === this.delimiter)
                    {
                    currentComponent += char;
                    }
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
        return this.removedAll ? 0 : this.split().length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this.isValidI(i), "i is out of bounds");
        const arr = this.split();
        return arr[i];
    }

    public setComponent(i: number, c: string) {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before setting component");
        IllegalArgumentException.assert(this.isValidI(i), "i is out of bounds");
        IllegalArgumentException.assert(this.isString(c), "Component must be a string");
        const arr = this.split();
        arr[i] = c;
        this.name = arr.join(this.delimiter);
        MethodFailedException.assert(this.getComponent(i) === c, "Setting component failed");
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after setting component");
    }

    public insert(i: number, c: string) {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before inserting component");
        IllegalArgumentException.assert(this.isValidinsertI(i), "i is out of bounds");
        IllegalArgumentException.assert(this.isString(c), "Component must be a string");
        const noComponents = this.getNoComponents();
        const arr = this.split();
        arr.splice(i, 0, c);
        this.name = arr.join(this.delimiter);
        this.removedAll = false;
        MethodFailedException.assert(this.getComponent(i) === c, "Inserting component failed");
        MethodFailedException.assert(this.getNoComponents() === noComponents + 1, "Inserting component failed");
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after inserting component");
    }

    public append(c: string) {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before appending component");
        IllegalArgumentException.assert(this.isString(c), "Component must be a string");
        const noComponents = this.getNoComponents();
        console.log(this.name);
        if (this.removedAll) {
            this.name = c;
            this.removedAll = false;
        }
        else{
            const arr = this.split();
            console.log(arr);
            arr.push(c);
            const escapedarr = arr.map(comp => this.escapecomponent(comp));
            this.name = escapedarr.join(this.delimiter);
        }
        console.log(this.getNoComponents());
        console.log(this.getComponent(0));
        MethodFailedException.assert(this.getNoComponents() === noComponents + 1, "Appending component failed");
        MethodFailedException.assert(this.getComponent(noComponents) === c, "Appending component failed");
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after appending component");
    }

    public remove(i: number) {
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated before removing component");
        IllegalArgumentException.assert(this.isValidI(i), "i is out of bounds");
        let noComponents = this.getNoComponents();
        if(this.getNoComponents() === 0){
            noComponents =+ 1;
        }

        const components = this.split();

        if(this.getNoComponents() === 1 && i === 0){
            this.removedAll = true
            this.name = ""
        }
        else {
            components.splice(i, 1);
            this.name = components.join(this.getDelimiterCharacter());
        }
        MethodFailedException.assert(this.getNoComponents() === noComponents - 1, "Removing component failed");
        InvalidStateException.assert(this.classInvariant(), "Class invariant violated after removing component");
    }
    protected createInstance(components: string[], delimiter: string): Name {
        return new StringName(components.join(delimiter), delimiter);
    }

}