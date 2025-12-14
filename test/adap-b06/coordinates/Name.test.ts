import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

describe("Basic StringName function tests (B06)", () => {
    it("test insert", () => {
        let n: Name = new StringName("oss.fau.de");
        n = n.insert(1, "cs");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });

    it("test append", () => {
        let n: Name = new StringName("oss.cs.fau");
        n = n.append("de");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });

    it("test remove", () => {
        let n: Name = new StringName("oss.cs.fau.de");
        n = n.remove(0);
        expect(n.asString()).toBe("cs.fau.de");
    });
});

describe("Basic StringArrayName function tests (B06)", () => {
    it("test insert", () => {
        let n: Name = new StringArrayName(["oss", "fau", "de"]);
        n = n.insert(1, "cs");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });

    it("test append", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau"]);
        n = n.append("de");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });

    it("test remove", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        n = n.remove(0);
        expect(n.asString()).toBe("cs.fau.de");
    });
});

describe("Delimiter function tests (B06)", () => {
    it("test insert with custom delimiter", () => {
        let n: Name = new StringName("oss#fau#de", '#');
        n = n.insert(1, "cs");
        expect(n.asString()).toBe("oss#cs#fau#de");
    });
});

describe("Escape character extravaganza (B06)", () => {
    it("test escape and delimiter boundary conditions", () => {
        let n: Name = new StringName("oss.cs.fau.de", '#');
        expect(n.getNoComponents()).toBe(1);
        expect(n.asString()).toBe("oss.cs.fau.de");

        n = n.append("people");
        expect(n.asString()).toBe("oss.cs.fau.de#people");
    });
});

describe("Interchangeability tests for StringName and StringArrayName (B06)", () => {
    it("concat works between StringArrayName and StringName", () => {
        let arrayName: Name = new StringArrayName(["foo", "bar"]);
        let stringName: Name = new StringName("baz.qux");

        arrayName = arrayName.concat(stringName);
        expect(arrayName.asString()).toBe("foo.bar.baz.qux");
    });

    it("append works for both types", () => {
        let stringName: Name = new StringName("baz.qux");
        stringName = stringName.append("quux");
        expect(stringName.asString()).toBe("baz.qux.quux");

        let arrayName: Name = new StringArrayName(["foo", "bar"]);
        arrayName = arrayName.append("baz");
        expect(arrayName.asString()).toBe("foo.bar.baz");
    });

    it("remove and insert work correctly", () => {
        let arrayName: Name = new StringArrayName(["foo", "bar", "baz"]);
        arrayName = arrayName.remove(1);
        expect(arrayName.asString()).toBe("foo.baz");

        arrayName = arrayName.insert(1, "inserted");
        expect(arrayName.asString()).toBe("foo.inserted.baz");
    });

    it("getComponent and setComponent work correctly", () => {
        let stringName: Name = new StringName("a.b.c");
        expect(stringName.getComponent(1)).toBe("b");

        stringName = stringName.setComponent(1, "B");
        expect(stringName.getComponent(1)).toBe("B");
        expect(stringName.asString()).toBe("a.B.c");
    });

    it("isEmpty works correctly", () => {
        let emptyArray: Name = new StringArrayName([]);
        expect(emptyArray.isEmpty()).toBe(true);

        let nonEmpty: Name = new StringName("non.empty");
        expect(nonEmpty.isEmpty()).toBe(false);
    });

    it("handles custom delimiters correctly", () => {
        let stringName: Name = new StringName("one#two#three", '#');
        stringName = stringName.append("four");
        expect(stringName.asString()).toBe("one#two#three#four");
    });

    it("handles escape characters correctly", () => {
        let stringName: Name = new StringName("one\\.two.three");
        expect(stringName.getNoComponents()).toBe(2);
        expect(stringName.asString()).toBe("one.two.three");
        expect(stringName.getComponent(0)).toBe("one.two");
        expect(stringName.getComponent(1)).toBe("three");

        stringName = stringName.append("four");
        expect(stringName.asString()).toBe("one.two.three.four");
    });
});

describe("Edge case tests for StringName and StringArrayName (B06)", () => {

    it("handles completely empty input correctly", () => {
        let emptyArray: Name = new StringArrayName([]);
        expect(emptyArray.isEmpty()).toBe(true);
        expect(emptyArray.getNoComponents()).toBe(0);
        expect(emptyArray.asString()).toBe("");

        let emptyString: Name = new StringName("");
        emptyString = emptyString.append("abc");
        expect(emptyString.isEmpty()).toBe(false);
        expect(emptyString.getNoComponents()).toBe(2);
        expect(emptyString.asString()).toBe(".abc");
    });

    it("handles names with only delimiters", () => {
        let arrayName: Name = new StringArrayName(["", "", ""]);
        expect(arrayName.getNoComponents()).toBe(3);
        expect(arrayName.asString()).toBe("..");

        let stringName: Name = new StringName("..");
        expect(stringName.getNoComponents()).toBe(3);
        expect(stringName.asString()).toBe("..");
    });

    it("handles names with only escape characters", () => {
        let stringName: Name = new StringName("\\\\");
        expect(stringName.getNoComponents()).toBe(1);
        expect(stringName.asString()).toBe("\\");
    });

    it("insert and remove at boundaries", () => {
        let arrayName: Name = new StringArrayName(["first", "last"]);

        arrayName = arrayName.insert(0, "newFirst");
        expect(arrayName.asString()).toBe("newFirst.first.last");

        arrayName = arrayName.insert(arrayName.getNoComponents(), "newLast");
        expect(arrayName.asString()).toBe("newFirst.first.last.newLast");

        arrayName = arrayName.remove(0);
        expect(arrayName.asString()).toBe("first.last.newLast");

        arrayName = arrayName.remove(arrayName.getNoComponents() - 1);
        expect(arrayName.asString()).toBe("first.last");
    });

    it("concat with empty names", () => {
        let empty: Name = new StringArrayName([]);
        let nonEmpty: Name = new StringName("a.b.c");

        empty = empty.concat(nonEmpty);
        expect(empty.asString()).toBe("a.b.c");

        nonEmpty = nonEmpty.concat(new StringArrayName([]));
        expect(nonEmpty.asString()).toBe("a.b.c");
    });

    it("append to empty name", () => {
        let empty: Name = new StringArrayName([]);
        empty = empty.append("first");
        expect(empty.getNoComponents()).toBe(1);
        expect(empty.asString()).toBe("first");

        let emptyString: Name = new StringName("");
        emptyString = emptyString.append("only");
        expect(emptyString.getNoComponents()).toBe(2);
        expect(emptyString.asString()).toBe(".only");
    });
});
