import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        // do something
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(Number.isInteger(noBytes) && noBytes >= 0, "number of bytes to read is not a non-negative integer");
        InvalidStateException.assert(this.state === FileState.OPEN, "file is not open");
        // read something
        return new Int8Array();
    }

    public close(): void {
        InvalidStateException.assert(this.state === FileState.OPEN, "file is not open");
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}