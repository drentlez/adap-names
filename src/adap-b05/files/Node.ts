import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(to != null, "to directory is null");
        InvalidStateException.assert(this.parentNode.hasChildNode(this), "node is not a child of its parent directory");
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        const result: Set<Node> = new Set<Node>();

        try {
            const myBaseName: string = this.getBaseName();
            if (myBaseName === "" ){
                const trigger = new InvalidStateException("Base name is empty");
                throw new ServiceFailureException("Base name is empty", trigger);
            }
            if (myBaseName === bn) {
                result.add(this);
            }
        }
        catch (ex) {
            if (ex instanceof ServiceFailureException) {
                throw ex;
            }
            throw new ServiceFailureException("Failed to get base name of node", ex as Exception);
        }

        const maybeChildren = (this as any).childNodes;
        if (maybeChildren && typeof maybeChildren[Symbol.iterator] === 'function') {
            for (const child of maybeChildren as Set<Node>) {
                const foundInChild = child.findNodes(bn);
                for (const n of foundInChild) {
                    result.add(n);
                }
            }
        }
        return result;
    }

}
