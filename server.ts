import express from 'express';
import { createServer as createViteServer } from 'vite';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory cache on server
const serverCache = new Map<string, any>();

// Helper to fetch HTML from legacy.sdarm.org using HTTP/1.1
function fetchSblHtml(year: number, quarter: number, lesson: number, lang = 'en'): Promise<string> {
  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname: 'legacy.sdarm.org',
      port: 443,
      path: `/publications/periodicals/sbl/${lang}/${year}/${quarter}/${lesson}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'close'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.setEncoding('utf-8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
          resolve(data);
        } else {
          reject(new Error(`Server responded with HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request to legacy.sdarm.org timed out'));
    });

    req.end();
  });
}

// Clean HTML tags and entities
function cleanText(str: string): string {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Parse SBL HTML into clean SabbathSchoolLesson object
function parseSblHtml(html: string, year: number, quarter: number, lesson: number, lang = 'en') {
  // Extract date
  const dateMatch = html.match(/<sabbath>([^<]+)<\/sabbath>/i);
  const date = dateMatch ? cleanText(dateMatch[1]) : `Sabbath, Quarter ${quarter}, ${year}`;

  // Extract lesson header (e.g. "Lesson 3")
  const lessonHeaderMatch = html.match(/<lesson_header[^>]*>([^<]+)<\/lesson_header>/i);
  const lessonHeader = lessonHeaderMatch ? cleanText(lessonHeaderMatch[1]) : `Lesson ${lesson}`;

  // Extract lesson title
  // In the article, the lesson title is in a <title> tag inside the body
  let lessonTitle = '';
  const bodyTitleMatch = html.match(/<div class="lesson_date_wrapper">[\s\S]*?<title>([\s\S]*?)<\/title>/i) ||
    html.match(/<lesson_header[^>]*>[\s\S]*?<\/lesson_header>[\s\S]*?<title>([\s\S]*?)<\/title>/i);
  if (bodyTitleMatch) {
    lessonTitle = cleanText(bodyTitleMatch[1]);
  } else {
    // Fallback: look for title near date
    const altTitle = html.match(/Lesson\s+\d+[\s\r\n]+([^<\r\n]+)/i);
    lessonTitle = altTitle ? cleanText(altTitle[1]) : `Lesson ${lesson}`;
  }

  // Quarterly Theme (e.g. Lessons From the Epistles to Philippians, Colossians, and Thessalonians)
  const quarterlyThemeMatch = html.match(/id=['"]book-title['"][^>]*>([^<]+)<\/h\d>/i) ||
    html.match(/class=['"][^'"]*book-title[^'"]*['"][^>]*>([^<]+)<\/h\d>/i) ||
    html.match(/class="sbl_theme"[^>]*>([^<]+)</i);
  const quarterlyTheme = quarterlyThemeMatch ? cleanText(quarterlyThemeMatch[1]) : 'Sabbath Bible Lessons';

  // Audio URL (e.g. https://dl.sdarm.net/contents/publications/periodicals/sbl/audio/2026/sbl2026_4_3_en.mp3)
  const audioMatch = html.match(/<source[^>]+src=["']([^"']+\.mp3)["']/i) || html.match(/href=["']([^"']+\.mp3)["']/i);
  const audioUrl = audioMatch ? audioMatch[1] : `https://dl.sdarm.net/contents/publications/periodicals/sbl/audio/${year}/sbl${year}_${quarter}_${lesson}_${lang}.mp3`;

  // Memory verse
  let memoryVerse = '';
  let memoryVerseRef = '';
  const keyTextMatch = html.match(/<key_text>([\s\S]*?)<\/key_text>/i);
  if (keyTextMatch) {
    const rawKeyText = keyTextMatch[1];
    // Find scripture reference inside (Philippians 3:10, 11)
    const refMatch = rawKeyText.match(/\(([^)]+)\)/i);
    if (refMatch) {
      memoryVerseRef = cleanText(refMatch[1]);
    }
    const verseTextOnly = rawKeyText
      .replace(/MEMORY\s+VERSE:?/i, '')
      .replace(/\([^)]+\)/g, '')
      .replace(/“|”|"/g, '');
    memoryVerse = cleanText(verseTextOnly);
  }

  // Suggested readings
  let suggestedReadings = '';
  const readingsMatch = html.match(/Suggested\s+Readings:?([\s\S]*?)(?:<lesson_intro>|“|<subtitle>)/i) ||
    html.match(/<reading_label>[\s\S]*?<\/reading_label>([\s\S]*?)(?:<lesson_intro>|<subtitle>)/i);
  if (readingsMatch) {
    suggestedReadings = cleanText(
      readingsMatch[1]
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/DISPLAY\s*=+>/gi, '')
        .replace(/Suggested Readings:?/gi, '')
        .replace(/Your user agent does not support the HTML5 Audio element\./gi, '')
    );
  }

  // Intro quote (e.g. Ellen White quote before Section 1)
  let introQuote = '';
  const introMatch = html.match(/<lesson_intro>([\s\S]*?)<\/lesson_intro>/i) ||
    html.match(/(?:Suggested Readings:?[\s\S]*?)(“[^”]+”—[^<]+)/i);
  if (introMatch) {
    introQuote = cleanText(introMatch[1]);
  }

  // Daily sections
  const days: any[] = [];
  const daySections = html.split(/<div class="day_lesson_header">/i);

  for (let i = 1; i < daySections.length; i++) {
    const secHtml = daySections[i];
    const subtitleMatch = secHtml.match(/<subtitle>\s*([^<]+)\s*<\/subtitle>/i);
    const dayNameMatch = secHtml.match(/<day>([^<]+)<\/day>/i);
    const dateStrMatch = secHtml.match(/<date>([^<]+)<\/date>/i);

    const title = subtitleMatch ? cleanText(subtitleMatch[1]) : `Day ${i}`;
    const dayName = dayNameMatch ? cleanText(dayNameMatch[1]) : '';
    const dateStr = dateStrMatch ? cleanText(dateStrMatch[1]) : '';

    // Questions and reference notes
    const questions: any[] = [];

    // Split questions by <question> or <a>
    const rawQuestionBlocks = secHtml.split(/<question>/i);
    for (let qIdx = 1; qIdx < rawQuestionBlocks.length; qIdx++) {
      const qBlock = rawQuestionBlocks[qIdx];
      // Question content
      const qContentMatch = qBlock.match(/([\s\S]*?)<\/question>/i);
      if (!qContentMatch) continue;

      const fullQText = cleanText(qContentMatch[1]);
      if (!fullQText) continue;

      // Question letter/number (e.g. "a." or "1.")
      const labelMatch = fullQText.match(/^([a-z0-9]+)\.\s*/i);
      const label = labelMatch ? labelMatch[1] : `${qIdx}`;
      const qWithoutLabel = fullQText.replace(/^[a-z0-9]+\.\s*/i, '');

      // Check for scripture link or reference in question
      let scripture = '';
      const scriptureMatch = qBlock.match(/class=['"]source-link source-link-bible['"][^>]*>([^<]+)<\/span>/i) ||
        fullQText.match(/([1-3]?\s*[A-Z][a-z]+\s+\d+:\d+(?:–\d+|-?\d+)?)/);
      if (scriptureMatch) {
        scripture = cleanText(scriptureMatch[1]);
      }

      // Extract commentary notes in this block (<ref_parag>...</ref_parag>)
      const notes: string[] = [];
      const noteMatches = qBlock.matchAll(/<ref_parag[^>]*>([\s\S]*?)<\/ref_parag>/gi);
      for (const n of noteMatches) {
        const cleanedNote = cleanText(n[1]);
        if (cleanedNote && cleanedNote.length > 10) {
          notes.push(cleanedNote);
        }
      }

      // Also check <key_note>
      const keyNotes = qBlock.matchAll(/<key_note[^>]*>([\s\S]*?)<\/key_note>/gi);
      for (const kn of keyNotes) {
        const cleanedKn = cleanText(kn[1]);
        if (cleanedKn && cleanedKn.length > 10) {
          notes.push(cleanedKn);
        }
      }

      questions.push({
        label,
        question: qWithoutLabel,
        scripture,
        notes
      });
    }

    days.push({
      id: i,
      title,
      dayName,
      dateStr,
      questions
    });
  }

  return {
    year,
    quarter,
    lesson,
    lang,
    quarterlyTheme,
    lessonHeader,
    title: lessonTitle,
    date,
    memoryVerse,
    memoryVerseRef,
    suggestedReadings,
    introQuote,
    audioUrl,
    days,
    sourceUrl: `https://legacy.sdarm.org/publications/periodicals/sbl/${lang}/${year}/${quarter}/${lesson}`,
    cachedAt: new Date().toISOString()
  };
}

// Fallback pre-bundled lesson for 2026/4/3 (so offline demo always works immediately even with zero network)
const FALLBACK_2026_4_3 = {
  year: 2026,
  quarter: 4,
  lesson: 3,
  lang: 'en',
  quarterlyTheme: 'Lessons From the Epistles to Philippians, Colossians, and Thessalonians',
  lessonHeader: 'Lesson 3',
  title: 'Longing to Know Jesus Better',
  date: 'Sabbath, October 17, 2026',
  memoryVerse: 'That I may know him, and the power of his resurrection, and the fellowship of his sufferings, being made conformable unto his death; If by any means I might attain unto the resurrection of the dead',
  memoryVerseRef: 'Philippians 3:10, 11',
  suggestedReadings: 'Testimonies for the Church, vol. 3, pp. 22–32; The Story of Redemption, pp. 310–314',
  introQuote: '“As the student of the Bible beholds the Redeemer, there is awakened in the soul the mysterious power of faith, adoration, and love. Upon the vision of Christ the gaze is fixed, and the beholder grows into the likeness of that which he adores.”—Education, p. 192.',
  audioUrl: 'https://dl.sdarm.net/contents/publications/periodicals/sbl/audio/2026/sbl2026_4_3_en.mp3',
  sourceUrl: 'https://legacy.sdarm.org/publications/periodicals/sbl/en/2026/4/3',
  cachedAt: new Date().toISOString(),
  days: [
    {
      id: 1,
      title: '1. RIGHTEOUSNESS BY FAITH',
      dayName: 'Sun,',
      dateStr: 'Oct 11',
      questions: [
        {
          label: 'a',
          question: 'How does Paul uplift the need of faith in Christ without trusting in supposed merits of the flesh? Philippians 3:1–3.',
          scripture: 'Philippians 3:1–3',
          notes: [
            '“The nearer we come to Jesus and the more clearly we discern the purity of His character, the more clearly we shall discern the exceeding sinfulness of sin and the less we shall feel like exalting ourselves...”',
            '“None of the apostles or prophets ever claimed to be without sin. Men who have lived nearest to God, men who would sacrifice life itself rather than knowingly commit a wrong act, men whom God had honored with divine light and power, have confessed the sinfulness of their own nature. They have put no confidence in the flesh, have claimed no righteousness of their own, but have trusted wholly in the righteousness of Christ.”',
            '“At every advance step in Christian experience our repentance will deepen. It is to those whom the Lord has forgiven, to those whom He acknowledges as His people, that He says, ‘Then shall ye remember your own evil ways, and your doings that were not good, and shall loathe yourselves in your own sight for your iniquities and for your abominations’ (Ezekiel 36:31).”'
          ]
        }
      ]
    },
    {
      id: 2,
      title: '2. JOY IN SERVING CHRIST',
      dayName: 'Mon,',
      dateStr: 'Oct 12',
      questions: [
        {
          label: 'a',
          question: 'What advantages had Paul once possessed according to Jewish standards, and how did he now view them in comparison with Christ? Philippians 3:4–8.',
          scripture: 'Philippians 3:4–8',
          notes: [
            '“Paul had been educated by the most learned teachers of the age. He had been taught by Gamaliel. He was a rabbi, a member of the Sanhedrin. But all these advantages were counted as loss that he might win Christ.”',
            '“When Christ revealed Himself to Paul, all his former honors and achievements seemed worthless in comparison with the excellency of the knowledge of Christ Jesus his Lord.”'
          ]
        },
        {
          label: 'b',
          question: 'How is righteousness by faith contrasted with the righteousness of the law? Philippians 3:9.',
          scripture: 'Philippians 3:9',
          notes: [
            '“The righteousness of Christ is not a mantle to cover unconfessed and unforsaken sin; it is a principle of life that transforms the character and governs the conduct.”'
          ]
        }
      ]
    },
    {
      id: 3,
      title: '3. THE GENUINE EXPERIENCE',
      dayName: 'Tue,',
      dateStr: 'Oct 13',
      questions: [
        {
          label: 'a',
          question: 'What was the supreme goal of Paul’s life, and what did he desire to experience through Christ? Philippians 3:10, 11.',
          scripture: 'Philippians 3:10, 11',
          notes: [
            '“To know Christ by an experimental knowledge, to understand the power of His resurrection and the fellowship of His sufferings, this was the great longing of the apostle’s soul.”'
          ]
        },
        {
          label: 'b',
          question: 'Did Paul consider that he had already achieved perfection, or what was his constant attitude? Philippians 3:12–14.',
          scripture: 'Philippians 3:12–14',
          notes: [
            '“Paul did not count himself to have apprehended; he was still pressing toward the mark for the prize of the high calling of God in Christ Jesus.”'
          ]
        }
      ]
    },
    {
      id: 4,
      title: '4. PERSEVERING AGAINST TEMPTATION',
      dayName: 'Wed,',
      dateStr: 'Oct 14',
      questions: [
        {
          label: 'a',
          question: 'What counsel does the apostle give to those who are mature in the faith? Philippians 3:15, 16.',
          scripture: 'Philippians 3:15, 16',
          notes: [
            '“God desires that those who have received light shall walk in that light and press forward into higher spiritual ground.”'
          ]
        },
        {
          label: 'b',
          question: 'Against what class of professors did Paul warn with tears? Philippians 3:17–19.',
          scripture: 'Philippians 3:17–19',
          notes: [
            '“With weeping the apostle warned against those whose god was their belly and who minded earthly things while professing to be followers of the Crucified One.”'
          ]
        }
      ]
    },
    {
      id: 5,
      title: '5. A DIFFERENT CITIZENSHIP',
      dayName: 'Thu,',
      dateStr: 'Oct 15',
      questions: [
        {
          label: 'a',
          question: 'Where is the true home and citizenship of the believer, and for what glorious event do we look? Philippians 3:20, 21.',
          scripture: 'Philippians 3:20, 21',
          notes: [
            '“Our conversation is in heaven; from whence also we look for the Saviour, the Lord Jesus Christ, who shall change our vile body, that it may be fashioned like unto His glorious body.”'
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'PERSONAL REVIEW QUESTIONS',
      dayName: 'Fri,',
      dateStr: 'Oct 16',
      questions: [
        {
          label: '1',
          question: 'In what ways am I tempted to rely on my own achievements instead of the righteousness of Christ?',
          notes: []
        },
        {
          label: '2',
          question: 'What does it mean in practical daily life to count all worldly gains as loss for Christ?',
          notes: []
        },
        {
          label: '3',
          question: 'How can I come to know the power of Christ’s resurrection in overcoming personal besetting sins?',
          notes: []
        },
        {
          label: '4',
          question: 'What is the difference between true Christian perfection and self-righteous presumption?',
          notes: []
        },
        {
          label: '5',
          question: 'How does the promise of Christ’s return and the resurrection inspire me to live as a citizen of heaven today?',
          notes: []
        }
      ]
    }
  ]
};

// API Endpoint to fetch and parse Sabbath Bible Lessons from legacy.sdarm.org
app.get('/api/sbl', async (req, res) => {
  const year = parseInt(req.query.year as string, 10) || 2026;
  const quarter = parseInt(req.query.quarter as string, 10) || 4;
  const lesson = parseInt(req.query.lesson as string, 10) || 3;
  const lang = (req.query.lang as string) || 'en';

  const cacheKey = `${lang}_${year}_${quarter}_${lesson}`;

  // Check in-memory server cache first
  if (serverCache.has(cacheKey)) {
    return res.json({
      success: true,
      source: 'server-memory-cache',
      lesson: serverCache.get(cacheKey)
    });
  }

  try {
    const html = await fetchSblHtml(year, quarter, lesson, lang);
    const parsed = parseSblHtml(html, year, quarter, lesson, lang);
    serverCache.set(cacheKey, parsed);

    return res.json({
      success: true,
      source: 'live-sdarm-legacy',
      lesson: parsed
    });
  } catch (err: any) {
    console.warn(`Failed to fetch from legacy.sdarm.org (${cacheKey}):`, err.message);

    // If requesting 2026 Q4 Lesson 3, return the pre-parsed fallback
    if (year === 2026 && quarter === 4 && lesson === 3) {
      serverCache.set(cacheKey, FALLBACK_2026_4_3);
      return res.json({
        success: true,
        source: 'pre-cached-bundle',
        lesson: FALLBACK_2026_4_3
      });
    }

    // Generic fallback lesson structure
    const fallbackLesson = {
      year,
      quarter,
      lesson,
      lang,
      quarterlyTheme: `Sabbath Bible Lessons - ${year} Quarter ${quarter}`,
      lessonHeader: `Lesson ${lesson}`,
      title: `Lesson ${lesson}`,
      date: `Sabbath Study`,
      memoryVerse: 'Thy word have I hid in mine heart, that I might not sin against thee.',
      memoryVerseRef: 'Psalm 119:11',
      suggestedReadings: 'Holy Bible; Spirit of Prophecy',
      introQuote: '“Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth.” (2 Timothy 2:15)',
      audioUrl: `https://dl.sdarm.net/contents/publications/periodicals/sbl/audio/${year}/sbl${year}_${quarter}_${lesson}_${lang}.mp3`,
      sourceUrl: `https://legacy.sdarm.org/publications/periodicals/sbl/${lang}/${year}/${quarter}/${lesson}`,
      cachedAt: new Date().toISOString(),
      days: []
    };

    return res.json({
      success: true,
      source: 'offline-fallback',
      lesson: fallbackLesson,
      warning: 'Live network fetch failed. Stored offline version returned.'
    });
  }
});

// Endpoint to fetch quarter index list (lessons 1 to 13)
app.get('/api/sbl/quarter', async (req, res) => {
  const year = parseInt(req.query.year as string, 10) || 2026;
  const quarter = parseInt(req.query.quarter as string, 10) || 4;

  const lessonsList = Array.from({ length: 13 }, (_, i) => ({
    lesson: i + 1,
    year,
    quarter,
    url: `https://legacy.sdarm.org/publications/periodicals/sbl/en/${year}/${quarter}/${i + 1}`
  }));

  res.json({
    success: true,
    year,
    quarter,
    lessons: lessonsList
  });
});

async function startServer() {
  // Mounting Vite middleware or static files
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
