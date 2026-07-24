import { questions as bank1 } from './questions1.js';
import { questions as bank2 } from './questions2.js';
import { questions as bank3 } from './questions3.js';
import { questions as bank4 } from './questions4.js';
import { questions as bank5 } from './questions5.js';
import { questions as bank6 } from './questions6.js';

function normalizeBank(bankId, label, questions) {
  return questions.map((question, index) => ({
    ...question,
    id: `${bankId}-${question.id ?? index + 1}`,
    originalId: question.id ?? index + 1,
    bankId,
    bankLabel: label,
  }));
}

export const QUESTION_BANKS = [
  {
    id: 'bank1',
    label: 'ACC 模拟卷一',
    description: '进阶综合卷：教练边界、合约与核心能力判断。',
    questions: normalizeBank('bank1', '模拟卷一', bank1),
  },
  {
    id: 'bank2',
    label: 'ACC 模拟卷二',
    description: '进阶伦理卷：组织赞助、保密与多重关系。',
    questions: normalizeBank('bank2', '模拟卷二', bank2),
  },
  {
    id: 'bank3',
    label: 'ACC 模拟卷三',
    description: '进阶情境卷：边界、转介与行为选择。',
    questions: normalizeBank('bank3', '模拟卷三', bank3),
  },
  {
    id: 'bank4',
    label: 'ACC 模拟卷四',
    description: '对话决策卷：下一步、遗漏辨识、关系修复与成长整合。',
    questions: normalizeBank('bank4', '模拟卷四', bank4),
  },
  {
    id: 'bank5',
    label: 'ACC 模拟卷五',
    description: '组织伦理卷：第三方信息、利益冲突、处理顺序与督导。',
    questions: normalizeBank('bank5', '模拟卷五', bank5),
  },
  {
    id: 'bank6',
    label: 'ACC 模拟卷六',
    description: '能力辨识卷：风险递进、偏见假设、细微回应与客户主体性。',
    questions: normalizeBank('bank6', '模拟卷六', bank6),
  },
];

export function getBank(bankId) {
  return QUESTION_BANKS.find((bank) => bank.id === bankId) ?? QUESTION_BANKS[0];
}
