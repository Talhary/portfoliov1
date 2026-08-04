import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ALL_TOOLS } from '@/lib/tools/registry';

/**
 * Guards the registry <-> job-runner contract.
 *
 * The original bug class: a tool marked `isAsync` with no matching `case` in the
 * runner fell through to a `default` branch that reported COMPLETED with a
 * generic message, so the frontend rendered a success with no real result.
 * Conversely, a tool with a handler but `isAsync: false` never showed the job UI
 * at all, so its output could never reach the user.
 */

const runnerSource = fs.readFileSync(
  path.join(process.cwd(), 'lib', 'tools', 'job-runner.ts'),
  'utf8',
);

const handledToolIds = new Set(
  Array.from(runnerSource.matchAll(/case\s+'([^']+)':/g)).map((m) => m[1]),
);

const asyncTools = ALL_TOOLS.filter((t) => t.isAsync);

describe('registry / job-runner contract', () => {
  it('has async tools to verify', () => {
    expect(asyncTools.length).toBeGreaterThan(0);
  });

  it('every isAsync tool has a server-side handler', () => {
    const missing = asyncTools
      .filter((t) => !handledToolIds.has(t.id))
      .map((t) => t.id);

    expect(missing, `isAsync tools with no runner case: ${missing.join(', ')}`).toEqual([]);
  });

  it('every runner handler corresponds to a registered tool', () => {
    const registeredIds = new Set(ALL_TOOLS.map((t) => t.id));
    // The runner intentionally accepts a couple of legacy slug aliases.
    const knownAliases = new Set(['image-to-text-ocr']);

    const orphaned = Array.from(handledToolIds).filter(
      (id) => !registeredIds.has(id) && !knownAliases.has(id),
    );

    expect(orphaned, `runner cases with no registry entry: ${orphaned.join(', ')}`).toEqual([]);
  });

  it('every tool with a handler is reachable from the job UI', () => {
    const unreachable = ALL_TOOLS.filter(
      (t) => handledToolIds.has(t.id) && !t.isAsync,
    ).map((t) => t.id);

    expect(
      unreachable,
      `tools with handlers but isAsync=false (results never reach UI): ${unreachable.join(', ')}`,
    ).toEqual([]);
  });

  it('does not silently report success for unhandled tools', () => {
    // The default branch must throw rather than mark the job COMPLETED.
    const defaultBranch = runnerSource.slice(runnerSource.lastIndexOf('default: {'));
    expect(defaultBranch).toMatch(/throw new Error/);
    expect(defaultBranch).not.toMatch(/status:\s*'COMPLETED'/);
  });

  it('has unique tool ids and slugs', () => {
    const ids = ALL_TOOLS.map((t) => t.id);
    const slugs = ALL_TOOLS.map((t) => t.slug);
    expect(new Set(ids).size, 'duplicate tool ids').toBe(ids.length);
    expect(new Set(slugs).size, 'duplicate tool slugs').toBe(slugs.length);
  });
});
