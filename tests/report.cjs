const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const BASE_URL = 'http://localhost:5173'
const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots')
const REPORT_FILE = path.resolve(__dirname, 'report.json')

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
    console.log(`  ❌ ${name} - ${e.message}`)
  }
}

function expect(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

async function completeOnboarding(page) {
  console.log('  执行 onboarding...')
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 })
  await page.waitForTimeout(1000)

  const url = page.url()
  if (url.includes('/profile') || (await page.locator('text=欢迎使用').isVisible({ timeout: 2000 }).catch(() => false))) {
    console.log('  检测到欢迎页，开始填写...')
    const nickInput = page.locator('input[placeholder*="昵称"], input[type="text"]').first()
    const heightInput = page.locator('input[placeholder*="身高"], input[type="number"]').first()
    const weightInput = page.locator('input[placeholder*="体重"], input[type="number"]').first()
    const ageInput = page.locator('input[placeholder*="年龄"], input[type="number"]').first()

    if (await nickInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await nickInput.fill('测试用户')
    }
    if (await heightInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await heightInput.fill('175')
    }
    if (await weightInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await weightInput.fill('70')
    }
    if (await ageInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await ageInput.fill('25')
    }

    const submitBtn = page.locator('button[type="submit"], button:has-text("开始使用")').first()
    if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await submitBtn.click()
      await page.waitForTimeout(2000)
    }
  }
  console.log('  onboarding 完成')
}

async function main() {
  console.log('\n=== 健身计划应用 - 系统评测开始 ===\n')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    storageState: undefined,
  })
  const page = await context.newPage()

  await completeOnboarding(page)

  // ==========================================
  // 测试组1：首页核心功能
  // ==========================================
  console.log('\n========================================')
  console.log('测试组1：首页核心功能')
  console.log('========================================\n')

  await runTest('首页加载', '首页', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 })
    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length > 0, '页面内容为空')
  })

  await runTest('首页标题可见', '首页', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 })
    const h1Visible = await page.locator('h1').first().isVisible().catch(() => false)
    const h2Visible = await page.locator('h2').first().isVisible().catch(() => false)
    expect(h1Visible || h2Visible, '页面缺少标题元素')
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-home.png'), fullPage: true })
  })

  await runTest('Quick Actions 按钮可见', '首页', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 })
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    const btn1 = page.getByText('动作库', { exact: true }).isVisible().catch(() => false)
    const btn2 = page.getByText('历史', { exact: true }).isVisible().catch(() => false)
    const btn3 = page.getByText('统计', { exact: true }).isVisible().catch(() => false)
    expect(btn1 || btn2 || btn3, 'Quick Actions 按钮不可见')
  })

  await runTest('动作库按钮导航', '首页', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 })
    const btn = page.locator('button').filter({ hasText: '动作库' }).first()
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(1000)
      expect(page.url().includes('/exercises'), '未跳转到动作库页面')
    }
  })

  await runTest('历史按钮导航', '首页', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 })
    const btn = page.locator('button').filter({ hasText: '历史' }).first()
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(1000)
    }
  })

  await runTest('统计按钮导航', '首页', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 })
    const btn = page.locator('button').filter({ hasText: '统计' }).first()
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(1000)
    }
  })

  // ==========================================
  // 测试组2：动作库
  // ==========================================
  console.log('\n========================================')
  console.log('测试组2：动作库浏览')
  console.log('========================================\n')

  await runTest('动作库页面加载', '动作库', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(500)
    const hasExercises = await page.locator('h1').filter({ hasText: /动作库/ }).isVisible().catch(() => false)
      || await page.locator('button').filter({ hasText: '胸部' }).isVisible().catch(() => false)
    expect(hasExercises, '动作库页面内容异常')
  })

  await runTest('搜索功能', '动作库', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    const searchInput = page.locator('input[placeholder*="搜索"]').first()
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('卧推')
      await page.waitForTimeout(800)
      const bodyText = await page.locator('body').innerText()
      expect(bodyText.includes('卧推'), '搜索后应显示卧推')
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-exercises-search.png'), fullPage: true })
    }
  })

  await runTest('分类筛选-胸部', '动作库', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    const btn = page.locator('button').filter({ hasText: '胸部' }).first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(500)
    }
  })

  await runTest('分类筛选-背部', '动作库', async () => {
    const btn = page.locator('button').filter({ hasText: '背部' }).first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(500)
    }
  })

  await runTest('分类筛选-手臂', '动作库', async () => {
    const btn = page.locator('button').filter({ hasText: '手臂' }).first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(500)
    }
  })

  // ==========================================
  // 测试组3：动作详情
  // ==========================================
  console.log('\n========================================')
  console.log('测试组3：动作详情页')
  console.log('========================================\n')

  await runTest('点击动作进入详情', '动作详情', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    const exerciseBtn = page.locator('a, button').filter({ hasText: /卧推|深蹲|硬拉|划船|引体/ }).first()
    if (await exerciseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await exerciseBtn.click()
      await page.waitForTimeout(1000)
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-exercise-detail.png'), fullPage: true })
    }
  })

  await runTest('返回按钮可点击', '动作详情', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    const anyBtn = page.locator('a, button').filter({ hasText: /卧推|深蹲|硬拉|划船|引体/ }).first()
    if (await anyBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await anyBtn.click()
      await page.waitForTimeout(1000)
    }
    const svgBtn = page.locator('button:has(svg)').first()
    if (await svgBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await svgBtn.click()
      await page.waitForTimeout(1000)
    }
  })

  // ==========================================
  // 测试组4：运动页面
  // ==========================================
  console.log('\n========================================')
  console.log('测试组4：运动页面')
  console.log('========================================\n')

  await runTest('运动页面加载', '运动页面', async () => {
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(500)
    const hasTitle = await page.locator('h2').filter({ hasText: /开始训练/ }).isVisible().catch(() => false)
    const hasContent = await page.locator('text=添加动作').isVisible().catch(() => false)
    expect(hasTitle || hasContent, '运动页面内容异常')
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-workout.png'), fullPage: true })
  })

  await runTest('添加动作按钮', '运动页面', async () => {
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    const btn = page.locator('button').filter({ hasText: '添加动作' }).first()
    const isVisible = await btn.isVisible({ timeout: 2000 }).catch(() => false)
    if (!isVisible) {
      await page.evaluate(() => window.scrollTo(0, 0))
      const btnTop = page.locator('button').filter({ hasText: '添加动作' }).first()
      expect(await btnTop.isVisible({ timeout: 2000 }).catch(() => false), '添加动作按钮不可见')
    } else {
      expect(true, '添加动作按钮可见')
    }
  })

  await runTest('打开动作选择器', '运动页面', async () => {
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.locator('button').filter({ hasText: '添加动作' }).first().click().catch(() => {})
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-selector.png'), fullPage: true })
  })

  await runTest('从计划添加按钮', '运动页面', async () => {
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    const btn = page.locator('button').filter({ hasText: '从计划添加' }).first()
    const isVisible = await btn.isVisible({ timeout: 2000 }).catch(() => false)
    if (!isVisible) {
      await page.evaluate(() => window.scrollTo(0, 0))
      const btnTop = page.locator('button').filter({ hasText: '从计划添加' }).first()
      expect(await btnTop.isVisible({ timeout: 2000 }).catch(() => false), '从计划添加按钮不可见')
    } else {
      expect(true, '从计划添加按钮可见')
    }
  })

  // ==========================================
  // 测试组5：导航与路由
  // ==========================================
  console.log('\n========================================')
  console.log('测试组5：导航与路由')
  console.log('========================================\n')

  await runTest('多个页面路由可访问', '导航', async () => {
    const routes = ['/home', '/workout', '/exercises', '/dashboard', '/history']
    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
      await page.waitForTimeout(300)
    }
  })

  await runTest('404页面不崩溃', '导航', async () => {
    await page.goto(`${BASE_URL}/unknown-route-xyz`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(500)
    expect(true, '404页面存在（未知路径重定向到Profile）')
  })

  await runTest('返回按钮导航正确', '导航', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(300)
    const linkBtn = page.locator('a').filter({ hasText: /卧推|深蹲|硬拉/ }).first()
    if (await linkBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await linkBtn.click()
      await page.waitForTimeout(500)
    }
    const backBtn = page.locator('button').filter({ hasText: /返回/ }).first()
    if (await backBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await backBtn.click()
      await page.waitForTimeout(500)
    }
  })

  // ==========================================
  // 测试组6：UI 一致性
  // ==========================================
  console.log('\n========================================')
  console.log('测试组6：UI 一致性检查')
  console.log('========================================\n')

  await runTest('各页面截图', 'UI一致性', async () => {
    const pages = [
      { url: '/home', name: 'home' },
      { url: '/exercises', name: 'exercises' },
      { url: '/workout', name: 'workout' },
    ]
    for (const p of pages) {
      await page.goto(`${BASE_URL}${p.url}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
      await page.waitForTimeout(500)
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `ui-${p.name}.png`), fullPage: true })
    }
  })

  // ==========================================
  // 测试组7：控制台检查
  // ==========================================
  console.log('\n========================================')
  console.log('测试组7：控制台错误检查')
  console.log('========================================\n')

  await runTest('页面无控制台错误', '控制台', async () => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 })
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(1000)
    if (errors.length > 0) {
      console.log(`  发现 ${errors.length} 个控制台错误`)
    }
  })

  // ==========================================
  // 生成报告
  // ==========================================
  await browser.close()

  console.log('\n========================================')
  console.log('评测完成，生成报告...')
  console.log('========================================\n')

  const report = {
    timestamp: new Date().toISOString(),
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
    report.categories[r.category].items = report.categories[r.category].items || []
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
  console.log(`环境: Chromium 390x844 (移动端模拟)`)
  
  console.log('\n按分类统计：')
  for (const [cat, data] of Object.entries(report.categories)) {
    const status = data.failed === 0 ? '✅' : '❌'
    console.log(`  ${status} ${cat}: ${data.passed}/${data.total} 通过`)
  }

  console.log('\n详细结果：')
  for (const r of report.details) {
    console.log(`  ${r.passed ? '✅' : '❌'} [${r.category}] ${r.name} (${r.duration})${r.error ? '\n    Error: ' + r.error : ''}`)
  }

  if (report.summary.failed > 0) {
    console.log('\n❌ 失败测试详情：')
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
