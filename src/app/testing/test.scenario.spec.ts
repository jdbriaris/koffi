import {TestScenario} from "./test.scenario";
describe('TestScenario', () => {

   describe('binaryPermutations', binaryPermutationsTest);

});

function binaryPermutationsTest(): void {

    describe('should return correct permutation', () => {

        beforeAll(() => {

        });


        it('when complement set to false', () => {
            let foo = () => {};
            let expectFoo = () => {};
            let bar = () => {};
            let expectBar = () => {};

            let fooScenario = new TestScenario('Foo', [foo], [expectFoo]);
            let barScenario = new TestScenario('Bar', [bar], [expectBar]);

            let scenarios = [fooScenario, barScenario];
            let expectPermutation = [
                [fooScenario],
                [barScenario],
                [fooScenario, barScenario]
            ];

            let permutation = TestScenario.binaryPermutations(scenarios);

            console.log(permutation[0][0].expectations[0]);


            expect(permutation).toEqual(expectPermutation);
        });

        // it('when complement set to true', () => {
        //     let foo = () => {console.log('fooey')};
        //     let expectFoo = () => {console.log('fooey')};
        //     let bar = () => {console.log('barry')};
        //     let expectBar = () => {console.log('barry')};
        //
        //     let fooScenario = new TestScenario('Foo', [foo], [expectFoo]);
        //     let barScenario = new TestScenario('Bar', [bar], [expectBar]);
        //
        //     let scenarios = [fooScenario, barScenario];
        //     let expectPermutation = [
        //         [fooScenario.expectations = [expectBar]],
        //         [barScenario.expectations = [expectFoo]],
        //         [fooScenario.expectations = [], barScenario.expectations = []]
        //     ];
        //
        //     let permutation = TestScenario.binaryPermutations(scenarios, true);
        //
        //
        //     console.log(scenarios[0].actions[0]);
        //
        //     console.log(expectFoo);
        //
        //     console.log(permutation[0][0].expectations);
        //
        //     permutation.forEach(p => {
        //
        //         p.forEach(x => {
        //             console.log(x.expectations);
        //         });
        //
        //
        //     });
        //
        //
        //
        //
        //    // expect(permutation).toEqual(expectPermutation);
        //
        // });


    });


}