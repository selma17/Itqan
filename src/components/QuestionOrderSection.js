import React from 'react';
import SectionCard from './SectionCard';
import RadioOptionGroup from './RadioOptionGroup';
import { QUESTION_ORDER_OPTIONS } from '../constants/testModes';

const QuestionOrderSection = ({ mode, onChange, options = QUESTION_ORDER_OPTIONS }) => (
  <SectionCard title="ترتيب الأسئلة">
    <RadioOptionGroup options={options} value={mode} onChange={onChange} />
  </SectionCard>
);

export default QuestionOrderSection;
