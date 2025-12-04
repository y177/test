require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { format } = require('date-fns');

/**
 * Finance Tracker 메인 클래스
 */
class FinanceTracker {
  constructor() {
    this.dataDir = process.env.DATA_DIR || './data';
    this.dbPath = path.join(this.dataDir, 'finance.db');
    this.currency = process.env.CURRENCY || 'KRW';

    this.ensureDataDir();
    this.db = new Database(this.dbPath);
    this.initDatabase();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  initDatabase() {
    // 지출 테이블
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        payment_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 수입 테이블
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS income (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        source TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 예산 테이블
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        UNIQUE(month, category)
      )
    `);

    console.log('✅ 데이터베이스 초기화 완료');
  }

  /**
   * 지출 추가
   */
  addExpense(expense) {
    const stmt = this.db.prepare(`
      INSERT INTO expenses (amount, category, date, description, payment_method)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      expense.amount,
      expense.category,
      expense.date || format(new Date(), 'yyyy-MM-dd'),
      expense.description || '',
      expense.paymentMethod || '현금'
    );

    console.log(`✅ 지출 추가: ${expense.category} - ${this.formatCurrency(expense.amount)}`);
    return result.lastInsertRowid;
  }

  /**
   * 월간 지출 조회
   */
  getMonthlyExpenses(month) {
    const stmt = this.db.prepare(`
      SELECT * FROM expenses
      WHERE strftime('%Y-%m', date) = ?
      ORDER BY date DESC
    `);

    return stmt.all(month);
  }

  /**
   * 카테고리별 통계
   */
  getCategoryStats(month) {
    const stmt = this.db.prepare(`
      SELECT
        category,
        COUNT(*) as count,
        SUM(amount) as total,
        AVG(amount) as average
      FROM expenses
      WHERE strftime('%Y-%m', date) = ?
      GROUP BY category
      ORDER BY total DESC
    `);

    return stmt.all(month);
  }

  /**
   * 예산 설정
   */
  setBudget(month, category, amount) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO budgets (month, category, amount)
      VALUES (?, ?, ?)
    `);

    stmt.run(month, category, amount);
    console.log(`✅ 예산 설정: ${category} - ${this.formatCurrency(amount)}`);
  }

  /**
   * 예산 vs 실제 지출
   */
  getBudgetComparison(month) {
    const stmt = this.db.prepare(`
      SELECT
        b.category,
        b.amount as budget,
        COALESCE(SUM(e.amount), 0) as spent,
        b.amount - COALESCE(SUM(e.amount), 0) as remaining,
        ROUND((COALESCE(SUM(e.amount), 0) / b.amount) * 100, 2) as usage_percent
      FROM budgets b
      LEFT JOIN expenses e ON b.category = e.category
        AND strftime('%Y-%m', e.date) = b.month
      WHERE b.month = ?
      GROUP BY b.category, b.amount
    `);

    return stmt.all(month);
  }

  /**
   * 통화 포맷
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: this.currency,
    }).format(amount);
  }

  /**
   * 데이터베이스 닫기
   */
  close() {
    this.db.close();
  }
}

// 실행 예제
async function main() {
  const tracker = new FinanceTracker();

  console.log('💰 Finance Tracker 시작...\n');
  console.log('📝 사용 가능한 기능:');
  console.log('  - addExpense(expense)');
  console.log('  - getMonthlyExpenses(month)');
  console.log('  - getCategoryStats(month)');
  console.log('  - setBudget(month, category, amount)');
  console.log('  - getBudgetComparison(month)');
  console.log('\n💡 Claude Code와 함께 사용하여 재무를 관리하세요!');

  // 예제 지출 추가
  // tracker.addExpense({
  //   amount: 15000,
  //   category: '식비',
  //   description: '점심 식사'
  // });
}

if (require.main === module) {
  main();
}

module.exports = FinanceTracker;
