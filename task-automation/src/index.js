require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const cron = require('node-cron');

/**
 * Task Automation Engine
 */
class TaskAutomation {
  constructor() {
    this.workflowsDir = process.env.WORKFLOWS_DIR || './workflows';
    this.workflows = new Map();
    this.scheduledTasks = new Map();
  }

  /**
   * 워크플로우 로드
   */
  async loadWorkflow(name) {
    const filePath = path.join(this.workflowsDir, `${name}.yaml`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const workflow = yaml.load(content);

      this.workflows.set(name, workflow);
      console.log(`✅ 워크플로우 로드: ${name}`);

      return workflow;
    } catch (error) {
      console.error(`❌ 워크플로우 로드 실패: ${name}`, error.message);
      throw error;
    }
  }

  /**
   * 모든 워크플로우 로드
   */
  async loadAllWorkflows() {
    try {
      const files = await fs.readdir(this.workflowsDir);
      const yamlFiles = files.filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));

      for (const file of yamlFiles) {
        const name = file.replace(/\.(yaml|yml)$/, '');
        await this.loadWorkflow(name);
      }

      console.log(`✅ ${yamlFiles.length}개 워크플로우 로드 완료`);
    } catch (error) {
      console.error('❌ 워크플로우 로드 실패:', error.message);
    }
  }

  /**
   * 워크플로우 실행
   */
  async runWorkflow(name, context = {}) {
    const workflow = this.workflows.get(name);

    if (!workflow) {
      throw new Error(`워크플로우를 찾을 수 없습니다: ${name}`);
    }

    console.log(`🚀 워크플로우 시작: ${workflow.name || name}`);

    const results = [];

    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        console.log(`  📝 Step ${i + 1}: ${step.name}`);

        const result = await this.executeStep(step, { ...context, steps: results });
        results.push(result);

        console.log(`  ✅ Step ${i + 1} 완료`);
      }

      console.log(`✅ 워크플로우 완료: ${workflow.name || name}`);
      return results;
    } catch (error) {
      console.error(`❌ 워크플로우 실패: ${workflow.name || name}`, error.message);
      throw error;
    }
  }

  /**
   * 스텝 실행
   */
  async executeStep(step, context) {
    const [category, action] = step.action.split('.');

    // 액션 실행기 맵
    const executors = {
      script: this.executeScript.bind(this),
      file: this.executeFileAction.bind(this),
      http: this.executeHttpAction.bind(this),
      template: this.executeTemplate.bind(this),
      github: this.executeGitHubAction.bind(this),
      slack: this.executeSlackAction.bind(this),
    };

    const executor = executors[category];

    if (!executor) {
      throw new Error(`지원하지 않는 액션: ${step.action}`);
    }

    return await executor(action, step.params, context);
  }

  /**
   * 스크립트 실행
   */
  async executeScript(action, params, context) {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    if (action === 'run') {
      const { stdout, stderr } = await execAsync(params.command);
      return { stdout, stderr };
    }

    throw new Error(`지원하지 않는 스크립트 액션: ${action}`);
  }

  /**
   * 파일 액션 실행
   */
  async executeFileAction(action, params, context) {
    switch (action) {
      case 'read':
        return await fs.readFile(params.path, 'utf-8');

      case 'write':
        await fs.writeFile(params.path, params.content, 'utf-8');
        return { success: true };

      case 'copy':
        await fs.copyFile(params.source, params.destination);
        return { success: true };

      case 'delete':
        await fs.unlink(params.path);
        return { success: true };

      default:
        throw new Error(`지원하지 않는 파일 액션: ${action}`);
    }
  }

  /**
   * HTTP 액션 실행
   */
  async executeHttpAction(action, params, context) {
    const axios = require('axios');

    if (action === 'request') {
      const response = await axios({
        method: params.method || 'GET',
        url: params.url,
        data: params.data,
        headers: params.headers,
      });

      return response.data;
    }

    throw new Error(`지원하지 않는 HTTP 액션: ${action}`);
  }

  /**
   * 템플릿 실행
   */
  async executeTemplate(action, params, context) {
    if (action === 'render') {
      const templatePath = path.join(this.workflowsDir, 'templates', params.template);
      let template = await fs.readFile(templatePath, 'utf-8');

      // 간단한 변수 치환
      template = template.replace(/\{\{\s*(\S+)\s*\}\}/g, (match, key) => {
        return this.getNestedValue(context, key) || match;
      });

      return template;
    }

    throw new Error(`지원하지 않는 템플릿 액션: ${action}`);
  }

  /**
   * GitHub 액션 실행 (placeholder)
   */
  async executeGitHubAction(action, params, context) {
    console.log(`GitHub 액션 실행: ${action}`, params);
    return { placeholder: true, action, params };
  }

  /**
   * Slack 액션 실행 (placeholder)
   */
  async executeSlackAction(action, params, context) {
    console.log(`Slack 액션 실행: ${action}`, params);
    return { placeholder: true, action, params };
  }

  /**
   * 중첩된 객체 값 가져오기
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * 스케줄러 시작
   */
  startScheduler() {
    this.workflows.forEach((workflow, name) => {
      if (workflow.schedule) {
        const task = cron.schedule(workflow.schedule, async () => {
          console.log(`⏰ 스케줄 실행: ${name}`);
          await this.runWorkflow(name);
        });

        this.scheduledTasks.set(name, task);
        console.log(`⏰ 스케줄 등록: ${name} (${workflow.schedule})`);
      }
    });
  }

  /**
   * 스케줄러 중지
   */
  stopScheduler() {
    this.scheduledTasks.forEach((task, name) => {
      task.stop();
      console.log(`⏸️  스케줄 중지: ${name}`);
    });

    this.scheduledTasks.clear();
  }
}

// 실행 예제
async function main() {
  const automation = new TaskAutomation();

  console.log('🤖 Task Automation 시작...\n');
  console.log('📝 사용 가능한 기능:');
  console.log('  - loadWorkflow(name)');
  console.log('  - runWorkflow(name, context)');
  console.log('  - startScheduler()');
  console.log('\n💡 Claude Code와 함께 사용하여 작업을 자동화하세요!');
  console.log('\n명령어:');
  console.log('  npm run workflow <name>  - 워크플로우 실행');
  console.log('  npm run schedule         - 스케줄러 시작');
  console.log('  npm run list            - 워크플로우 목록');
}

if (require.main === module) {
  main();
}

module.exports = TaskAutomation;
