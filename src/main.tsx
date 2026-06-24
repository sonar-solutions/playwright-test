import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type TestRun = {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  durationMs: number;
};

const seedRuns: TestRun[] = [
  { name: 'login page loads', status: 'passed', durationMs: 118 },
  { name: 'checkout button validates cart', status: 'passed', durationMs: 242 },
  { name: 'legacy browser payment test', status: 'skipped', durationMs: 0 }
];

function App() {
  const [runs, setRuns] = useState<TestRun[]>(seedRuns);
  const [filter, setFilter] = useState<'all' | TestRun['status']>('all');

  const summary = useMemo(() => {
    const total = runs.length;
    const passed = runs.filter((run) => run.status === 'passed').length;
    const failed = runs.filter((run) => run.status === 'failed').length;
    const skipped = runs.filter((run) => run.status === 'skipped').length;
    const executionTime = runs.reduce((sum, run) => sum + run.durationMs, 0);
    const successDensity = total === 0 ? 0 : Math.round((passed / total) * 100);
    return { total, passed, failed, skipped, executionTime, successDensity };
  }, [runs]);

  const visibleRuns = filter === 'all' ? runs : runs.filter((run) => run.status === filter);

  function addPassingRun() {
    setRuns((current) => [
      ...current,
      { name: `generated smoke test ${current.length + 1}`, status: 'passed', durationMs: 150 + current.length * 7 }
    ]);
  }

  function resetRuns() {
    setRuns(seedRuns);
    setFilter('all');
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">SonarQube + Playwright</p>
        <h1>Playwright test metrics demo</h1>
        <p>
          This small app exists so Playwright can exercise a real browser flow and generate
          SonarQube-compatible test execution XML during CI.
        </p>
      </section>

      <section className="cards" aria-label="Test metric summary">
        <MetricCard label="Tests" value={summary.total} testId="metric-tests" />
        <MetricCard label="Passed" value={summary.passed} testId="metric-passed" />
        <MetricCard label="Skipped" value={summary.skipped} testId="metric-skipped" />
        <MetricCard label="Success density" value={`${summary.successDensity}%`} testId="metric-success-density" />
        <MetricCard label="Execution time" value={`${summary.executionTime}ms`} testId="metric-duration" />
      </section>

      <section className="panel">
        <div className="toolbar">
          <label htmlFor="status-filter">Filter by status</label>
          <select
            id="status-filter"
            aria-label="Filter by status"
            value={filter}
            onChange={(event) => setFilter(event.target.value as typeof filter)}
          >
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="skipped">Skipped</option>
          </select>
          <button type="button" onClick={addPassingRun}>Add passing run</button>
          <button type="button" className="secondary" onClick={resetRuns}>Reset</button>
        </div>

        <ul className="runs" aria-label="Test runs">
          {visibleRuns.map((run) => (
            <li key={`${run.name}-${run.durationMs}`} data-testid="test-run-row">
              <span className={`status ${run.status}`}>{run.status}</span>
              <strong>{run.name}</strong>
              <span>{run.durationMs}ms</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function MetricCard({ label, value, testId }: { label: string; value: number | string; testId: string }) {
  return (
    <article className="card" data-testid={testId}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
