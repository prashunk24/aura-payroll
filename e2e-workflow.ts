const BASE_URL = 'http://localhost:3001/api';
const MOCK_WALLET = '3gzpxbhT6UXT7cU8CLateSwEz1Wr23CsZNU8TnjJ75fy';

async function runE2E() {
  console.log('--- Starting Aura Payroll E2E Workflow ---');

  // 1. Login
  console.log('\n1. Logging in with Dev Wallet...');
  let res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: MOCK_WALLET,
      signature: 'mock_signature_for_now',
      message: 'login_request'
    })
  });
  const { token } = await res.json() as any;
  if (!token) throw new Error('Failed to get JWT token');
  console.log('✅ Logged in successfully. Token received.');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // 2. Get Employees
  console.log('\n2. Fetching seeded employees...');
  res = await fetch(`${BASE_URL}/employee/list`, { headers });
  const rawEmployeesData = await res.json() as any;
  if (!Array.isArray(rawEmployeesData)) {
    console.error('Unexpected employee data format:', rawEmployeesData);
    throw new Error('Employees response is not an array.');
  }
  const employees = rawEmployeesData;
  console.log(`✅ Found ${employees.length} employees.`);
  
  if (employees.length === 0) {
    throw new Error('No employees found! Seed script might have failed.');
  }

  const employeeIds = employees.map(e => e.id).join(',');

  // 3. Prepare Batch
  console.log('\n3. Preparing payroll batch...');
  res = await fetch(`${BASE_URL}/payroll/prepare-batch?employeeIds=${employeeIds}`, { headers });
  const rawBatchData = await res.json() as any;
  if (!Array.isArray(rawBatchData)) {
    console.error('Unexpected batch data format:', rawBatchData);
    throw new Error('Batch response is not an array.');
  }
  const batch = rawBatchData;
  console.log(`✅ Prepared ${batch.length} transactions.`);

  // 4. Run Payroll
  console.log('\n4. Executing payroll with mock signatures...');
  for (const item of batch) {
    const mockSig = 'mock_signature_' + Math.random().toString(36).slice(2);
    const runRes = await fetch(`${BASE_URL}/payroll/run`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        employeeId: item.employeeId,
        amount: item.amount,
        signature: mockSig
      })
    });
    const runData = await runRes.json() as any;
    console.log(`   - Employee ${item.employeeName} -> Initial Status: ${runData.status}`);
  }
  console.log('✅ All transactions submitted to backend.');

  // 5. Wait for Workers
  console.log('\n5. Waiting 5 seconds for BullMQ workers to process background tasks (confirm tx -> tax -> yield)...');
  await new Promise(r => setTimeout(r, 5000));

  // 6. Check Transaction History
  console.log('\n6. Fetching updated transaction history...');
  res = await fetch(`${BASE_URL}/payroll/list`, { headers });
  const history = await res.json() as any[];
  console.log(`✅ Transaction History Length: ${history.length}`);
  for (const tx of history.slice(0, 3)) {
    console.log(`   - ID: ${tx.id} | Amount: ${tx.amount} | Status: ${tx.status} | Time: ${new Date(tx.createdAt).toISOString()}`);
  }

  // 7. Check Dashboard Stats
  console.log('\n7. Fetching dashboard stats...');
  res = await fetch(`${BASE_URL}/stats/overview`, { headers });
  const stats = await res.json() as any;
  console.log(`✅ Organization Overview:`);
  console.log(`   - Total Employees: ${stats.totalEmployees}`);
  console.log(`   - Total Payroll Processed: $${stats.totalPayroll}`);

  console.log('\n--- E2E Workflow Completed Successfully ---');
}

runE2E().catch(err => {
  console.error('❌ E2E Test Failed:', err);
  process.exit(1);
});
