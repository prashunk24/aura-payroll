const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Starting Aura Payroll E2E Browser Demo...');
  const screenshotDir = '/Users/prashunk/.gemini/antigravity/brain/2dc25032-4da4-452e-8c3e-e6ebdc1b1b1f/screenshots';
  
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
    console.log('📁 Created screenshots directory:', screenshotDir);
  }

  // Launch headless browser with a crisp high-DPI viewport.
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2 // Crisp retina-quality screenshots
  });
  
  const page = await context.newPage();

  try {
    // 1. Landing Page
    console.log('🌐 1. Navigating to Landing Page (http://localhost:8080)...');
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(3000); // Wait for glassmorphic animations
    await page.screenshot({ path: path.join(screenshotDir, '1-landing.png') });
    console.log('✅ Captured: 1-landing.png');

    // 2. Click Connect Wallet (on Landing Page Navbar)
    console.log('🔌 2. Opening Wallet Connection Modal from Navbar...');
    await page.click('text=Connect Wallet');
    await page.waitForTimeout(1500); // Wait for Dialog spring transition
    await page.screenshot({ path: path.join(screenshotDir, '2-wallet-modal.png') });
    console.log('✅ Captured: 2-wallet-modal.png');

    // 3. Click Dev Wallet (Mock Mode)
    console.log('🔑 3. Linking Dev Wallet (Mock Mode)...');
    await page.click('text=Dev Wallet (Mock Mode)');
    await page.waitForTimeout(2000); // Wait for mock connection & storage write
    await page.screenshot({ path: path.join(screenshotDir, '3-landing-connected.png') });
    console.log('✅ Captured: 3-landing-connected.png');

    // 4. Open Dashboard
    console.log('📊 4. Opening Dashboard...');
    await page.click('text=Open dashboard');
    await page.waitForTimeout(4000); // Wait for dashboard shell layout & initial stats fetch
    await page.screenshot({ path: path.join(screenshotDir, '4-dashboard-connected.png') });
    console.log('✅ Captured: 4-dashboard-connected.png');

    // 5. Navigate to "Run Payroll" page via Sidebar link
    console.log('💸 5. Navigating to "Run Payroll" workspace page...');
    // Click the sidebar navigation link "Run Payroll"
    await page.click('aside >> text=Run Payroll');
    await page.waitForTimeout(2500); // Wait for transition & flow chart rendering
    await page.screenshot({ path: path.join(screenshotDir, '5-run-payroll-page.png') });
    console.log('✅ Captured: 5-run-payroll-page.png');

    // 6. Click "Run payroll now" to open the Confirmation Dialog
    console.log('🔑 6. Opening Payroll Confirmation Modal...');
    await page.click('text=Run payroll now');
    await page.waitForTimeout(1500); // Wait for modal animation
    await page.screenshot({ path: path.join(screenshotDir, '6-confirm-payroll-modal.png') });
    console.log('✅ Captured: 6-confirm-payroll-modal.png');

    // 7. Click "Confirm & Pay" to submit the payroll batch
    console.log('⚙️ 7. Executing payroll and signing transactions...');
    await page.click('text=Confirm & Pay');
    await page.waitForTimeout(1500); // Wait just enough to capture processing loader state
    await page.screenshot({ path: path.join(screenshotDir, '7-processing-payroll.png') });
    console.log('✅ Captured: 7-processing-payroll.png');

    // 8. Wait for BullMQ Workers to complete the full event pipeline
    console.log('⏳ 8. Waiting 10 seconds for event-driven workers to process pipeline...');
    await page.waitForTimeout(10000);
    await page.screenshot({ path: path.join(screenshotDir, '8-payroll-completed.png') });
    console.log('✅ Captured: 8-payroll-completed.png');

    // 9. Close Modal and Go to Transactions History
    console.log('📋 9. Closing modal...');
    // Click the button inside the modal that says "Done"
    await page.click('button:has-text("Done")');
    await page.waitForTimeout(1500);
    
    // Navigate to Transactions tab in the sidebar
    console.log('📊 10. Navigating to Transactions ledger...');
    await page.click('aside >> text=Transactions');
    await page.waitForTimeout(4000); // Wait for grid layouts and query client sync
    await page.screenshot({ path: path.join(screenshotDir, '9-transactions-history.png') });
    console.log('✅ Captured: 9-transactions-history.png');

    console.log('✨ Aura Payroll browser workflow executed successfully.');

  } catch (error) {
    console.error('❌ Error executing browser workflow:', error);
  } finally {
    await browser.close();
    console.log('🔒 Browser connection closed.');
  }
})();
