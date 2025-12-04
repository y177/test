require('dotenv').config();
const { Client } = require('@notionhq/client');

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

/**
 * Notion Manager 메인 클래스
 */
class NotionManager {
  constructor() {
    this.notion = notion;
  }

  /**
   * 새 페이지 생성
   */
  async createPage(parentId, title, content = []) {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: parentId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
        },
        children: content,
      });

      console.log('✅ 페이지 생성 완료:', response.url);
      return response;
    } catch (error) {
      console.error('❌ 페이지 생성 실패:', error.message);
      throw error;
    }
  }

  /**
   * 데이터베이스 쿼리
   */
  async queryDatabase(databaseId, filter = {}) {
    try {
      const response = await this.notion.databases.query({
        database_id: databaseId,
        filter,
      });

      console.log(`✅ ${response.results.length}개 항목 조회됨`);
      return response.results;
    } catch (error) {
      console.error('❌ 데이터베이스 쿼리 실패:', error.message);
      throw error;
    }
  }

  /**
   * 페이지 콘텐츠 업데이트
   */
  async updatePage(pageId, properties) {
    try {
      const response = await this.notion.pages.update({
        page_id: pageId,
        properties,
      });

      console.log('✅ 페이지 업데이트 완료');
      return response;
    } catch (error) {
      console.error('❌ 페이지 업데이트 실패:', error.message);
      throw error;
    }
  }
}

// 실행 예제
async function main() {
  const manager = new NotionManager();

  console.log('🚀 Notion Manager 시작...');
  console.log('📝 사용 가능한 기능:');
  console.log('  - createPage(parentId, title, content)');
  console.log('  - queryDatabase(databaseId, filter)');
  console.log('  - updatePage(pageId, properties)');
  console.log('\n💡 Claude Code와 함께 사용하여 Notion을 자동화하세요!');
}

if (require.main === module) {
  main();
}

module.exports = NotionManager;
