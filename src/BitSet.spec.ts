import { BitSet } from './BitSet';

describe('BitSet', () => {

    it('can store a bunch of arbitrary items', () => {
        const numItems = 5000;
        const set = new BitSet(numItems);
        expect(set.size()).toBe(numItems);
        expectOn(set, 0);
        expect(set.buffer).toBeTruthy();

        const booleans: boolean[] = [];
        let numTrue = 0;
        for (let i = 0; i < numItems; i++) {
            const val = i % 3 === 0 || i % 8 === 0;
            booleans.push(val);
            set.set(i, val);
            if (val) numTrue++;
        }
        expect(numItems).toBeGreaterThan(0);
        expect(numTrue).toBeGreaterThan(0);
        expectOn(set, numTrue);
        expect(set.size()).toBe(numItems);

        for (let i = 0; i < numItems; i++) {
            expect(booleans[i]).toBe(set.check(i), `val at place ${i} should match`);
        }
    });

    it('can set the whole thing at once', () => {
        const set = new BitSet(100);
        expect(set.size()).toBe(100);
        expectOn(set, 0);
        expect(set.none()).toBe(true);
        expect(set.any()).toBe(false);
        expect(set.all()).toBe(false);

        set.setAll(true);
        expect(set.size()).toBe(100);
        expectOn(set, 100);
        expect(set.none()).toBe(false);
        expect(set.any()).toBe(true);
        expect(set.all()).toBe(true);

        set.setAll(false);
        expect(set.size()).toBe(100);
        expectOn(set, 0);
    });

    it('can be resized', () => {
        const set = new BitSet(10);
        set.setAll(true);
        expect(set.size()).toBe(10);
        expectOn(set, 10);

        set.setSize(100);
        expect(set.size()).toBe(100);
        expectOn(set, 10);

        set.setSize(5);
        expectOn(set, 5);

        set.setSize(100);
        expectOn(set, 5);

        set.setSize(0);
        expectOn(set, 0);

        set.setSize(100);
        expectOn(set, 0);
    });

});

function expectOn(set: BitSet, numOn: number) {
    let sum = 0;
    for (let i = 0; i < set.size(); i++) {
        if (set.check(i)) sum++;
    }
    expect(numOn).toBe(sum);
    expect(set.numOn()).toBe(sum);
    expect(set.numOff()).toBe(set.size() - sum);
}

// function print(set: BitSet) {
//     const logSize = set.size();
//     const buf = new Uint32Array(set.buffer);
//     for (let i = 0; i < buf.length * 32; i++) {
//         console.log(i < logSize ? 'in: ' : 'over: ', set.check(i));
//     }
// }
