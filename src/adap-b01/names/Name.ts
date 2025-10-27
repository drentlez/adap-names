import { read } from "fs";
import { delimiter } from "path";
import { escape } from "querystring";

export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        if (!Array.isArray(other)){
            throw new TypeError("Array expected here")
        }
        for (const c of other){
            if (typeof c !== "string"){
                throw new TypeError("All components must be strings")
            }
        }

        this.components = other; 
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public removeEscapecharacter(original: string, delimiter: string): string {
    // Reihenfolge ist wichtig: erst "\." zu ".", dann "\\" zu "\"
    const delimiterEscaped = "\\" + this.delimiter;
    return original
        .replaceAll(delimiterEscaped, this.delimiter)
        .replaceAll("\\\\", "\\");
    }




    public asString(delimiter: string = this.delimiter): string {
        if (typeof delimiter !== "string" || delimiter.length != 1){
            throw new TypeError("delimiter expected to be a character");
        }
        const cleanedComponents = this.components.map(c => this.removeEscapecharacter(c, delimiter));

    // Komponenten verbinden
        return cleanedComponents.join(delimiter);


    }


    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */

    public escapeComponents(): string[] {
        return this.components.map(c => 
            c
            .replaceAll("\\", "\\\\")
            .replaceAll(this.delimiter, "\\" + this.delimiter)
        );
    }

    public asDataString(): string {
    const escapedComponents = this.escapeComponents(); // nutzt deine Methode
    return escapedComponents.join(DEFAULT_DELIMITER);
    }

    public assertCisString(c: string) : void {
        if (typeof c !== "string") {
        throw new TypeError("Component must be a string");
    }
}
    public assertIsValidI(i: number): void {
        if (typeof i !== "number" || !Number.isInteger(i)){
            throw new TypeError("i expected to be Integer");
        }

        if (i<0 || i>this.components.length) {
            throw new RangeError("Inted out of bounds");
        }

    }

    public getComponent(i: number): string {
        this.assertIsValidI(i);

        return this.components[i]
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        this.assertIsValidI(i);
        this.assertCisString(c);
        this.components[i] = c;


    }

     /** Returns number of components in Name instance */
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        this.assertIsValidI(i);
        this.assertCisString(c);
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        this.assertCisString(c);
        this.components.push(c)
    }

    public remove(i: number): void {
    this.assertIsValidI(i);
    this.components.splice(i, 1);
    }

}