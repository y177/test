require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const { format } = require('date-fns');

/**
 * Obsidian Vault Manager
 */
class ObsidianVaultManager {
  constructor(vaultPath) {
    this.vaultPath = vaultPath || process.env.VAULT_PATH || './vault';
    this.templatesPath = process.env.TEMPLATES_PATH || './templates';
  }

  /**
   * 새 노트 생성
   */
  async createNote(title, content = '', frontMatter = {}) {
    const fileName = this.sanitizeFileName(title);
    const filePath = path.join(this.vaultPath, `${fileName}.md`);

    const defaultFrontMatter = {
      title,
      date: format(new Date(), 'yyyy-MM-dd'),
      tags: [],
      ...frontMatter,
    };

    const noteContent = this.buildNoteContent(defaultFrontMatter, content);

    try {
      await fs.writeFile(filePath, noteContent, 'utf-8');
      console.log(`✅ 노트 생성 완료: ${fileName}.md`);
      return filePath;
    } catch (error) {
      console.error('❌ 노트 생성 실패:', error.message);
      throw error;
    }
  }

  /**
   * Daily Note 생성
   */
  async createDailyNote(date = new Date()) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const title = dateStr;

    const frontMatter = {
      title: dateStr,
      date: dateStr,
      tags: ['daily-note'],
    };

    const content = `
# ${dateStr}

## 오늘의 할 일
- [ ]

## 메모


## 회고


---
이전: [[${format(new Date(date - 86400000), 'yyyy-MM-dd')}]]
다음: [[${format(new Date(date.getTime() + 86400000), 'yyyy-MM-dd')}]]
`;

    const dailyPath = path.join(this.vaultPath, '10-daily');
    await fs.mkdir(dailyPath, { recursive: true });

    const filePath = path.join(dailyPath, `${dateStr}.md`);
    const noteContent = this.buildNoteContent(frontMatter, content);

    await fs.writeFile(filePath, noteContent, 'utf-8');
    console.log(`✅ Daily Note 생성: ${dateStr}.md`);
    return filePath;
  }

  /**
   * 파일명 정리
   */
  sanitizeFileName(title) {
    return title
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * 노트 콘텐츠 빌드
   */
  buildNoteContent(frontMatter, content) {
    const yamlStr = yaml.dump(frontMatter);
    return `---\n${yamlStr}---\n${content}`;
  }

  /**
   * Vault 통계
   */
  async getVaultStats() {
    const files = await this.getAllNotes();

    return {
      totalNotes: files.length,
      vaultPath: this.vaultPath,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * 모든 노트 가져오기
   */
  async getAllNotes() {
    const glob = require('glob');
    const pattern = path.join(this.vaultPath, '**/*.md');

    return new Promise((resolve, reject) => {
      glob.glob(pattern, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });
  }
}

// 실행 예제
async function main() {
  const manager = new ObsidianVaultManager();

  console.log('📚 Obsidian Vault Manager 시작...');
  console.log('\n📝 사용 가능한 기능:');
  console.log('  - createNote(title, content, frontMatter)');
  console.log('  - createDailyNote(date)');
  console.log('  - getVaultStats()');
  console.log('\n💡 Claude Code와 함께 사용하여 Obsidian vault를 관리하세요!');

  const stats = await manager.getVaultStats();
  console.log('\n📊 Vault 통계:', stats);
}

if (require.main === module) {
  main();
}

module.exports = ObsidianVaultManager;
