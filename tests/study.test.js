import{describe,expect,it}from'vitest';import{shuffleItems}from'../js/study.js';
describe('出題順',()=>{it('元配列を変更しない',()=>{const items=[1,2,3];shuffleItems(items,()=>0);expect(items).toEqual([1,2,3])});it('同じ要素を返す',()=>{expect(shuffleItems([1,2,3],()=>0).sort()).toEqual([1,2,3])})});
