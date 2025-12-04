require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const { format, parse } = require('date-fns');

/**
 * Daily Journal Manager
 */
class DailyJournal {
  constructor() {
    this.journalDir = process.env.JOURNAL_DIR || './entries';
    this.templateDir = process.env.TEMPLATE_DIR || './templates';
  }

  /**
   * 저널 파일 경로 생성
   */
  getJournalPath(date, type = 'morning') {
    const dateObj = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
    const year = format(dateObj, 'yyyy');
    const month = format(dateObj, 'MM');
    const dateStr = format(dateObj, 'yyyy-MM-dd');

    const dir = path.join(this.journalDir, year, month);
    const filename = `${dateStr}-${type}.md`;

    return {
      dir,
      path: path.join(dir, filename),
      filename,
    };
  }

  /**
   * 저널 생성
   */
  async createJournal(date, type, data) {
    const { dir, path: filePath } = this.getJournalPath(date, type);

    // 디렉토리 생성
    await fs.mkdir(dir, { recursive: true });

    // Front Matter 생성
    const frontMatter = {
      date: format(date, 'yyyy-MM-dd'),
      type,
      mood: data.mood || null,
      weather: data.weather || null,
      tags: data.tags || [],
      ...data.frontMatter,
    };

    // 템플릿 로드
    const template = await this.loadTemplate(type);

    // 콘텐츠 생성
    const content = this.buildJournalContent(frontMatter, template, data);

    // 파일 저장
    await fs.writeFile(filePath, content, 'utf-8');

    console.log(`✅ ${type} 저널 생성: ${format(date, 'yyyy-MM-dd')}`);
    return filePath;
  }

  /**
   * 템플릿 로드
   */
  async loadTemplate(type) {
    const templatePath = path.join(this.templateDir, `${type}.md`);

    try {
      return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      return this.getDefaultTemplate(type);
    }
  }

  /**
   * 기본 템플릿
   */
  getDefaultTemplate(type) {
    const templates = {
      morning: `
# 🌅 {{date}} 아침

## 😊 오늘의 기분
{{mood}}/10

## 🎯 오늘의 목표
{{goals}}

## 🙏 감사한 일
{{gratitude}}

## 💭 아침 생각
{{thoughts}}
`,
      evening: `
# 🌙 {{date}} 저녁

## 📝 오늘의 하이라이트
{{highlights}}

## ✅ 목표 달성도
{{achievements}}

## 🙏 감사한 일
{{gratitude}}

## 💡 배운 점
{{learned}}

## 🔄 개선할 점
{{improvements}}
`,
    };

    return templates[type] || '# {{date}}\n\n';
  }

  /**
   * 저널 콘텐츠 빌드
   */
  buildJournalContent(frontMatter, template, data) {
    const yamlStr = yaml.dump(frontMatter);

    // 템플릿 변수 치환
    let content = template
      .replace(/\{\{date\}\}/g, frontMatter.date)
      .replace(/\{\{mood\}\}/g, data.mood || '')
      .replace(/\{\{goals\}\}/g, this.formatList(data.goals))
      .replace(/\{\{gratitude\}\}/g, this.formatList(data.gratitude))
      .replace(/\{\{thoughts\}\}/g, data.thoughts || '')
      .replace(/\{\{highlights\}\}/g, data.highlights || '')
      .replace(/\{\{achievements\}\}/g, this.formatList(data.achievements))
      .replace(/\{\{learned\}\}/g, data.learned || '')
      .replace(/\{\{improvements\}\}/g, data.improvements || '');

    return `---\n${yamlStr}---\n${content}`;
  }

  /**
   * 리스트 포맷
   */
  formatList(items) {
    if (!items) return '';
    if (Array.isArray(items)) {
      return items.map((item) => `- ${item}`).join('\n');
    }
    return items;
  }

  /**
   * 저널 읽기
   */
  async readJournal(date, type) {
    const { path: filePath } = this.getJournalPath(date, type);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      console.error(`❌ 저널을 찾을 수 없습니다: ${filePath}`);
      return null;
    }
  }

  /**
   * 기간별 저널 목록
   */
  async getJournalsByPeriod(startDate, endDate) {
    const glob = require('glob');
    const pattern = path.join(this.journalDir, '**/*.md');

    return new Promise((resolve, reject) => {
      glob.glob(pattern, (err, files) => {
        if (err) reject(err);
        else {
          // 날짜 필터링
          const filtered = files.filter((file) => {
            const match = file.match(/(\d{4}-\d{2}-\d{2})/);
            if (match) {
              const fileDate = new Date(match[1]);
              return fileDate >= startDate && fileDate <= endDate;
            }
            return false;
          });
          resolve(filtered);
        }
      });
    });
  }
}

// 실행 예제
async function main() {
  const journal = new DailyJournal();

  console.log('📔 Daily Journal 시작...\n');
  console.log('📝 사용 가능한 기능:');
  console.log('  - createJournal(date, type, data)');
  console.log('  - readJournal(date, type)');
  console.log('  - getJournalsByPeriod(startDate, endDate)');
  console.log('\n💡 Claude Code와 함께 사용하여 일기를 작성하세요!');
  console.log('\n명령어:');
  console.log('  npm run morning  - 아침 저널');
  console.log('  npm run evening  - 저녁 저널');
  console.log('  npm run analyze  - 분석 리포트');
}

if (require.main === module) {
  main();
}

module.exports = DailyJournal;
