# Portfolio Metrics CLI Utility (`tools/c/`)

A lightweight, deterministic C command-line utility for aggregating, computing, and verifying code volume and module density statistics across verified portfolio projects.

## Purpose

While the web portfolio presents visual architectural relationship maps, this standalone systems utility provides:
- Low-overhead metric aggregation without JavaScript runtime dependencies.
- Structured output modes (Human-readable terminal tables or machine-parseable JSON).
- Fast sanity verification for source byte counts, test unit totals, and complexity indices.

## Compilation

Compile using standard `gcc` (or `clang` / `tcc`):

```bash
gcc -O2 portfolio_metrics.c -o portfolio_metrics
```

## Usage

### 1. Formatted Terminal Table

```bash
./portfolio_metrics
```

Produces an aligned ASCII summary table of monitored projects, byte weights, module counts, and complexity metrics.

### 2. Machine-Readable JSON Export

```bash
./portfolio_metrics --json
```

Outputs formatted JSON containing aggregated summary metrics alongside individual project objects, suitable for downstream CI/CD pipelines.

## Architectural Notes

- Contains zero external library dependencies (uses standard C `stdio.h`, `stdlib.h`, `string.h`).
- Built with bounds checking, null pointer safety, and non-zero exit codes on mathematical or input errors.
- Integrates into the broader multi-language repository ecosystem alongside Python validation scripts and Jupyter analysis notebooks.
