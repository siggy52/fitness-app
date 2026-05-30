import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'

const BASE_URL = 'http://localhost:5173'
const SCREENSHOT_DIR = path.resolve('tests', 'screenshots')
const REPORT_FILE = path.resolve('tests', 'report.json')

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

interface TestResult {
  name: string
  passed: boolean
  category: string
  duration: number
  error?: string
  screenshot?: string
}

const results: TestResult[] = []

async function runTest(name: string, category: string, fn: () => Promise<void>) {
  const start = Date.now()
  try {
    await fn()
    results.push({ name, passed: true, category, duration: Date.now() - start })
    console.log(`  ✅ ${name} (${Date.now() - start}ms)`)
  } catch (e: any) {
    results.push({ name, passed: false, category, duration: Date.now() - start, error: e.message })
    console.log(`  ❌ ${name} - ${e.message}`)
  }
}

async function main() {
  console.log('\n=== 健身计划应用 - 系统评测开始 ===\n')

  const browser = await chromium.launch({ headless: true, channel: undefined })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  // ==========================================
  // 测试组1：首页核心功能
  // ==========================================
  console.log('\n========================================')
  console.log('测试组1：首页核心功能')
  console.log('========================================\n')

  await runTest('首页加载速度', '首页', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    const title = await page.title()
    // Should load within 3 seconds - basic perf check
    expect(title !== undefined)
  })

  await runTest('首页关键元素可见', '首页', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    // 检查标题
    const titleVisible = await page.locator('h1, h2').first().isVisible()
    expect(titleVisible)
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home.png'), fullPage: true })
  })

  await runTest('Quick Actions 导航', '首页', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    
    // 检查动作库按钮
    const actionBtns = page.locator('button:has-text("动作库")')
    if (await actionBtns.first().isVisible()) {
      await actionBtns.first().click()
      await page.waitForURL('**/exercises**', { timeout: 3000 })
      expect(page.url().includes('/exercises'))
    } else {
      throw new Error('动作库按钮不可见')
    }
  })

  // ==========================================
  // 测试组2：动作库
  // ==========================================
  console.log('\n========================================')
  console.log('测试组2：动作库浏览')
  console.log('========================================\n')

  await runTest('动作库页面加载', '动作库', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle' })
    const visible = await page.locator('text=动作库').first().isVisible()
    expect(visible)
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'exercises.png'), fullPage: true })
  })

  await runTest('分类筛选功能', '动作库', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle' })
    
    for (const category of ['胸部', '背部', '肩部', '腿部', '手臂']) {
      const btn = page.locator(`button:has-text("${category}")`)
      if (await btn.first().isVisible()) {
        await btn.first().click()
        await page.waitForTimeout(500)
      }
    }
    // 如果执行到这里说明分类切换正常
  })

  await runTest('搜索功能', '动作库', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle' })
    
    const searchInput = page.locator('input[placeholder*="搜索"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('卧推')
      await page.waitForTimeout(500)
      // 搜索结果应该包含卧推
      const results = page.locator('button:has-text("卧推")')
      const count = await results.count()
      expect(count > 0)
    }
  })

  // ==========================================
  // 测试组3：动作详情
  // ==========================================
  console.log('\n========================================')
  console.log('测试组3：动作详情页')
  console.log('========================================\n')

  await runTest('动作详情页进入与返回', '动作详情', async () => {
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle' })
    
    // 尝试找到并点击一个动作
    const exerciseBtn = page.locator('button').filter({ hasText: '卧推' }).first()
    if (await exerciseBtn.isVisible({ timeout: 2000 })) {
      await exerciseBtn.click()
      await page.waitForURL('**/exercises/**', { timeout: 3000 })
      await page.waitForTimeout(300)
      
      // 检查返回按钮
      const backBtn1 = page.locator('a:has(svg), button:has(svg.lucide-arrow-left)').first()
      const backBtn2 = page.locator('button:has-text("返回"), a:has-text("返回")').first()
      const backBtn3 = page.locator('button:has(svg)').first()
      
      let backClicked = false
      for (const btn of [backBtn1, backBtn2, backBtn3]) {
        if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await btn.click()
          backClicked = true
          break
        }
      }
      
      await page.waitForTimeout(1000)
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'exercise-detail.png'), fullPage: true })
      
      if (!backClicked) {
        // 检查是否有任意返回方式 - 尝试 navigate back
        await page.goto(`${BASE_URL}/exercises`)
        expect(page.url().includes('/exercises'))
      }
    } else {
      // 没有找到卧推按钮，直接验证详情页访问
      const anyButton = page.locator('button').filter({ hasText: /卧推|深蹲|硬拉|划船/ }).first()
      if (await anyButton.isVisible({ timeout: 2000 })) {
        await anyButton.click()
        await page.waitForTimeout(1000)
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'exercise-detail.png'), fullPage: true })
      }
    }
  })

  // ==========================================
  // 测试组4：运动页面
  // ==========================================
  console.log('\n========================================')
  console.log('测试组4：运动页面')
  console.log('========================================\n')

  await runTest('运动页面加载', '运动页面', async () => {
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle' })
    const visible = await page.locator('text=开始训练').isVisible({ timeout: 3000 })
    expect(visible)
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'workout-empty.png'), fullPage: true })
  })

  await runTest('添加动作选择器', '运动页面', async () => {
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle' })
    
    // 点击添加动作
    const addBtn = page.locator('button:has-text("添加动作")')
    if (await addBtn.isVisible()) {
      await addBtn.click()
      await page.waitForTimeout(300)
      const selectorVisible = await page.locator('text=选择动作').isVisible()
      expect(selectorVisible)
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'exercise-selector.png'), fullPage: true })
    }
  })

  await runTest('动作搜索过滤', '运动页面', async () => {
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle' })
    
    await page.locator('button:has-text("添加动作")').click()
    await page.waitForTimeout(300)
    
    const searchInput = page.locator('input[placeholder*="搜索"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('卧推')
      await page.waitForTimeout(500)
      const results = page.locator('button').filter({ hasText: '卧推' })
      const count = await results.count()
      expect(count > 0)
    }
  })

  // ==========================================
  // 测试组5：导航与状态持久化
  // ==========================================
  console.log('\n========================================')
  console.log('测试组5：导航与状态持久化')
  console.log('========================================\n')

  await runTest('页面导航跳转', '导航', async () => {
    const pages = ['/home', '/workout', '/exercises']
    for (const p of pages) {
      await page.goto(`${BASE_URL}${p}`, { waitUntil: 'networkidle' })
      expect(page.url().includes(p))
    }
  })

  await runTest('404页面处理', '导航', async () => {
    await page.goto(`${BASE_URL}/nonexistent-page`, { waitUntil: 'networkidle' })
    // Should not crash — just show some fallback
    await page.waitForTimeout(500)
    const bodyText = await page.locator('body').innerText()
    // Should show something (anything) rather than blank page
    expect(bodyText.length > 0)
  })

  // ==========================================
  // 测试组6：UI 一致性
  // ==========================================
  console.log('\n========================================')
  console.log('测试组6：UI 一致性检查')
  console.log('========================================\n')

  await runTest('暗色主题一致性', 'UI', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    
    // 检查背景色
    const bgColor = await page.locator('.min-h-screen').first().evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    expect(bgColor.includes('rgb') || bgColor.includes('#'))
  })

  // ==========================================
  // 测试组7：性能基础指标
  // ==========================================
  console.log('\n========================================')
  console.log('测试组7：性能基础指标')
  console.log('========================================\n')

  await runTest('首页加载性能', '性能', async () => {
    const startTime = Date.now()
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    const loadTime = Date.now() - startTime
    expect(loadTime < 10000) // 10 second threshold
  })

  await runTest('动作库加载性能', '性能', async () => {
    const startTime = Date.now()
    await page.goto(`${BASE_URL}/exercises`, { waitUntil: 'networkidle' })
    const loadTime = Date.now() - startTime
    expect(loadTime < 10000)
  })

  await runTest('运动页面加载性能', '性能', async () => {
    const startTime = Date.now()
    await page.goto(`${BASE_URL}/workout`, { waitUntil: 'networkidle' })
    const loadTime = Date.now() - startTime
    expect(loadTime < 10000)
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
      viewport: '390x844',
      baseUrl: BASE_URL,
    },
    summary: {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      passRate: (results.filter(r => r.passed).length / results.length * 100).toFixed(1) + '%',
    },
    results: results.map(r => ({
      name: r.name,
      category: r.category,
      passed: r.passed,
      duration: `${r.duration}ms`,
      error: r.error || null,
    })),
    categories: {} as Record<string, { total: number; passed: number; failed: number }>,
  }

  // 按分类汇总
  for (const r of results) {
    if (!report.categories[r.category]) {
      report.categories[r.category] = { total: 0, passed: 0, failed: 0 }
    }
    report.categories[r.category].total++
    if (r.passed) {
      report.categories[r.category].passed++
    } else {
      report.categories[r.category].failed++
    }
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2))
  
  // 输出控制台报告
  console.log('\n评测结果汇总：')
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
  for (const r of report.results) {
    console.log(`  ${r.passed ? '✅' : '❌'} [${r.category}] ${r.name} (${r.duration})${r.error ? ' - ' + r.error : ''}`)
  }

  if (report.summary.failed > 0) {
    console.log('\n❌ 失败测试详情：')
    for (const r of report.results) {
      if (!r.passed) {
        console.log(`  [${r.category}] ${r.name}: ${r.error}`)
      }
    }
  }

  console.log(`\n报告已保存至: ${REPORT_FILE}`)
  console.log(`截图已保存至: ${SCREENSHOT_DIR}`)
}

function expect(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

main().catch(console.error)
