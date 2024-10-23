import { describe, it, expect } from "bun:test";

describe("the @esm-alea/prng module", () => {
    it("export a random function that gives stable prng outputs", async () => {
        const { random, seed } = await import("./mod.ts");
        expect(random).toBeInstanceOf(Function);

        seed(["test"]);
        const result = random();

        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(1);
        expect(result).toMatchSnapshot();
    });

    it("export an int32 function", async () => {
        const { int32 } = await import("./mod.ts");
        expect(int32).toBeInstanceOf(Function);

        const result = int32();

        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(2 ** 32);
    });

    it("export a fract53 function", async () => {
        const { fract53 } = await import("./mod.ts");
        expect(fract53).toBeInstanceOf(Function);

        const result = fract53();

        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(1);
    });

    it("export a restart function that resets to the first value of the seed", async () => {
        const { restart, random, seed } = await import("./mod.ts");
        expect(restart).toBeInstanceOf(Function);

        seed(["test"]);
        const result1 = random();
        restart();
        const result2 = random();

        expect(result1).toBe(result2);
    });

    it("exports a cycle function that advances the prng state", async () => {
        const { cycle, random, seed, restart } = await import("./mod.ts");
        expect(cycle).toBeInstanceOf(Function);

        seed(["test"]);
        const result1 = random();
        cycle(3);
        const result2 = random();

        restart();
        const result3 = random();
        cycle(4);
        const result4 = random();

        expect(result1).not.toBe(result2);
        expect(result3).not.toBe(result4);
        expect(result1).toBe(result3);
    });
});
