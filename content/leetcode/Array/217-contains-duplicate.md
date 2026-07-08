# 217. Contains Duplicate (Easy) (<https://leetcode.com/problems/contains-duplicate/>)

  > Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.
> Constraints: 1 <= nums.length <= 10^5 -10^9 <= nums[i] <= 10^9

```ts
function containsDuplicate(nums: number[]): boolean {
	const st = new Set<number>()
	for (const num of nums) {
		if (st.has(num)) {
			return true
		}
		st.add(num)
}
	return false
}

// Local check:
console.log(containsDuplicate([1, 2, 3, 1])) // true
console.log(containsDuplicate([1, 2, 3, 4])) // false
console.log(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])) // true
```

```md
Example 1:
	Input: nums = [1,2,3,1]
	Output: true
	Explanation: The element 1 occurs at the indices 0 and 3.

Example 2:
	Input: nums = [1,2,3,4]
	Output: false
	Explanation: All elements are distinct.

Example 3:
	Input: nums = [1,1,1,3,3,4,3,2,4,2]
	Output: true
```

[[leetcode/Array/index|array]]
[[leetcode/Array/268-missing-number|268 — то же set-семейство]]
[[leetcode/Array/645-set-mismatch|645 — то же set-семейство]]
#leetcode
