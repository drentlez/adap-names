import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b03/names/Name";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Advanced initialization tests", () => {
  it("test construction 2", () => {
    let n: Name = new StringArrayName(["oss\\\\", "cs", "fau\\\.", "de"]);
    expect(n.asString()).toBe("oss\\.cs.fau\..de");
  });
});

describe("Ultimate initialization tests", () => {
  it("test construction 3", () => {
    let n: Name = new StringArrayName(["oss\\\\", "cs", "fau\\\.", "de"]);
    expect(n.asDataString()).toBe("oss\\\\\\\\.cs.fau\\\\\\..de");
  });
});

describe("Basic function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    // Original name string = "oss.cs.fau.de"
    let n: Name = new StringArrayName(["oss.cs.fau.de"], '#');
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});
