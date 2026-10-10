import React from 'react';
import SectionCard from './SectionCard';
import RadioOptionGroup from './RadioOptionGroup';
import { SHOW_SURAH_NAME_OPTIONS } from '../constants/testModes';

const ShowSurahNameSection = ({ value, onChange }) => (
  <SectionCard title="عرض اسم السورة التي ورد فيها الموضع">
    <RadioOptionGroup horizontal options={SHOW_SURAH_NAME_OPTIONS} value={value} onChange={onChange} />
  </SectionCard>
);

export default ShowSurahNameSection;
