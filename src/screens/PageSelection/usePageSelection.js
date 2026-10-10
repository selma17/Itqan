import { useState } from 'react';
import { Alert } from 'react-native';
import useTestSetupForm from '../../hooks/useTestSetupForm';

const MIN_PAGE = 1;
const MAX_PAGE = 604;

const isPageInRange = (page) => page >= MIN_PAGE && page <= MAX_PAGE;

// On ne garde que les chiffres saisis.
const digitsOnly = (text) => text.replace(/[^0-9]/g, '');

const usePageSelection = (navigation) => {
  const form = useTestSetupForm();
  const [pageFrom, setPageFrom] = useState('');
  const [pageTo, setPageTo] = useState('');

  const from = parseInt(pageFrom, 10);
  const to = parseInt(pageTo, 10);

  const isRangeValid = !!pageFrom && !!pageTo && isPageInRange(from) && isPageInRange(to) && from <= to;
  const pageCount = isRangeValid ? to - from + 1 : 0;

  const isButtonDisabled = !isRangeValid || form.isCountMissing;
  const disabledLabel = form.getDisabledLabel('أدخل نطاق الصفحات');

  const handleStartTest = () => {
    if (!pageFrom || !pageTo) {
      Alert.alert('تنبيه', 'الرجاء إدخال نطاق الصفحات');
      return;
    }
    if (!isPageInRange(from) || !isPageInRange(to)) {
      Alert.alert('خطأ', `يجب أن تكون الصفحات بين ${MIN_PAGE} و ${MAX_PAGE}`);
      return;
    }
    if (from > to) {
      Alert.alert('خطأ', 'رقم الصفحة الأولى يجب أن يكون أقل من أو يساوي رقم الصفحة الأخيرة');
      return;
    }
    if (!form.validateQuestionCount()) return;

    navigation.navigate('Duaa', {
      testType: 'pages',
      pageFrom: from,
      pageTo: to,
      ...form.getCommonParams(),
    });
  };

  return {
    form,
    pageFrom,
    pageTo,
    setPageFrom: (text) => setPageFrom(digitsOnly(text)),
    setPageTo: (text) => setPageTo(digitsOnly(text)),
    isRangeValid,
    pageCount,
    isButtonDisabled,
    disabledLabel,
    handleStartTest,
    goBack: () => navigation.goBack(),
  };
};

export default usePageSelection;
