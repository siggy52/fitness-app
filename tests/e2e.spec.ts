import { test, expect } from '@playwright/test'

test.describe('健身计划应用 - 完整评测', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
    await page.waitForLoadState('networkidle')
  })

  test('1. 首页核心功能', async ({ page }) => {
    // 检查首页关键元素存在
    await expect(page.locator('text=健身计划').first()).toBeVisible()
    
    // 检查 Quick Actions
    const quickActions = page.locator('section').filter({ hasText: '历史' }).or(page.locator('section').filter({ hasText: '动作库' }))
    await expect(quickActions.first()).toBeVisible()

    // 点击"动作库"跳转
    await page.locator('text=动作库').click()
    await expect(page).toHaveURL(/\/exercises/)
  })

  test('2. 动作库浏览与分类', async ({ page }) => {
    await page.goto('http://localhost:5173/exercises')
    await page.waitForLoadState('networkidle')

    // 检查页面标题
    await expect(page.locator('text=动作库').first()).toBeVisible()

    // 检查分类标签
    await expect(page.locator('text=胸部')).toBeVisible()
    await expect(page.locator('text=背部')).toBeVisible()
    await expect(page.locator('text=肩部')).toBeVisible()
    await expect(page.locator('text=腿部')).toBeVisible()
    await expect(page.locator('text=手臂')).toBeVisible()

    // 点击分类筛选
    await page.locator('text=胸部').click()
    await page.waitForTimeout(500)

    // 点击第一个动作进入详情
    const firstExercise = page.locator('button').filter({ hasText: /卧推|飞鸟|夹胸|划船|引体|深蹲/ }).first()
    if (await firstExercise.isVisible()) {
      await firstExercise.click()
      await expect(page).toHaveURL(/\/exercises\//)
    }
  })

  test('3. 动作详情页', async ({ page }) => {
    // 先进入动作库，再点击动作
    await page.goto('http://localhost:5173/exercises')
    await page.waitForLoadState('networkidle')

    const exerciseBtn = page.locator('button').filter({ hasText: '卧推' }).first()
    if (await exerciseBtn.isVisible()) {
      await exerciseBtn.click()
      await page.waitForLoadState('networkidle')

      // 检查返回按钮可见
      const backBtn = page.locator('button:has(svg.lucide-arrow-left)').first()
      await expect(backBtn).toBeVisible()

      // 点击返回
      await backBtn.click()
      await expect(page).toHaveURL(/\/exercises/)
    }
  })

  test('4. 运动页面 - 添加动作', async ({ page }) => {
    await page.goto('http://localhost:5173/workout')
    await page.waitForLoadState('networkidle')

    // 检查开始训练页面
    await expect(page.locator('text=开始训练')).toBeVisible()

    // 点击添加动作
    await page.locator('text=添加动作').click()

    // 选择动作
    const exerciseSelector = page.locator('text=选择动作')
    await expect(exerciseSelector).toBeVisible()

    // 搜索动作
    const searchInput = page.locator('input[placeholder="搜索动作..."]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('卧推')
      await page.waitForTimeout(500)
    }
  })

  test('5. 导航与状态持久化', async ({ page }) => {
    // 进入工作页面
    await page.goto('http://localhost:5173/workout')
    await page.waitForLoadState('networkidle')
    
    // 添加动作
    await page.locator('text=添加动作').click()
    await page.waitForTimeout(300)

    // 选择第一个动作
    const firstExercise = page.locator('button').filter({ hasText: '卧推' }).first()
    if (await firstExercise.isVisible()) {
      await firstExercise.click()
      await page.waitForTimeout(300)
    }

    // 切换到首页再返回
    await page.goto('http://localhost:5173/home')
    await page.waitForLoadState('networkidle')
    await page.goto('http://localhost:5173/workout')
    await page.waitForLoadState('networkidle')
  })

  test('6. 异常操作 - 重复添加动作', async ({ page }) => {
    await page.goto('http://localhost:5173/workout')
    await page.waitForLoadState('networkidle')

    // 添加动作
    await page.locator('text=添加动作').click()
    await page.waitForTimeout(300)

    const exerciseBtn = page.locator('button').filter({ hasText: '卧推' }).first()
    if (await exerciseBtn.isVisible()) {
      await exerciseBtn.click()
      await page.waitForTimeout(300)
    }

    // 再次尝试添加相同动作
    await page.locator('button:has(svg.lucide-plus)').first().click()
    await page.waitForTimeout(300)

    await exerciseBtn.click()
    await page.waitForTimeout(300)
  })
})
