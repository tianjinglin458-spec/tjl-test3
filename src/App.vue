<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const scroller = ref(null)
const scrollX = ref(0)
const maxScroll = ref(1)
const progress = ref(0)
const heroX = ref(120)
const facing = ref('right')
const isWalking = ref(false)
const activeScene = ref('sea')
const modal = ref(null)
const autoRun = ref(false)
const collected = ref([])
const architectureActive = ref(0)
const moduleGridActive = ref(0)
const workBoardActive = ref(0)
const skyCardActive = ref([0, 0, 0, 0])
const backendCardActive = ref([0, 0])
const seaModuleActive = ref([0, 0, 0, 0])
const isLoading = ref(true)
const loadingProgress = ref(0)
const loaderJump = ref(false)
const playerLanding = ref(false)
const stageScale = ref(0.9)
let stopTimer = 0
let ticking = false
let autoFrame = 0
let lastAutoTime = 0
let loaderFrame = 0

const sceneWidth = 3400
const skySceneWidth = 7900
const totalWidth = sceneWidth * 2 + skySceneWidth
const maxStageScale = 0.9
const minStageScale = 0.78
const designViewportHeight = 768
const publicAsset = (fileName) => `${import.meta.env.BASE_URL}${fileName}`

const backgroundPoints = [
  ['建设背景', '智慧校园建设持续推进，学校需要把分散的教务、后勤和通知服务整合到统一平台。'],
  ['现实问题', '传统单体系统容易形成信息孤岛，师生办理业务需要多系统切换，流程效率偏低。'],
  ['实践意义', '平台通过一站式入口提升师生办事体验，也方便学校进行统一管理和数据共享。'],
  ['技术意义', '微服务、Docker 与 K8s 的结合，为校园系统扩展、部署和维护提供更灵活的方案。'],
]

const skills = [
  {
    group: 'VALUE',
    title: '一站式校园服务',
    detail: '将用户、教务、后勤、公告等常用业务集中展示，减少重复登录和跨系统切换。',
    value: 88,
  },
  {
    group: 'VALUE',
    title: '服务独立演进',
    detail: '按照业务职责拆分服务，新增功能或修改单个模块时，不需要整体重构系统。',
    value: 92,
  },
  {
    group: 'VALUE',
    title: '自动化运维',
    detail: '依托容器化和编排能力，降低环境配置、部署发布和故障恢复的人工成本。',
    value: 84,
  },
  {
    group: 'VALUE',
    title: '安全可靠支撑',
    detail: '通过身份认证、权限控制、数据保护和容器隔离，保障校园业务稳定运行。',
    value: 90,
  },
]

const modules = [
  ['前端技术', 'Vue3 构建单页面应用，Element Plus 提供常用组件，Axios 负责前后端接口通信。'],
  ['后端技术', 'Spring Boot 与 Spring Cloud 支撑微服务开发，Gateway 作为统一请求入口。'],
  ['数据组件', 'MySQL 存储业务数据，Redis 缓存热点数据，RabbitMQ 处理异步消息。'],
  ['部署组件', 'Docker 将各微服务打包为镜像，K8s 负责容器编排、服务发现和弹性伸缩。'],
]

const tests = [
  ['Nacos 服务治理', '各微服务启动后向 Nacos 注册实例，调用方通过服务名发现目标服务，支持动态扩缩容。'],
  ['Docker 容器化', '用户、教务、后勤、公告和网关服务分别打包为独立镜像，实现环境一致和服务隔离。'],
  ['K8s 自动编排', '通过 Deployment、Service、Ingress 等资源完成部署、负载均衡、滚动更新和健康检查。'],
]

const backendWorks = [
  ['分层架构', '前端层、网关层、服务层、数据层和基础设施层分工明确，降低系统耦合。'],
  ['服务拆分', '按照高内聚、低耦合原则划分用户、教务、后勤、公告、网关等核心服务。'],
  ['安全设计', '网关统一处理认证鉴权，服务层继续校验角色权限，数据库侧防止注入和敏感信息泄露。'],
]

const securityItems = [
  ['用户服务模块', publicAsset('用户.jpg'), '负责用户登录、用户注册、信息管理和密码修改，支持管理员、教师、学生三类角色。'],
  ['教务服务模块', publicAsset('选课.jpg'), '包含课程管理、成绩管理、选课管理和退课管理，支撑教学事务线上办理。'],
  ['后勤服务模块', publicAsset('后勤.jpg'), '包含故障报修、场馆预约、报修处理和预约审核，方便师生跟踪处理进度。'],
  ['公告服务模块', publicAsset('公告.jpg'), '支持公告发布、查询、修改和删除，保证学校通知能够及时传达给目标用户。'],
]

const screenshots = [
  ['总体架构图', '前端、网关、服务、数据与部署层截图预留'],
  ['技术栈表', 'Vue3、Spring Cloud、MySQL、Redis、Nacos 等技术说明截图预留'],
  ['Nacos 注册中心', '服务实例、健康状态和配置管理截图预留'],
  ['Docker 镜像构建', '各微服务镜像构建与仓库记录截图预留'],
  ['K8s 部署资源', 'Deployment、Service、Ingress 配置截图预留'],
  ['数据库 ER 图', '用户、课程、选课、公告、报修、场馆预约等关系截图预留'],
  ['网关与权限链路', 'Gateway 路由、JWT 校验和 RBAC 鉴权截图预留'],
  ['用户服务模块', '登录、用户信息管理、密码修改页面截图预留'],
  ['教务服务模块', '课程管理、选课管理、成绩查询页面截图预留'],
  ['后勤服务模块', '故障报修、场馆预约、审核处理页面截图预留'],
  ['公告服务模块', '公告发布、公告查询、公告详情页面截图预留'],
  ['后端部署模块', 'Nacos、Docker 与 K8s 运行状态截图预留'],
]

const references = [
  'Nacos 服务列表: 展示用户、教务、后勤、公告、网关等服务实例与健康状态。',
  'Docker 镜像记录: 展示各微服务镜像构建结果和版本信息。',
  'K8s 运行状态: 展示 Pod、Service、Ingress 等资源的部署与访问情况。',
]

const spriteParts = [
  'hair-back',
  'hair-top',
  'face',
  'ear-left',
  'ear-right',
  'brow-left',
  'brow-right',
  'eye-left',
  'eye-right',
  'nose',
  'mouth',
  'neck',
  'body',
  'shirt-light',
  'shirt-stripe-left',
  'shirt-stripe-right',
  'arm-left',
  'arm-right',
  'hand-left',
  'hand-right',
  'belt',
  'leg-left',
  'leg-right',
  'shoe-left',
  'shoe-right',
]

const progressBlocks = computed(() => Array.from({ length: 24 }, (_, index) => index < Math.round(progress.value * 24)))
const axisValue = computed(() => Math.round(progress.value * 1000))
const collectedCount = computed(() => collected.value.length)
const currentQuest = computed(() => {
  if (collectedCount.value < 2) return '收集背景线索，理解项目价值'
  if (collectedCount.value < 4) return '穿过架构城镇，查看关键技术'
  if (collectedCount.value < 6) return '抵达云端部署区，完成模块巡检'
  return '巡检完成，可以拖动进度轴复盘页面'
})

const sceneStyles = computed(() => ({
  '--stage-scale': stageScale.value,
  '--scroll-progress': progress.value,
  '--camera-drift': `${(progress.value - 0.5) * 22}px`,
  '--sea-active': activeScene.value === 'sea' ? 1 : 0,
  '--town-active': activeScene.value === 'town' ? 1 : 0,
  '--sky-active': activeScene.value === 'sky' ? 1 : 0,
  '--architecture-active': architectureActive.value,
  '--module-grid-active': moduleGridActive.value,
  '--work-board-active': workBoardActive.value,
  '--sea-copy-active': seaModuleActive.value[0],
  '--sea-problem-active': seaModuleActive.value[1],
  '--sea-skill-active': seaModuleActive.value[2],
  '--sea-shot-active': seaModuleActive.value[3],
}))
const worldFrameStyle = computed(() => ({
  width: `${totalWidth * stageScale.value}px`,
}))
const worldStyle = computed(() => ({
  width: `${totalWidth}px`,
  transform: `scale(${stageScale.value})`,
}))

const updateStageScale = () => {
  const next = Math.min(maxStageScale, Math.max(minStageScale, (window.innerHeight / designViewportHeight) * maxStageScale))
  stageScale.value = Number(next.toFixed(3))
}

const updateFromScroll = () => {
  const el = scroller.value
  if (!el) return

  const previous = scrollX.value
  const current = el.scrollLeft
  const scale = stageScale.value || 1
  const designCurrent = current / scale
  const designViewportWidth = window.innerWidth / scale
  scrollX.value = designCurrent
  maxScroll.value = Math.max(el.scrollWidth - el.clientWidth, 1)
  progress.value = current / maxScroll.value
  heroX.value = 90 + progress.value * Math.max(window.innerWidth - 200, 120)

  if (designCurrent > previous) facing.value = 'right'
  if (designCurrent < previous) facing.value = 'left'
  if (Math.abs(designCurrent - previous) > 0.5) markWalking()

  if (designCurrent < sceneWidth * 0.72) activeScene.value = 'sea'
  else if (designCurrent < sceneWidth * 1.78) activeScene.value = 'town'
  else activeScene.value = 'sky'

  const seaRevealEdge = designCurrent + designViewportWidth * 0.75
  seaModuleActive.value = [
    seaRevealEdge > 80 ? 1 : 0,
    seaRevealEdge > 760 ? 1 : 0,
    seaRevealEdge > 1480 ? 1 : 0,
    seaRevealEdge > 2280 ? 1 : 0,
  ]
  architectureActive.value = designCurrent + designViewportWidth * 0.75 > sceneWidth + 900 ? 1 : 0
  workBoardActive.value = designCurrent + designViewportWidth * 0.75 > sceneWidth + 1540 ? 1 : 0
  moduleGridActive.value = designCurrent + designViewportWidth * 0.75 > sceneWidth + 2220 ? 1 : 0
  const revealEdge = designCurrent + designViewportWidth * 0.75
  const skyStart = sceneWidth * 2
  skyCardActive.value = [0, 1, 2, 3].map((index) => (revealEdge > skyStart + 820 + index * 1050 ? 1 : 0))
  backendCardActive.value = [
    revealEdge > skyStart + 5220 ? 1 : 0,
    revealEdge > skyStart + 6360 ? 1 : 0,
  ]

  document.documentElement.style.setProperty('--scroll-x', designCurrent)
}

const requestUpdate = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    updateFromScroll()
    ticking = false
  })
}

const markWalking = () => {
  isWalking.value = true
  window.clearTimeout(stopTimer)
  stopTimer = window.setTimeout(() => {
    isWalking.value = false
  }, 150)
}

const onWheel = (event) => {
  const el = scroller.value
  if (!el || window.matchMedia('(max-width: 760px)').matches) return
  event.preventDefault()
  autoRun.value = false
  el.scrollLeft += (event.deltaY + event.deltaX) * 2.4
}

const onAxisInput = (event) => {
  const el = scroller.value
  if (!el) return
  autoRun.value = false
  const next = Math.min(Math.max(Number(event.target.value) / 1000, 0), 1)
  el.scrollLeft = next * maxScroll.value
  updateFromScroll()
}

const collect = (id) => {
  if (collected.value.includes(id)) return
  collected.value = [...collected.value, id]
}

const autoStep = (timestamp) => {
  if (!autoRun.value) return
  const el = scroller.value
  if (!el) return
  const delta = Math.min(timestamp - (lastAutoTime || timestamp), 32)
  lastAutoTime = timestamp
  el.scrollLeft += delta * 0.18
  if (el.scrollLeft >= maxScroll.value - 4) el.scrollLeft = 0
  facing.value = 'right'
  markWalking()
  autoFrame = window.requestAnimationFrame(autoStep)
}

const toggleAutoRun = () => {
  autoRun.value = !autoRun.value
  lastAutoTime = 0
  window.cancelAnimationFrame(autoFrame)
  if (autoRun.value) autoFrame = window.requestAnimationFrame(autoStep)
}

const onKeydown = (event) => {
  const el = scroller.value
  if (!el) return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    el.scrollBy({ left: 180, behavior: 'smooth' })
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    el.scrollBy({ left: -180, behavior: 'smooth' })
  }
}

const resize = () => {
  updateStageScale()
  updateFromScroll()
}

const openModal = (type) => {
  modal.value = type
}

const closeModal = () => {
  modal.value = null
}

const startLoader = () => {
  const duration = 2400
  const start = performance.now()
  const tick = (timestamp) => {
    const next = Math.min(((timestamp - start) / duration) * 100, 100)
    loadingProgress.value = next
    if (next < 100) {
      loaderFrame = window.requestAnimationFrame(tick)
      return
    }

    loaderJump.value = true
    window.setTimeout(() => {
      isLoading.value = false
      playerLanding.value = true
      updateFromScroll()
      window.setTimeout(() => {
        playerLanding.value = false
      }, 1320)
    }, 780)
  }

  loaderFrame = window.requestAnimationFrame(tick)
}

onMounted(() => {
  updateStageScale()
  updateFromScroll()
  startLoader()
  scroller.value?.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  scroller.value?.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', resize)
  window.clearTimeout(stopTimer)
  window.cancelAnimationFrame(autoFrame)
  window.cancelAnimationFrame(loaderFrame)
})
</script>

<template>
  <main class="game-shell" :style="sceneStyles">
    <div v-if="isLoading" class="loader-screen" :class="{ done: loaderJump }">
      <div class="loader-ribbon">
        <span>校园微服务化平台</span>
        <h1>LOADING</h1>
        <div class="loader-dots" aria-hidden="true">
          <i :class="{ active: loadingProgress > 12 }"></i>
          <i :class="{ active: loadingProgress > 32 }"></i>
          <i :class="{ active: loadingProgress > 52 }"></i>
          <i :class="{ active: loadingProgress > 72 }"></i>
          <i :class="{ active: loadingProgress >= 100 }"></i>
        </div>
        <div class="loader-track">
          <div class="loader-fill" :style="{ width: `${loadingProgress}%` }"></div>
          <div class="loader-runner" :style="{ left: `calc(${loadingProgress}% - 36px)` }">
            <div class="sprite">
              <span v-for="part in spriteParts" :key="part" :class="['sprite-part', part]"></span>
            </div>
          </div>
        </div>
        <strong>{{ Math.round(loadingProgress) }}%</strong>
      </div>
    </div>

    <div class="hud">
      <div class="hud-title">校园微服务化平台设计与实现</div>
      <div class="pixel-progress" aria-label="横向浏览进度">
        <span v-for="(filled, index) in progressBlocks" :key="index" :class="{ filled }"></span>
      </div>
      <div class="hud-actions">
        <button class="auto-btn" type="button" @click="toggleAutoRun">{{ autoRun ? 'PAUSE' : 'AUTO RUN' }}</button>
        <div class="hud-stage">{{ activeScene === 'sea' ? '背景与意义' : activeScene === 'town' ? '架构与技术' : '模块实现' }}</div>
        <div class="hud-badge">徽章 {{ collectedCount }}/6</div>
      </div>
    </div>

    <div class="quest-panel">
      <strong>MISSION</strong>
      <span>{{ currentQuest }}</span>
    </div>

    <div class="spark-field" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span><span></span>
    </div>

    <div class="page-axis">
      <span>页面拖动轴</span>
      <input
        type="range"
        min="0"
        max="1000"
        :value="axisValue"
        aria-label="页面拖动轴"
        @input="onAxisInput"
      />
      <strong>{{ Math.round(progress * 100) }}%</strong>
    </div>

    <div ref="scroller" class="horizontal-scroll" @wheel="onWheel">
      <div class="world-frame" :style="worldFrameStyle">
        <div class="world" :style="worldStyle">
          <div class="parallax far" :style="{ transform: `translate3d(${-scrollX * 0.2}px,0,0)` }">
          <span class="cloud c1"></span>
          <span class="cloud c2"></span>
          <span class="cloud c3"></span>
          <span class="mountain m1"></span>
          <span class="mountain m2"></span>
        </div>
        <div class="parallax mid" :style="{ transform: `translate3d(${-scrollX * 0.5}px,0,0)` }">
          <span class="reef r1"></span>
          <span class="building b1 clickable" tabindex="0" role="button" @click="openModal('screen')" @keydown.enter="openModal('screen')"></span>
          <span class="building b2"></span>
          <span class="server-ship clickable" tabindex="0" role="button" @click="openModal('code')" @keydown.enter="openModal('code')"></span>
        </div>
        <div class="parallax near" :style="{ transform: `translate3d(${-scrollX}px,0,0)` }">
          <span class="coral coral-a"></span>
          <span class="coral coral-b"></span>
          <span class="tree tree-a"></span>
          <span class="tree tree-b"></span>
          <span class="cloud-platform p1"></span>
          <span class="cloud-platform p2"></span>
        </div>

        <section class="scene sea-scene" :style="{ left: '0px' }">
          <button class="collectible coin-a" type="button" :class="{ collected: collected.includes('entry') }" @click="collect('entry')"><span>入口</span></button>
          <button class="collectible coin-b" type="button" :class="{ collected: collected.includes('value') }" @click="collect('value')"><span>价值</span></button>
          <div class="scene-copy sea-copy reveal">
            <p class="pixel-kicker">模块一 / 项目背景与意义</p>
            <h1>面向智慧校园的一站式服务平台</h1>
            <p>
              本项目围绕高校数字化校园建设需求，将用户管理、教务服务、后勤服务和公告通知等分散业务整合到统一入口，解决传统校园系统信息孤岛、扩展困难和运维成本高的问题。
            </p>
          </div>
          <div class="problem-board sea-problem reveal delay-1">
            <h2>建设痛点</h2>
            <div class="problem-list">
              <span>教务、后勤、公告等业务入口分散</span>
              <span>师生重复登录和跨系统切换较多</span>
              <span>单体架构扩展慢，故障影响范围大</span>
              <span>人工部署和排查成本较高</span>
            </div>
          </div>
          <div class="skill-board sea-skill reveal delay-3">
            <h2>项目意义</h2>
            <article v-for="skill in skills" :key="skill.title" class="skill-row">
              <div>
                <span>{{ skill.group }}</span>
                <strong>{{ skill.title }}</strong>
                <p>{{ skill.detail }}</p>
              </div>
              <div class="bar" :style="{ '--value': `${skill.value}%` }">
                <i></i>
              </div>
            </article>
          </div>
          <div class="screenshot-wall sea-shot reveal delay-4">
            <div class="shot-window large real-shot">
              <img :src="publicAsset('登录页.jpg')" alt="校园微服务化平台登录页" />
            </div>
            <p>登录页展示平台统一入口，用来说明系统如何把校园常用服务集中到一站式访问页面。</p>
          </div>
          <div class="bubble-set" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
        </section>

        <section class="scene town-scene" :style="{ left: `${sceneWidth}px` }">
          <button class="collectible coin-c" type="button" :class="{ collected: collected.includes('gateway') }" @click="collect('gateway')"><span>网关</span></button>
          <button class="collectible coin-d" type="button" :class="{ collected: collected.includes('data') }" @click="collect('data')"><span>数据</span></button>
          <div class="scene-copy wide reveal">
            <p class="pixel-kicker">模块二 / 架构与技术</p>
            <h1>微服务架构与关键技术选型</h1>
            <p>
              系统采用前后端分离和微服务架构，前端基于 Vue3，后端基于 Spring Boot 与 Spring Cloud，并通过 Nacos、Docker、K8s 等组件支撑服务治理和自动化部署。
            </p>
          </div>

          <div class="architecture reveal delay-1" aria-label="系统总体架构图">
            <div class="layer frontend">前端层 Vue3 + Element Plus<br><small>统一交互入口 / Axios 通信</small></div>
            <div class="layer gateway">网关层 Spring Cloud Gateway<br><small>统一路由 / 身份认证 / 鉴权限流</small></div>
            <div class="layer services">
              <span>用户服务</span><span>教务服务</span><span>后勤服务</span><span>公告服务</span>
            </div>
            <div class="layer data">
              <span>MySQL</span><span>Redis</span><span>RabbitMQ</span><span>Nacos</span>
            </div>
            <div class="layer infra">数据与编排层 Docker + K8s + MySQL + Redis</div>
          </div>

          <div class="work-board reveal delay-2">
            <h2>架构说明</h2>
            <article v-for="work in backendWorks" :key="work[0]">
              <strong>{{ work[0] }}</strong>
              <p>{{ work[1] }}</p>
            </article>
          </div>

          <div class="module-grid reveal delay-2">
            <article v-for="item in modules" :key="item[0]" class="module-card">
              <div class="module-icon"></div>
              <h2>{{ item[0] }}</h2>
              <p>{{ item[1] }}</p>
            </article>
          </div>

        </section>

        <section class="scene sky-scene" :style="{ left: `${sceneWidth * 2}px`, width: `${skySceneWidth}px` }">
          <button class="collectible coin-e" type="button" :class="{ collected: collected.includes('nacos') }" @click="collect('nacos')"><span>Nacos</span></button>
          <button class="collectible coin-f" type="button" :class="{ collected: collected.includes('k8s') }" @click="collect('k8s')"><span>K8s</span></button>
          <div class="sky-pixel-decor" aria-hidden="true">
            <span class="sky-cloud sc-a"></span>
            <span class="sky-cloud sc-b"></span>
            <span class="sky-cloud sc-c"></span>
            <span class="sky-cloud sc-d"></span>
            <span class="sky-bird sb-a"></span>
            <span class="sky-bird sb-b"></span>
            <span class="sky-bird sb-c"></span>
            <span class="sky-sun"></span>
            <span class="sky-star ss-a"></span>
            <span class="sky-star ss-b"></span>
            <span class="sky-star ss-c"></span>
          </div>
          <div class="scene-copy reveal">
            <p class="pixel-kicker">模块三 / 前后端模块说明</p>
            <h1>前端业务模块与后端部署支撑</h1>
            <p>
              功能实现部分分为前端业务模块和后端部署模块。前端面向师生操作流程组织页面，后端重点通过 Nacos、Docker 与 K8s 完成服务治理、容器化和编排部署。
            </p>
          </div>

          <div class="security-board">
            <h2>前端模块说明</h2>
            <article v-for="(item, index) in securityItems" :key="item[0]" :class="{ 'sky-card-in': skyCardActive[index] }">
              <div class="module-shot">
                <img :src="item[1]" :alt="`${item[0]}截图`" />
              </div>
              <strong>{{ item[0] }}</strong>
              <p>{{ item[2] }}</p>
            </article>
          </div>

          <div class="outlook">
            <article :class="{ 'sky-card-in': backendCardActive[0] }">
              <div class="module-shot">
                <img :src="publicAsset('nocas.jpg')" alt="Nacos 服务注册截图" />
              </div>
              <h2>Nacos 服务注册</h2>
              <p>使用 Nacos 作为服务注册中心，所有微服务启动后自动向 Nacos 注册实例，Nacos 控制台可实时查看各服务实例的健康状态与元数据。</p>
            </article>
            <article :class="{ 'sky-card-in': backendCardActive[1] }">
              <div class="module-shot">
                <img :src="publicAsset('k8s.jpg')" alt="Docker 与 K8s 部署截图" />
              </div>
              <h2>Docker + K8s</h2>
              <p>每个微服务打包为独立 Docker 镜像，K8s 通过 Deployment、Service 和 Ingress 完成部署、负载均衡、滚动更新与健康检查。</p>
            </article>
          </div>

        </section>
      </div>
      </div>
    </div>

    <div class="ground-strip" aria-hidden="true"></div>
    <div
      class="player"
      :class="{ walking: isWalking, left: facing === 'left', landing: playerLanding, preloading: isLoading && !playerLanding }"
      :style="{ transform: `translate3d(${heroX}px, 0, 0) ${facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}` }"
      aria-label="像素大学生角色"
    >
      <div class="sprite">
        <span v-for="part in spriteParts" :key="part" :class="['sprite-part', part]"></span>
      </div>
    </div>

    <div v-if="modal" class="modal-backdrop" @click.self="closeModal">
      <div class="pixel-modal">
        <button class="close-btn" type="button" @click="closeModal">X</button>
        <template v-if="modal === 'code'">
          <h2>后端部署截图说明</h2>
          <pre><code>- rule: docker_exec_attempt
  desc: Monitor docker exec command
  condition: evt.type=execve and proc.name="docker"
  output: "DOCKER WARN: docker exec detected"
  priority: WARNING

- rule: kubectl_exec_attempt
  desc: Monitor kubectl exec into pod
  condition: evt.type=execve and proc.name="kubectl"</code></pre>
        </template>
        <template v-else>
          <h2>系统运行截图说明</h2>
          <div class="fake-screen">
            <div class="screen-top"></div>
            <div class="screen-sidebar"></div>
            <div class="screen-content">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <p>论文图示可放置用户登录、课程管理、选课管理、成绩查询、故障报修、场馆预约、公告发布与公告查询等页面。</p>
        </template>
      </div>
    </div>
  </main>
</template>
