class CustomReporter {
  onBegin(config, suite) {
    console.log(`\n[REPORT] Starting ${suite.allTests().length} tests using ${suite.project?.name || 'default project'}...`);
  }

  onTestEnd(test, result) {
    if (result.status !== 'passed') {
      console.log(`[REPORT] ${test.title} finished with status: ${result.status}`);
    }
  }

  onEnd(result) {
    console.log(`[REPORT] Test run finished: ${result.status}`);
  }
}

module.exports = CustomReporter;
