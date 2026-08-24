# P4 Optimization Notes

## Decision variables

For each supplier `s`:

- `x_s`: integer quantity allocated to supplier `s`
- `y_s`: binary indicator that supplier `s` is used

## Hard constraints

1. Exact requirement coverage by default.
2. `0 <= x_s <= max_allocation_s * y_s`.
3. `x_s >= min_allocation_s * y_s` when supplier is activated.
4. Supplier must be approved and contract-active.
5. Contract/lead-time deadline must meet the required date.
6. Contract OTD/quality targets can be enforced as hard filters.
7. High-risk allocation cannot exceed the configured share.
8. Optional cap on number of suppliers used.

## Objective

P4 minimizes a transparent weighted score combining:

- normalized unit cost
- supplier risk score
- delivery risk
- lead time
- quality penalty
- OTD penalty
- contract delay penalty
- contract OTD/quality target gap penalties when targets are missed

The weights are configurable in `optimization/config.py` and normalized before use.

## Industry/demo KPIs

- Average unit cost
- Weighted average risk
- Weighted delivery risk
- Weighted quality risk
- Weighted lead time
- Weighted quality score
- Weighted OTD score
- Suppliers used
- Allocation HHI concentration
- Premium over cheapest available supplier
- High-risk share

## Why CP-SAT

Procurement allocation naturally contains integer quantities and binary activation variables, plus MOQ/capacity/linking constraints. CP-SAT provides a strong fit for this mixed discrete model and is already the solver named by the team PDF.

## Scenario framework

`optimization.scenarios` supports deterministic what-if changes for:

- supplier disruption
- capacity cut
- lead-time shock
- demand spike

The purpose is to demonstrate that the optimizer can change the allocation when risk or supply conditions change.
