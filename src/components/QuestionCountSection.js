import React from 'react';
import NumberInputSection from './NumberInputSection';

const QuestionCountSection = ({ value, onChange }) => (
  <NumberInputSection title="عدد الأسئلة" value={value} onChange={onChange} />
);

export default QuestionCountSection;
