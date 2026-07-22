import { questions as bank1 } from './questions1.js';
import { questions as bank2 } from './questions2.js';
import { questions as bank3 } from './questions3.js';

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
    description: '60 题完整模拟卷，侧重教练边界、合约与核心能力判断。',
    questions: normalizeBank('bank1', '模拟卷一', bank1),
  },
  {
    id: 'bank2',
    label: 'ACC 模拟卷二',
    description: '60 题完整模拟卷，侧重组织赞助、保密、伦理与多重关系。',
    questions: normalizeBank('bank2', '模拟卷二', bank2),
  },
  {
    id: 'bank3',
    label: 'ACC 模拟卷三',
    description: '60 题完整模拟卷，侧重情境辨识、转介及教练行为选择。',
    questions: normalizeBank('bank3', '模拟卷三', bank3),
  },
];

export function getBank(bankId) {
  return QUESTION_BANKS.find((bank) => bank.id === bankId) ?? QUESTION_BANKS[0];
}
