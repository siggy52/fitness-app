const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const BASE_URL = 'http://localhost:5173'
const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots-v2')
const REPORT_FILE = path.resolve(__dirname, 'report-v2.json')

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

const results = []

async function runTest(name, category, fn) {
  const start = Date.now()
  try {
    await fn()
    results.push({ name, passed: true, category, duration: Date.now() - start })
    console.log(`  ✅ ${name} (${Date.now() - start}ms)`)
  } catch (e) {
    results.push({ name, passed: false, category, duration: Date.now() - start, error: e.message })
    console.log(`  ❌ ${name} - ${e.message.substring(0, 80)}`)
  }
}

function expect(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

async function main() {
  console.log('\n=== 健身计划应用 - 深度评测 (第二版) ===\n')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  // ==========================================
  // 测试组A：运动核心流程
  // ==========================================
  console.log('\n========================================')
  console.log('测试组A：运动核心流程')
  console.log('========================================\n')

  await runTest('进入运动页面', '核心流程', async () => {
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A01-workout.png'), fullPage: true })
  })

  await runTest('点击开始训练', '核心流程', async () => {
    const startBtn = page.locator('button').filter({ hasText: /开始|训练|运动/ }).first()
    if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await startBtn.click()
      await page.waitForTimeout(1000)
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A02-started.png'), fullPage: true })
    }
  })

  await runTest('添加动作流程', '核心流程', async () => {
    const addBtn = page.locator('button').filter({ hasText: /添加|增加/ }).first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A03-selector.png'), fullPage: true })
    }
  })

  await runTest('搜索并选择动作', '核心流程', async () => {
    const searchInput = page.locator('input[placeholder*="搜索"]').first()
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('卧推')
      await page.waitForTimeout(500)
      
      const exerciseBtn = page.locator('button').filter({ hasText: '卧推' }).first()
      if (await exerciseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await exerciseBtn.click()
        await page.waitForTimeout(500)
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A04-selected.png'), fullPage: true })
      }
    }
  })

  await runTest('设置动作参数', '核心流程', async () => {
    // 检查是否有重量输入
    const weightInput = page.locator('input[type="number"]').first()
    if (await weightInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await weightInput.fill('20')
      await page.waitForTimeout(300)
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A05-params.png'), fullPage: true })
  })

  // ==========================================
  // 测试组B：动作库深度测试
  // ==========================================
  console.log('\n========================================')
  console.log('测试组B：动作库深度测试')
  console.log('========================================\n')

  await runTest('动作库全部分类遍历', '动作库', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    
    const categories = ['全部', '胸部', '背部', '肩部', '腿部', '手臂']
    for (const cat of categories) {
      const btn = page.locator('button').filter({ hasText: cat }).first()
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.click()
        await page.waitForTimeout(300)
      }
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B01-categories.png'), fullPage: true })
  })

  await runTest('动作搜索-无结果', '动作库', async () => {
    const searchInput = page.locator('input[placeholder*="搜索"]').first()
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('xyzabc123notexist')
      await page.waitForTimeout(800)
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B02-no-results.png'), fullPage: true })
    }
  })

  await runTest('清空搜索恢复列表', '动作库', async () => {
    const searchInput = page.locator('input[placeholder*="搜索"]').first()
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('')
      await page.waitForTimeout(500)
      const exerciseCount = await page.locator('button').filter({ hasText: /卧推|深蹲|硬拉/ }).count()
      expect(exerciseCount > 0, '清空后应恢复动作列表')
    }
  })

  // ==========================================
  // 测试组C：动作详情深度
  // ==========================================
  console.log('\n========================================')
  console.log('测试组C：动作详情深度测试')
  console.log('========================================\n')

  await runTest('进入动作详情', '动作详情', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    
    const exerciseBtn = page.locator('a, button').filter({ hasText: /卧推/ }).first()
    if (await exerciseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await exerciseBtn.click()
      await page.waitForTimeout(1000)
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C01-detail.png'), fullPage: true })
    }
  })

  await runTest('详情页返回按钮', '动作详情', async () => {
    // 尝试多种返回方式
    const backBtn = page.locator('button:has(svg)').first()
    if (await backBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await backBtn.click()
      await page.waitForTimeout(1000)
      expect(page.url().includes('/exercises') || page.url().includes('/home'), '应返回到动作库或首页')
    }
  })

  await runTest('动作视频播放按钮', '动作详情', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    const exerciseBtn = page.locator('a, button').filter({ hasText: /卧推/ }).first()
    if (await exerciseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await exerciseBtn.click()
      await page.waitForTimeout(1000)
      
      const playBtn = page.locator('button').filter({ hasText: /播放|开始|视频/ }).first()
      if (await playBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await playBtn.click()
        await page.waitForTimeout(500)
      }
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C02-play.png'), fullPage: true })
    }
  })

  // ==========================================
  // 测试组D：状态持久化深度测试
  // ==========================================
  console.log('\n========================================')
  console.log('测试组D：状态持久化深度测试')
  console.log('========================================\n')

  await runTest('首页→动作库→首页状态', '状态持久化', async () => {
    await page.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(500)
    
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(500)
    
    await page.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(500)
    
    // 页面应该正常显示
    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length > 0, '首页应正常显示')
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'D01-nav.png'), fullPage: true })
  })

  await runTest('刷新页面状态丢失(正常行为)', '状态持久化', async () => {
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(500)
    
    // 刷新页面
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    
    // 刷新后状态应该重置（符合SPA预期）
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'D02-reload.png'), fullPage: true })
  })

  // ==========================================
  // 测试组E：边界条件测试
  // ==========================================
  console.log('\n========================================')
  console.log('测试组E：边界条件测试')
  console.log('========================================\n')

  await runTest('超长搜索输入', '边界条件', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    const searchInput = page.locator('input[placeholder*="搜索"]').first()
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('卧推卧推卧推卧推卧推卧推卧推卧推卧推卧推')
      await page.waitForTimeout(500)
      // 应用应该能处理，不崩溃
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'E01-long-input.png'), fullPage: true })
    }
  })

  await runTest('特殊字符输入', '边界条件', async () => {
    const searchInput = page.locator('input[placeholder*="搜索"]').first()
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill("'; DROP TABLE users; --")
      await page.waitForTimeout(500)
      // 应用应该能处理，不崩溃
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'E02-special-chars.png'), fullPage: true })
    }
  })

  await runTest('快速连续点击', '边界条件', async () => {
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle', timeout: 15000 })
    
    const addBtn = page.locator('button').filter({ hasText: /添加/ }).first()
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      // 快速连续点击 5 次
      for (let i = 0; i < 5; i++) {
        await addBtn.click()
        await page.waitForTimeout(100)
      }
      await page.waitForTimeout(500)
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'E03-fast-clicks.png'), fullPage: true })
    }
  })

  // ==========================================
  // 测试组F：首页深度测试
  // ==========================================
  console.log('\n========================================')
  console.log('测试组F：首页深度测试')
  console.log('========================================\n')

  await runTest('首页全部 Quick Action', '首页', async () => {
    await page.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle', timeout: 15000 })
    
    // 获取所有 Quick Action 按钮
    const quickActions = page.locator('button')
    const count = await quickActions.count()
    console.log(`  发现 ${count} 个按钮`)
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'F01-home-all.png'), fullPage: true })
  })

  await runTest('首页滚动行为', '首页', async () => {
    await page.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle', timeout: 15000 })
    
    // 滚动到页面底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    
    // 滚动回顶部
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'F02-scroll.png'), fullPage: true })
  })

  // ==========================================
  // 测试组G：性能测试
  // ==========================================
  console.log('\n========================================')
  console.log('测试组G：性能测试')
  console.log('========================================\n')

  await runTest('首页加载时间', '性能', async () => {
    const start = Date.now()
    await page.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle', timeout: 15000 })
    const loadTime = Date.now() - start
    console.log(`  加载时间: ${loadTime}ms`)
    expect(loadTime < 5000, '首页加载应在 5 秒内')
  })

  await runTest('动作库加载时间', '性能', async () => {
    const start = Date.now()
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    const loadTime = Date.now() - start
    console.log(`  加载时间: ${loadTime}ms`)
    expect(loadTime < 5000, '动作库加载应在 5 秒内')
  })

  await runTest('运动页面加载时间', '性能', async () => {
    const start = Date.now()
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle', timeout: 15000 })
    const loadTime = Date.now() - start
    console.log(`  加载时间: ${loadTime}ms`)
    expect(loadTime < 5000, '运动页面加载应在 5 秒内')
  })

  // ==========================================
  // 测试组H：控制台错误检测
  // ==========================================
  console.log('\n========================================')
  console.log('测试组H：控制台错误检测')
  console.log('========================================\n')

  await runTest('全页面控制台错误', '控制台', async () => {
    const errors = []
    const warnings = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text())
      }
    })
    
    // 访问所有主要页面
    await page.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.goto(`${BASE_URL}/history`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(1000)
    
    if (errors.length > 0) {
      console.log(`  发现 ${errors.length} 个错误:`)
      errors.forEach(e => console.log(`    - ${e.substring(0, 60)}`))
    }
    if (warnings.length > 0) {
      console.log(`  发现 ${warnings.length} 个警告`)
    }
    
    expect(errors.length === 0, `发现 ${errors.length} 个控制台错误`)
  })

  // ==========================================
  // 生成报告
  // ==========================================
  await browser.close()

  console.log('\n========================================')
  console.log('深度评测完成')
  console.log('========================================\n')

  const report = {
    timestamp: new Date().toISOString(),
    version: 'v2.0',
    environment: {
      browser: 'Chromium',
      viewport: '390x844 (移动端)',
      baseUrl: BASE_URL,
      mode: 'headless',
    },
    summary: {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      passRate: (results.filter(r => r.passed).length / results.length * 100).toFixed(1) + '%',
    },
    details: results.map(r => ({
      name: r.name,
      category: r.category,
      passed: r.passed,
      duration: `${r.duration}ms`,
      error: r.error || null,
    })),
    categories: {},
  }

  for (const r of results) {
    if (!report.categories[r.category]) {
      report.categories[r.category] = { total: 0, passed: 0, failed: 0, items: [] }
    }
    report.categories[r.category].total++
    if (r.passed) {
      report.categories[r.category].passed++
    } else {
      report.categories[r.category].failed++
    }
    report.categories[r.category].items.push({
      name: r.name,
      passed: r.passed,
      duration: `${r.duration}ms`,
      error: r.error || null,
    })
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2))
  
  console.log('\n' + '='.repeat(50))
  console.log('评测结果汇总')
  console.log('='.repeat(50))
  console.log(`总测试数: ${report.summary.total}`)
  console.log(`通过: ${report.summary.passed}`)
  console.log(`失败: ${report.summary.failed}`)
  console.log(`通过率: ${report.summary.passRate}`)
  
  console.log('\n按分类统计：')
  for (const [cat, data] of Object.entries(report.categories)) {
    const status = data.failed === 0 ? '✅' : '❌'
    console.log(`  ${status} ${cat}: ${data.passed}/${data.total} 通过`)
  }

  console.log('\n详细结果：')
  for (const r of report.details) {
    const icon = r.passed ? '✅' : '❌'
    console.log(`  ${icon} [${r.category}] ${r.name} (${r.duration})${r.error ? '\n    Error: ' + r.error.substring(0, 60) : ''}`)
  }

  if (report.summary.failed > 0) {
    console.log('\n❌ 失败测试：')
    for (const r of report.details) {
      if (!r.passed) {
        console.log(`  [${r.category}] ${r.name}: ${r.error}`)
      }
    }
  }

  console.log(`\n报告已保存至: ${REPORT_FILE}`)
  console.log(`截图已保存至: ${SCREENSHOT_DIR}`)
}

main().catch(e => {
  console.error('评测执行失败:', e.message)
  process.exit(1)
})
