const subjects = [
  'City council','Government','Tech giant','Researchers','Local police','Health agency','School board','Bank','Weather service','Sports team',
  'Energy firm','Transit authority','University','Travel sector','Housing market','Environmental group','Food company','Startup','E-commerce platform','Hospital',
  'Community','Airport','Railway','Telecom provider','Agriculture sector'
]
const actions = [
  'debates new policy','issues warning','faces data breach','announces layoffs','launches investigation','releases study','introduces fee','approves budget','questions report','recalls product',
  'plans protest','reports outage','updates guidelines','halts service','raises prices','cuts interest rates','expands program','faces lawsuit','secures funding','warns of fraud',
  'proposes reform','sees demand surge','declines sharply','posts record profits','tests new system'
]

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function create(n) {
  const res = await fetch('http://localhost:8080/api/news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(n),
  })
  if (!res.ok) throw new Error('post failed ' + res.status)
}

async function main() {
  for (let i = 13; i <= 80; i += 1) {
    const sbj = subjects[(i - 1) % subjects.length]
    const act = actions[((i - 1) * 3) % actions.length]
    const title = `${sbj} ${act}`
    const summary = `${sbj} ${act}. Initial reports indicate mixed reactions from stakeholders.`
    const content = `${sbj} ${act}. Officials and experts provided brief comments while independent verification is still ongoing. Citizens are advised to follow official channels for updates.`
    const reporter = `Reporter ${String.fromCharCode(65 + ((i - 1) % 26))}`
    const imageUrl = `https://picsum.photos/seed/news-${i}/960/540`
    const body = { title, summary, content, reporter, imageUrl }
    try { await create(body) } catch { await wait(100) ; i -= 1 }
    await wait(30)
  }
  const res = await fetch('http://localhost:8080/api/news')
  const arr = await res.json()
  console.log('Total:', arr.length)
}

main().catch((e) => { console.error(e); process.exit(1) })
