import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";


export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        this.targetNode = target;
    }

    public getBaseName(): string {
        InvalidStateException.assert(this.targetNode != null, "target node is null");
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(typeof bn === "string" , "base name is not a string");
        InvalidStateException.assert(this.targetNode != null, "target node is null");
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        const result: Node = this.targetNode as Node;
        return result;
    }
}