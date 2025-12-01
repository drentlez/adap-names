import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn != null, "child node is null");
        InvalidStateException.assert(!this.childNodes.has(cn), "child node is already a child of this directory");
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn != null, "child node is null");
        InvalidStateException.assert(this.childNodes.has(cn), "child node is not a child of this directory");
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}