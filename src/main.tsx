import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type TestStatus = 'passed' | 'failed' | 'skipped';
type TestArea = 'Authentication' | 'Checkout' | 'Reporting' | 'Mobile';

type TestRun = {
  id: number;
  name: string;
  area: TestArea;
  status: TestStatus;
  durationMs: number;
  browser: 'chromium' | 'firefox' | 'webkit';
  owner: string;
};

const seedRuns: TestRun[] = [
  { id: 1, name: 'login page loads', area: 'Authentication', status: 'passed', durationMs: 118, browser: 'chromium', owner: 'Platform QA' },
  { id: 2, name: 'SSO redirects users', area: 'Authentication', status: 'passed', durationMs: 276, browser: 'chromium', owner: 'Identity' },
  { id: 3, name: 'checkout button validates cart', area: 'Checkout', status: 'passed', durationMs: 242, browser: 'chromium', owner: 'Commerce' },
  { id: 4, name: 'empty cart blocks payment', area: 'Checkout', status: 'failed', durationMs: 333, browser: 'firefox', owner: 'Commerce' },
  { id: 5, name: 'quality trend report renders', area: 'Reporting', status: 'passed', durationMs: 401, browser: 'webkit', owner: 'Insights' },
  { id: 6, name: 'legacy browser payment test', area: 'Mobile', status: 'skipped', durationMs: 0, browser: 'webkit', owner: 'Mobile QA' }
];

function App() {
  const [runs, setRuns] = useState<TestRun[]>(seedRuns);
  const [statusFilter, setStatusFilter] = useState<'all' | TestStatus>('all');
  const [areaFilter, setAreaFilter] = useState<'all' | TestArea>('all');

  const summary = useMemo(() => {
    const total = runs.length;
    const passed = runs.filter((run) => run.status === 'passed').length;
    const failed = runs.filter((run) => run.status === 'failed').length;
    const skipped = runs.filter((run) => run.status === 'skipped').length;
    const executionTime = runs.reduce((sum, run) => sum + run.durationMs, 0);
    const successDensity = total === 0 ? 0 : Math.round((passed / total) * 100);
    return { total, passed, failed, skipped, executionTime, successDensity };
  }, [runs]);

  const visibleRuns = runs.filter((run) => {
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    const matchesArea = areaFilter === 'all' || run.area === areaFilter;
    return matchesStatus && matchesArea;
  });

  const showIncidentPanel = new URLSearchParams(globalThis.location.search).has('incident');

  const areaHealth = useMemo(() => {
    return ['Authentication', 'Checkout', 'Reporting', 'Mobile'].map((area) => {
      const areaRuns = runs.filter((run) => run.area === area);
      const passed = areaRuns.filter((run) => run.status === 'passed').length;
      const failed = areaRuns.filter((run) => run.status === 'failed').length;
      const skipped = areaRuns.filter((run) => run.status === 'skipped').length;
      return { area, total: areaRuns.length, passed, failed, skipped };
    });
  }, [runs]);

  function addPassingRun() {
    setRuns((current) => [
      ...current,
      {
        id: current.length + 1,
        name: `generated smoke test ${current.length + 1}`,
        area: 'Reporting',
        status: 'passed',
        durationMs: 150 + current.length * 7,
        browser: 'chromium',
        owner: 'Automation'
      }
    ]);
  }

  function markCheckoutFixed() {
    setRuns((current) => current.map((run) => run.name === 'empty cart blocks payment' ? { ...run, status: 'passed' } : run));
  }

  function resetRuns() {
    setRuns(seedRuns);
    setStatusFilter('all');
    setAreaFilter('all');
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">SonarQube + Playwright</p>
        <h1>Playwright test metrics demo</h1>
        <p>
          This app creates enough browser-test activity to show what SonarQube Cloud imports from
          Playwright: test counts, failures, skipped tests, execution time, and success density.
        </p>
      </section>

      <section className="cards" aria-label="Test metric summary">
        <MetricCard label="Tests" value={summary.total} testId="metric-tests" />
        <MetricCard label="Passed" value={summary.passed} testId="metric-passed" />
        <MetricCard label="Failed" value={summary.failed} testId="metric-failed" />
        <MetricCard label="Skipped" value={summary.skipped} testId="metric-skipped" />
        <MetricCard label="Success density" value={`${summary.successDensity}%`} testId="metric-success-density" />
        <MetricCard label="Execution time" value={`${summary.executionTime}ms`} testId="metric-duration" />
      </section>

      <section className="grid-two">
        <section className="panel">
          <div className="toolbar">
            <label htmlFor="status-filter">Filter by status</label>
            <select
              id="status-filter"
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            >
              <option value="all">All</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="skipped">Skipped</option>
            </select>

            <label htmlFor="area-filter">Filter by area</label>
            <select
              id="area-filter"
              aria-label="Filter by area"
              value={areaFilter}
              onChange={(event) => setAreaFilter(event.target.value as typeof areaFilter)}
            >
              <option value="all">All</option>
              <option value="Authentication">Authentication</option>
              <option value="Checkout">Checkout</option>
              <option value="Reporting">Reporting</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>

          <div className="toolbar">
            <button type="button" onClick={addPassingRun}>Add passing run</button>
            <button type="button" onClick={markCheckoutFixed}>Mark checkout fixed</button>
            <button type="button" className="secondary" onClick={resetRuns}>Reset</button>
          </div>

          <ul className="runs" aria-label="Test runs">
            {visibleRuns.map((run) => (
              <li key={run.id} data-testid="test-run-row">
                <span className={`status ${run.status}`}>{run.status}</span>
                <strong>{run.name}</strong>
                <span>{run.area}</span>
                <span>{run.browser}</span>
                <span>{run.owner}</span>
                <span>{run.durationMs}ms</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel" aria-label="Area health">
          <h2>Area health</h2>
          <ul className="area-list">
            {areaHealth.map((area) => (
              <li key={area.area} data-testid="area-health-row">
                <strong>{area.area}</strong>
                <span>{area.passed} passed</span>
                <span>{area.failed} failed</span>
                <span>{area.skipped} skipped</span>
              </li>
            ))}
          </ul>
        </section>
      </section>

      {showIncidentPanel ? renderIncidentDrilldown(runs) : null}
    </main>
  );
}

function renderIncidentDrilldown(runs: TestRun[]) {
  const failingRuns = runs.filter((run) => run.status === 'failed');
  const skippedRuns = runs.filter((run) => run.status === 'skipped');
  const slowestRun = [...runs].sort((left, right) => right.durationMs - left.durationMs)[0];

  return (
    <section className="panel incident-panel" aria-label="Incident drilldown">
      <h2>Incident drilldown</h2>
      <p>Failing tests that need triage: {failingRuns.length}</p>
      <p>Skipped tests waiting for enablement: {skippedRuns.length}</p>
      <p>Slowest observed run: {slowestRun.name}</p>
      <button type="button" onClick={() => globalThis.alert('Escalation created')}>
        Create escalation
      </button>
    </section>
  );
}

function MetricCard({ label, value, testId }: Readonly<{ label: string; value: number | string; testId: string }>) {
  return (
    <article className="card" data-testid={testId}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
