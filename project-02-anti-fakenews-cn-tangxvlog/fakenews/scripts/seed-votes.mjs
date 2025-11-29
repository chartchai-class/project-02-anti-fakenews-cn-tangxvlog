const phrases = [
  'Needs more evidence',
  'Looks suspicious',
  'Seems legitimate',
  'Source is reliable',
  'Unverified claim',
  'Eyewitness report',
  'Possible misinformation',
  'Cross-check required',
  'Data missing context',
  'Awaiting official confirmation',
]

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

async function listNews() {
  const res = await fetch('http://localhost:8080/api/news')
  if (!res.ok) throw new Error('list news failed ' + res.status)
  return res.json()
}

async function addVote(id, payload) {
  const res = await fetch(`http://localhost:8080/api/news/${id}/votes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('add vote failed ' + res.status)
  return res.json()
}

async function main() {
  const news = await listNews()
  if (news.length < 50) throw new Error('need at least 50 news, got ' + news.length)
  const targets = news.slice(0, 50)
  for (let i = 0; i < targets.length; i += 1) {
    const n = targets[i]
    const majorityFake = i < 25
    const total = 10 + Math.floor(Math.random() * 5) // 10-14
    for (let k = 0; k < total; k += 1) {
      const bias = majorityFake ? 0.65 : 0.35
      const choice = Math.random() < bias ? 'fake' : 'not_fake'
      const withComment = Math.random() < 0.8
      const withImage = Math.random() < 0.3
      const comment = withComment ? pick(phrases) : undefined
      const imageUrl = withImage ? `https://picsum.photos/seed/cmt-${n.id}-${k}/400/240` : undefined
      const voter = Math.random() < 0.5 ? `User${Math.floor(1000 + Math.random() * 9000)}` : undefined
      try {
        await addVote(n.id, { choice, comment, imageUrl, voter })
      } catch {
        await wait(100)
        k -= 1
      }
      await wait(15)
    }
    await wait(50)
  }
  console.log('Seeded votes for', targets.length, 'news')
}

main().catch((e) => { console.error(e); process.exit(1) })
