# 49. Group Anagrams (Medium) (<https://leetcode.com/problems/group-anagrams/>)

  > Example 1: Input: ['eat','tea','tan','ate','nat','bat'] Output: [['bat'],['nat','tan'],['eat','tea','ate']] Explanation: ...
> Example 2: Input: [''] Output: [['']] Explanation: ...
> Example 3: Input: ['a'] Output: [['a']] Explanation: ...

```ts
function groupAnagrams(strs: string[]): string[][] {
	if (strs.length === 1) return [strs]
	const group = new Map<string, string[]>()
	
	for (const ch of strs) {
		const curr = ch.split('').sort().join('')
		const currVal: string[] | undefined = group.get(curr)
		
		if (currVal === undefined) {
			group.set(curr, [ch])
		} else {
			currVal.push(ch)
			group.set(curr, currVal)
		}
	}
	return Array.from(group.values())
}

// by charCode [O(n)]
function groupAnagrams2(strs: string[]): string[][] {
	if (strs.length === 1) return [strs]
	const mp = new Map<string, string[]>()
	
	for (const ch of strs) {
		const count = new Array(26).fill(0)
		
		for (const c of ch) {
			count[c.charCodeAt(0) - 97]++
		}
		
		const countStr = count.join('#')
		const currVal = mp.get(countStr)

		if (currVal === undefined) {
			mp.set(countStr, [ch])
		} else {
			currVal.push(ch)
			mp.set(countStr, currVal)
		}
	}
	return Array.from(mp.values())
}

// Local check:
console.log(groupAnagrams(['eat','tea','tan','ate','nat','bat']));
console.log(groupAnagrams(['']));
console.log(groupAnagrams(['a']));
```

```md
Example 1:
	Input: ['eat','tea','tan','ate','nat','bat']
	Output: [['bat'],['nat','tan'],['eat','tea','ate']]
	Explanation: ...
Example 2:
	Input: ['']
	Output: [['']]
	Explanation: ...
Example 3:
	Input: ['a']
	Output: [['a']]
	Explanation: ...
```