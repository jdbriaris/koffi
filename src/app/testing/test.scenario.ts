var binaryVariations = require('binary-variations');

export class TestScenario {
    constructor(public description: string,
                public actions: (()=>void)[],
                public expectations: (()=>void)[]) {}

    public static binaryPermutations(testScenarios: TestScenario[],
                                     isComplement: boolean = false): TestScenario[][] {
        let permutation = binaryVariations(testScenarios);

        if (!isComplement) {
            return permutation;
        }

        return permutation;

        // return permutation
        //     .filter(p => p.indexOf(p) < 0)
        //     .map((c, idx) => c.actions = permutation.actions[idx]);
    }
}