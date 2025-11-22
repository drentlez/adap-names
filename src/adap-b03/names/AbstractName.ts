import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    /**
     * erzeugt eine Kopie, indem alle Komponenten neu eingefügt werden
     */
    public clone(): Name {
        const comps: string[] = [];

        for (let i = 0; i < this.getNoComponents(); i++) {
            comps.push(this.getComponent(i));
        }

        return this.createInstance(comps, this.delimiter);
    }


    /**
     * entmaskiert Komponenten und gibt lesbare Version aus
     */
    public asString(delimiter: string = this.delimiter): string {
        const result: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const raw = this.getComponent(i);
            const cleaned = this.unescape(raw, delimiter);
            result.push(cleaned);
        }
        return result.join(delimiter);
    }

    /**
     * gibt die gespeicherten (nicht entmaskten!) Komponenten zurück
     */
    public asDataString(): string {
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.getComponent(i));
        }
        return parts.join(this.delimiter);
    }

    /**
     * Standard-Unescape Logik (Studentenversion):
     * - "\\" wird zu "\"
     * - "\." (oder "\<delimiter>") wird zu "<delimiter>"
     */
    protected unescape(str: string, delimiter: string): string {
        return str
            .replaceAll(ESCAPE_CHARACTER + delimiter, delimiter)
            .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
    }

    public isEqual(other: Name): boolean {
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


    /**
     * einfache Hashfunktion
     */
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

    /**
     * fügt alle Komponenten des anderen Namens hinten an
     */
    public concat(other: Name): void {
        const count = other.getNoComponents();
        for (let i = 0; i < count; i++) {
            this.append(other.getComponent(i));
        }
    }

    // --- Abstrakte Methoden ---
    protected abstract createInstance(components: string[], delimiter: string): Name;
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;
    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
}
