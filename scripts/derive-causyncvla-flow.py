#!/usr/bin/env python3
"""Reproduce the representative flow projection in DualSys/scripts/plot_pfws_flow.py.

Usage: python scripts/derive-causyncvla-flow.py TASK0_STEP20_NPZ PFWS_FLOW_GEOMETRY_JSON
The NPZ remains in its research archive; only the derived projection is published.
"""
from pathlib import Path
import hashlib
import json
import sys

import numpy as np

source, receipt = map(Path, sys.argv[1:3])
with np.load(source) as data:
    cold = data['cold'][..., :7].reshape(8, 41, 70)
    warm = data['warm'][..., :7].reshape(8, 21, 70)
    flat = np.concatenate([cold.reshape(-1, 70), warm.reshape(-1, 70)])
    center = flat.mean(0)
    _, singular, vh = np.linalg.svd(flat - center, full_matrices=False)
    basis = vh[:2].T
    variance = float((singular[:2] ** 2).sum() / (singular ** 2).sum())
    expected = json.loads(receipt.read_text())['projection_explained_variance']
    # SVD's axis signs are arbitrary. The ratio itself must agree with the paper.
    if not np.isclose(variance, expected, atol=1e-6, rtol=0):
        raise ValueError(f'PCA variance differs from paper: {variance} vs {expected}')
    projected = {'cold': (cold - center) @ basis, 'warm': (warm - center) @ basis}
    velocities = {arm: data[arm + '_v'][..., :7].reshape(8, -1, 70) for arm in ('cold', 'warm')}
    result = {
        'source': 'task0_step20.npz',
        'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        'context': 'task0_step20',
        'coordinates': 'PCA of 70 active action coordinates, normalized model units',
        'projection': 'PCA jointly fitted to all 8 cold and 8 warm paths; no smoothing',
        'arrows': 'At velocity indices 3, 11, ... before the final two samples; vectors are -0.1 times velocity projected into the shared basis',
        'explained_variance': variance,
        'paper_explained_variance': expected,
        'paths': [
            {
                'arm': arm,
                'seed': seed,
                'points': np.round(path, 6).tolist(),
                'arrows': [
                    {
                        'index': int(index),
                        'vector': np.round(-0.1 * (velocities[arm][seed, index] @ basis), 6).tolist(),
                    }
                    for index in np.arange(3, len(velocities[arm][seed]) - 2, 8)
                ],
            }
            for arm in ('cold', 'warm')
            for seed, path in enumerate(projected[arm])
        ],
    }
    assert all(np.isfinite(path['points']).all() for path in result['paths'])
    assert len(result['paths']) == 16
    assert [len(path['points']) for path in result['paths']] == [41] * 8 + [21] * 8
    assert [[a['index'] for a in path['arrows']] for path in result['paths']] == [[3, 11, 19, 27, 35]] * 8 + [[3, 11]] * 8
    assert all(np.isfinite(a['vector']).all() for path in result['paths'] for a in path['arrows'])

output = Path(__file__).resolve().parents[1] / 'src/data/causyncvla/flow-projection.json'
output.write_text(json.dumps(result, separators=(',', ':')) + '\n')
print(f'{output}: variance {variance:.9f}, paper {expected:.9f}; source {result["source_sha256"]}')
